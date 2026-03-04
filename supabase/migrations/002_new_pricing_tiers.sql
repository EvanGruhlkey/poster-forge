-- Add download quota column to plans
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS monthly_download_quota integer;

-- Cancel and remove subscriptions on old plans
UPDATE public.subscriptions SET status = 'cancelled'
WHERE plan_slug IN ('day_pass', 'business');

DELETE FROM public.subscriptions
WHERE plan_slug IN ('day_pass', 'business');

-- Remove old plans
DELETE FROM public.plans WHERE slug IN ('day_pass', 'business');

-- Update existing pro plan
UPDATE public.plans
SET name = 'Pro',
    price_monthly = 15.00,
    monthly_quota = 25,
    monthly_download_quota = 10,
    day_pass_hours = null
WHERE slug = 'pro';

-- Insert new plans
INSERT INTO public.plans (slug, name, price_monthly, monthly_quota, monthly_download_quota, day_pass_hours)
VALUES
  ('basic', 'Basic', 5.00, 10, 2, null),
  ('pro_plus', 'Pro+', 25.00, null, null, null)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price_monthly = EXCLUDED.price_monthly,
  monthly_quota = EXCLUDED.monthly_quota,
  monthly_download_quota = EXCLUDED.monthly_download_quota;
