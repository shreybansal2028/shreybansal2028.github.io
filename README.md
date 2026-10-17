# Vibe Check ⚡

> No scrolling. No deciding. What to wear, eat, and watch — in under 10 seconds.

## Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **AI**: OpenAI GPT-4o (Structured Outputs via Zod) + GPT-4o-mini for re-spins
- **Auth + DB**: Supabase (Postgres + RLS + Google OAuth + Magic Link)
- **Weather**: Open-Meteo (no API key) + IP fallback via ipapi.co
- **Hosting**: Vercel (Edge runtime for OG image generation)

## Getting Started

### 1. Clone & install
```bash
git clone <repo>
cd vibe-check
npm install
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. In **Authentication → Providers**, enable **Google** (add OAuth credentials) and **Email** (magic link)
4. In **Authentication → URL Configuration**, add:
   - Site URL: `http://localhost:3000` (dev) / your Vercel URL (prod)
   - Redirect URL: `http://localhost:3000/api/auth/callback`

### 3. Configure environment variables
```bash
cp .env.local.example .env.local
```
Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=       # Project URL from Supabase dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Anon key from Supabase dashboard
SUPABASE_SERVICE_ROLE_KEY=      # Service role key (keep secret!)
OPENAI_API_KEY=                 # From platform.openai.com
```

### 4. Run locally
```bash
npm run dev
```

## Deploy to Vercel
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all 4 env variables in Vercel project settings
4. Update Supabase redirect URLs to your `*.vercel.app` domain
5. Deploy ✅

## Architecture Highlights

### Anti-Repetition
- Previous day's vibe is passed into GPT-4o context → no repeated suggestions
- `last_used_at` tracked per inventory item, LRU-weighted sampling prevents repetition

### Token Cost Control
- Max 10 closet + 10 fridge items sampled per check-in (LRU-weighted)
- Re-spins use cheaper GPT-4o-mini model

### Weather Resilience
- Browser Geolocation → IP-based fallback (ipapi.co) if denied → hardcoded default
- Zero friction: user never sees a failure state

### Security
- Row Level Security (RLS) on all tables: `auth.uid() = user_id`
- Service role key never exposed to client

### OG Image Sharing
- `/api/og?outfit=...&meal=...&watch=...` → dynamic 1200×630 image via `@vercel/og`
- Edge runtime for instant generation

## File Structure
```
src/
├── app/
│   ├── page.tsx              # Landing
│   ├── login/page.tsx        # Auth (Google + Magic Link)
│   ├── check-in/page.tsx     # 2-step daily flow
│   ├── vibe/page.tsx         # Result + spin again
│   ├── inventory/page.tsx    # Closet + fridge manager
│   ├── history/page.tsx      # Past 30 vibes
│   └── api/
│       ├── vibe/route.ts         # Main GPT-4o call
│       ├── vibe/spin/route.ts    # Per-category re-spin (mini)
│       ├── inventory/count/route.ts
│       ├── og/route.tsx          # Shareable image (Edge)
│       └── auth/callback/route.ts
├── lib/
│   ├── supabase/             # Client + server + middleware
│   ├── types.ts              # Shared TypeScript types
│   ├── weather.ts            # Geo + IP fallback weather
│   └── utils.ts              # LRU sampling, cn(), etc.
└── middleware.ts             # Auth route protection
supabase/
└── schema.sql                # Full DB schema with RLS
```
