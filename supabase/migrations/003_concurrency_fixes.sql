-- Concurrency & multi-user safety fixes

-- 1. Atomic job claim using FOR UPDATE SKIP LOCKED
--    Prevents two worker instances from grabbing the same queued job.
CREATE OR REPLACE FUNCTION public.claim_next_job()
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_job_id uuid;
BEGIN
  SELECT id INTO v_job_id
  FROM public.poster_jobs
  WHERE status = 'queued'
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_job_id IS NOT NULL THEN
    UPDATE public.poster_jobs
    SET status = 'running', updated_at = now()
    WHERE id = v_job_id;
  END IF;

  RETURN v_job_id;
END;
$$;

-- 2. Atomic job creation with quota enforcement
--    Uses an advisory lock per user so two concurrent requests from the same
--    user cannot both pass the quota check before either job is recorded.
CREATE OR REPLACE FUNCTION public.create_job_with_quota_check(
  p_user_id uuid,
  p_input jsonb,
  p_config_hash text,
  p_is_preview boolean,
  p_quota integer -- null = unlimited
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
  v_job_id uuid;
  v_period_start timestamptz;
BEGIN
  v_period_start := date_trunc('month', now());

  -- Serialize per-user to prevent concurrent quota bypass
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text));

  IF p_quota IS NOT NULL THEN
    SELECT count(*) INTO v_count
    FROM public.poster_jobs
    WHERE user_id = p_user_id
      AND is_preview = p_is_preview
      AND status IN ('queued', 'running', 'done')
      AND created_at >= v_period_start;

    IF v_count >= p_quota THEN
      IF p_is_preview THEN
        RAISE EXCEPTION 'QUOTA_EXCEEDED:Monthly design limit reached. Upgrade for more.';
      ELSE
        RAISE EXCEPTION 'QUOTA_EXCEEDED:Monthly download limit reached. Upgrade for more.';
      END IF;
    END IF;
  END IF;

  INSERT INTO public.poster_jobs (user_id, status, input, config_hash, is_preview)
  VALUES (p_user_id, 'queued', p_input, p_config_hash, p_is_preview)
  RETURNING id INTO v_job_id;

  RETURN v_job_id;
END;
$$;

-- 3. Atomic usage increment via upsert (prevents lost updates)
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id uuid,
  p_period_start date,
  p_period_end date
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.usage (user_id, period_start, period_end, posters_generated)
  VALUES (p_user_id, p_period_start, p_period_end, 1)
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET posters_generated = public.usage.posters_generated + 1;
END;
$$;

-- 4. Subscription idempotency: track which checkout session created each row
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_checkout_session
  ON public.subscriptions (stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;
