-- PosterForge Database Schema

-- 1. Profiles
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Plans
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price_monthly numeric(10,2) not null,
  monthly_quota integer,
  day_pass_hours integer,
  stripe_price_id text,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;

create policy "Anyone can read plans"
  on public.plans for select using (true);

-- Seed plans
insert into public.plans (slug, name, price_monthly, monthly_quota, day_pass_hours) values
  ('day_pass', 'Day Pass', 19.00, null, 24),
  ('pro', 'Pro Plan', 29.00, 50, null),
  ('business', 'Business', 49.00, 200, null);

-- 3. Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan_slug text not null references public.plans(slug),
  status text not null default 'active',
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_sub_id text,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.subscriptions for all using (true) with check (true);

-- 4. Geocode cache
create table public.geocode_cache (
  id uuid primary key default gen_random_uuid(),
  query_text text unique not null,
  lat double precision not null,
  lon double precision not null,
  display_name text,
  bbox jsonb,
  provider text not null default 'nominatim',
  created_at timestamptz not null default now()
);

alter table public.geocode_cache enable row level security;

create policy "Anyone can read geocode cache"
  on public.geocode_cache for select using (true);

create policy "Authenticated users can insert geocode cache"
  on public.geocode_cache for insert with check (auth.role() = 'authenticated');

-- 5. Poster jobs
create type public.job_status as enum ('queued', 'running', 'done', 'failed');

create table public.poster_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  status public.job_status not null default 'queued',
  input jsonb not null,
  config_hash text not null,
  output jsonb,
  error text,
  is_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.poster_jobs enable row level security;

create policy "Users can view own jobs"
  on public.poster_jobs for select using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.poster_jobs for insert with check (auth.uid() = user_id);

-- Service role handles status updates via admin client

create index idx_poster_jobs_status on public.poster_jobs(status);
create index idx_poster_jobs_user on public.poster_jobs(user_id);
create index idx_poster_jobs_hash on public.poster_jobs(config_hash);

-- 6. Posters (completed poster records)
create table public.posters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  job_id uuid references public.poster_jobs(id),
  title text not null,
  subtitle text,
  location_text text not null,
  config jsonb not null,
  config_hash text not null,
  storage_paths jsonb not null default '{}'::jsonb,
  preview_url text,
  created_at timestamptz not null default now()
);

alter table public.posters enable row level security;

create policy "Users can view own posters"
  on public.posters for select using (auth.uid() = user_id);

create policy "Users can insert own posters"
  on public.posters for insert with check (auth.uid() = user_id);

create policy "Users can delete own posters"
  on public.posters for delete using (auth.uid() = user_id);

create index idx_posters_user on public.posters(user_id);

-- 7. Usage tracking
create table public.usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  period_start date not null,
  period_end date not null,
  posters_generated integer not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, period_start)
);

alter table public.usage enable row level security;

create policy "Users can view own usage"
  on public.usage for select using (auth.uid() = user_id);

-- Storage bucket for posters (private)
insert into storage.buckets (id, name, public)
values ('posters', 'posters', false)
on conflict (id) do nothing;

create policy "Authenticated users can upload posters"
  on storage.objects for insert
  with check (bucket_id = 'posters' and auth.role() = 'authenticated');

create policy "Users can read own poster files"
  on storage.objects for select
  using (bucket_id = 'posters' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Service role full access to posters bucket"
  on storage.objects for all
  using (bucket_id = 'posters')
  with check (bucket_id = 'posters');
