# Poster Armory Web App

A production-ready SaaS web application that lets users generate customizable city map posters and download print-ready files.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth & Database:** Supabase (Auth + Postgres + Storage)
- **Payments:** Stripe (subscriptions + one-time day pass)
- **Poster Generation:** Python CLI (`create_map_poster.py`)
- **Validation:** Zod

## Architecture

```
User → Next.js App → Supabase Auth
                   → API Routes (create job) → poster_jobs table
                                                   ↓
                   Worker (polls) ← poster_jobs (queued)
                       ↓
                   Python CLI (create_map_poster.py)
                       ↓
                   Upload to Supabase Storage
                       ↓
                   Update poster_jobs (done) + create poster record
                       ↓
User ← Download page ← Signed URLs from Supabase Storage
```

## Setup

### 1. Prerequisites

- Node.js 18+
- Python 3.10+ (with dependencies from `requirements.txt`)
- pnpm
- Supabase CLI (optional, for local dev)
- Stripe CLI (optional, for webhook testing)

### 2. Install Dependencies

```bash
pnpm install
pip install -r requirements.txt  # or: uv sync --locked
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_PRICE_DAY_PASS` - Stripe Price ID for Day Pass ($19)
- `STRIPE_PRICE_PRO` - Stripe Price ID for Pro Plan ($29/mo)
- `STRIPE_PRICE_BUSINESS` - Stripe Price ID for Business Plan ($49/mo)

### 4. Database Setup

Run the SQL migration against your Supabase project:

```bash
# Option A: Using Supabase CLI
supabase db push

# Option B: Manual
# Copy contents of supabase/migrations/001_initial.sql
# and run it in the Supabase SQL Editor
```

### 5. Supabase Auth Configuration

In your Supabase dashboard:

1. **Email Auth:** Enable email magic link in Authentication → Providers → Email
2. **Google OAuth:** Enable Google provider with your OAuth credentials
3. **Redirect URLs:** Add `http://localhost:3000/auth/callback` to allowed redirect URLs

### 6. Stripe Configuration

1. Create products & prices in Stripe Dashboard:
   - Day Pass: $19 one-time payment
   - Pro Plan: $29/month subscription
   - Business: $49/month subscription
2. Copy the Price IDs to your `.env.local`
3. For local webhook testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 7. Run Development

```bash
# Start both web server and worker
pnpm dev

# Or run separately:
pnpm dev:web    # Next.js dev server only
pnpm worker     # Worker process only
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (/)
│   ├── layout.tsx                # Root layout
│   ├── pricing/page.tsx          # Pricing page
│   ├── login/page.tsx            # Auth page
│   ├── app/                      # Protected routes (/app/*)
│   │   ├── page.tsx              # Pick Location
│   │   ├── design/[draftId]/     # Customize Poster
│   │   └── library/page.tsx      # My Library
│   ├── download/[jobId]/         # Download page
│   └── api/
│       ├── auth/callback/        # Supabase auth callback
│       ├── jobs/                 # POST (create) + GET (status)
│       └── stripe/               # Checkout + webhook
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── poster-card.tsx
├── lib/
│   ├── supabase/                 # Client, server, admin clients
│   ├── stripe.ts
│   ├── types.ts
│   ├── validations.ts
│   ├── utils.ts
│   └── config-hash.ts
├── scripts/
│   └── worker.ts                 # Background job worker
├── supabase/
│   └── migrations/
│       └── 001_initial.sql       # Database schema + RLS
├── middleware.ts                  # Auth middleware
├── create_map_poster.py          # Python poster CLI (existing)
└── themes/                       # Theme JSON files (existing)
```

## Data Flow

1. **User signs in** via magic link or Google OAuth
2. **Pick Location:** Enter city/country, geocode via Nominatim
3. **Customize:** Choose style, tweak settings, preview
4. **Generate:** POST to `/api/jobs` creates a `poster_jobs` row
5. **Worker** polls for queued jobs, runs Python CLI, uploads to Storage
6. **Download:** Signed URLs served from Supabase Storage

## Plans & Quotas

| Plan | Price | Quota |
|------|-------|-------|
| Day Pass | $19 | Unlimited for 24 hours |
| Pro | $29/mo | 50 maps per month |
| Business | $49/mo | 200 maps per month |

## Caching

Poster configurations are hashed (SHA-256). If a job with the same `config_hash` already exists with outputs, new requests reuse existing storage paths instead of regenerating.
