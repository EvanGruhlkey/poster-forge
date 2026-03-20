-- Production hardening: RLS fix, stuck job recovery, composite index

-- 1. Fix subscriptions RLS: the old "Service role can manage subscriptions"
--    policy used (true)/(true) with no role restriction, granting any
--    authenticated user full read/write on ALL subscriptions.
--    Service role already bypasses RLS, so this policy is unnecessary.
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

-- 2. Composite index for claim_next_job (WHERE status='queued' ORDER BY created_at)
CREATE INDEX IF NOT EXISTS idx_poster_jobs_claim
  ON public.poster_jobs (status, created_at)
  WHERE status = 'queued';

-- 3. Stuck job recovery: reset jobs stuck in 'running' for over 10 minutes.
--    Call via: SELECT recover_stuck_jobs();
--    Wire this to pg_cron or invoke periodically from the worker.
CREATE OR REPLACE FUNCTION public.recover_stuck_jobs(
  p_timeout_minutes integer DEFAULT 10
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
BEGIN
  WITH stuck AS (
    SELECT id
    FROM public.poster_jobs
    WHERE status = 'running'
      AND updated_at < now() - (p_timeout_minutes || ' minutes')::interval
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.poster_jobs
  SET status = 'queued',
      error = NULL,
      updated_at = now()
  WHERE id IN (SELECT id FROM stuck);

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
