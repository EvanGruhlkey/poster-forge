-- Align job quotas with Stripe billing periods (not calendar months).

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS current_period_start timestamptz;

DROP FUNCTION IF EXISTS public.create_job_with_quota_check(uuid, jsonb, text, boolean, integer);

CREATE OR REPLACE FUNCTION public.create_job_with_quota_check(
  p_user_id uuid,
  p_input jsonb,
  p_config_hash text,
  p_is_preview boolean,
  p_quota integer,
  p_period_start timestamptz
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
  v_period_start := coalesce(
    p_period_start,
    date_trunc('month', timezone('utc', now()))
  );

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
