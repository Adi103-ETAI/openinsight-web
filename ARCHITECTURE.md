# Architecture — OpenInsight Marketing Website

> For developers joining the project. Explains **what this is**, **how it's structured**, **how data flows**, and **key decisions**.

---

## 1. Project Identity

| Field | Value |
|---|---|
| Repo | `Adi103-ETAI/openinsight-web` |
| Working branch | `web-insight-3` (do **not** commit to `main`) |
| Role | **Marketing website** for OpenInsight — captures early-access leads, handles contact messages, provides an admin dashboard. Funnels doctors toward the real product app. |
| Stack | Next.js 14 (App Router) · React 18 · TypeScript 5 · Tailwind CSS 4 · CSS Modules |
| Deployment | Vercel (serverless — API routes run as Vercel functions) |
| Database | Supabase (PostgreSQL + Row-Level Security) |
| Email | Resend (transactional email API) |
| Sister repos | `openinsight` (FastAPI backend, `restruct` branch) · `openinsight-ui` (Next.js product app, `nextjs-ui` branch) |

---

## 2. System Architecture

```
                          ┌──────────────────────┐
                          │   Vercel (hosting)   │
                          │                      │
  Browser ──────────────► │  Next.js App Router  │
    │                     │  ├── Static pages     │
    │                     │  └── API routes       │
    │                     └──────┬───────────────┘
    │                            │
    │                     ┌──────┴──────┐
    │                     ▼             ▼
    │               ┌──────────┐  ┌──────────┐
    │               │ Supabase │  │  Resend   │
    │               │ (Postgres│  │  (Email)  │
    │               │  + RLS)  │  │          │
    │               └──────────┘  └──────────┘
    │
    └── Client-side: PostHog + Clarity analytics
```

**Key point:** This is NOT a static site. It uses Vercel serverless functions for API routes that talk to Supabase and Resend.

---

## 3. Data Flow

### 3.1 Early Access Signup

```
Doctor fills form on /early-access
         │
         ▼
POST /api/early-access
  ├── Validate (server-side — never trust client)
  ├── Insert into Supabase: early_access_submissions
  ├── Send admin notification → ADMIN_NOTIFY_EMAIL
  │     FROM: OpenInsight <hello@openinsight.in>
  └── Send welcome email → doctor's inbox
        FROM: Aditya <adii@openinsight.in>
        "Thanks for signing up, Dr. X — I'll be in touch soon"
```

### 3.2 Contact Form

```
User fills form on /contact
         │
         ▼
POST /api/contact
  ├── Validate (server-side)
  ├── Insert into Supabase: contact_messages
  ├── Send admin notification → ADMIN_NOTIFY_EMAIL
  │     FROM: OpenInsight <hello@openinsight.in>
  └── Send auto-reply → user's inbox
        FROM: Aditya <adii@openinsight.in>
        "Got your message, X — I'll get back to you soon"
```

### 3.3 Admin Dashboard

```
Admin visits /admin
         │
         ▼
Auth check via Supabase (JWT email ∈ admin_emails table)
  ├── GET /api/admin/submissions → list all signups + messages
  └── GET /api/admin/export → CSV download
```

---

## 4. Email Architecture

Two distinct FROM addresses (intentional design):

| Address | Used For | Why |
|---|---|---|
| `OpenInsight <hello@openinsight.in>` | Admin notifications | System/brand identity for internal alerts |
| `Aditya <adii@openinsight.in>` | User-facing emails | Personal touch — doctors see a person, not a brand |

### Where emails land

| Email | Goes To | Controlled By |
|---|---|---|
| Signup alert | `ADMIN_NOTIFY_EMAIL` env var | Set in Vercel env vars |
| Contact alert | `ADMIN_NOTIFY_EMAIL` env var | Set in Vercel env vars |
| Welcome to doctor | Doctor's email address | They typed it in the form |
| Contact auto-reply | User's email address | They typed it in the form |
| Replies to `adii@openinsight.in` | Needs GoDaddy email forwarding | DNS-level, not in code |

**Important:** If `ADMIN_NOTIFY_EMAIL` is not set, admin notifications silently fail (code checks `if (!ADMIN_NOTIFY_EMAIL) return`).

---

## 5. Database Schema

See `supabase/migrations/0001_init.sql` for the full DDL.

### Tables

**`early_access_submissions`** — Doctor signups

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, auto-generated |
| created_at | timestamptz | Auto |
| full_name | text | Required |
| email | text | Required, lowercased |
| phone | text | Required, Indian mobile format |
| persona | text | `doctor` / `student` / `professional` |
| specialty | text | Required |
| other_specialty | text | If specialty = 'other' |
| institution | text | Required |
| city | text | Required |
| nmc_number | text | Optional |
| use_case | text | Optional |
| referral_source | text | Optional |
| newsletter_opt_in | boolean | Default true |
| status | text | `new` → `contacted` → `approved` / `rejected` |
| ip_country | text | From Vercel header |
| user_agent | text | Truncated to 500 chars |

**`contact_messages`** — Contact form submissions

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| created_at | timestamptz | Auto |
| name | text | Required |
| email | text | Required |
| subject | text | Optional |
| message | text | Required |
| status | text | `new` → `read` → `responded` / `archived` |
| responded_at | timestamptz | When admin replied |

**`admin_emails`** — Admin allowlist for RLS

| Column | Type | Notes |
|---|---|---|
| email | text | PK |
| created_at | timestamptz | Auto |

### Row-Level Security

- `early_access_submissions`: anyone can INSERT, only admin emails can SELECT/UPDATE/DELETE
- `contact_messages`: anyone can INSERT, only admin emails can SELECT/UPDATE
- `admin_emails`: anyone can SELECT (needed for RLS evaluation), only service role can INSERT

---

## 6. Repository Structure

```
openinsight-web/
├── app/
│   ├── layout.tsx                    # Root layout: Nav + Footer + SEO + JSON-LD
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Design tokens + utility classes
│   ├── product/page.tsx
│   ├── for-doctors/page.tsx
│   ├── evidence/page.tsx
│   ├── about/page.tsx
│   ├── early-access/page.tsx
│   ├── contact/page.tsx
│   ├── admin/page.tsx                # Auth-gated admin dashboard
│   ├── api/
│   │   ├── early-access/route.ts     # POST: signup → Supabase + Resend
│   │   ├── contact/route.ts          # POST: contact → Supabase + Resend
│   │   └── admin/
│   │       ├── submissions/route.ts  # GET: list submissions
│   │       └── export/route.ts       # GET: CSV export
│   ├── sitemap.ts
│   └── robots.ts
├── components/                       # 16 React components (see README)
├── lib/
│   ├── resend.ts                     # 4 email functions + helpers
│   ├── posthog/provider.tsx          # Analytics wrapper
│   ├── clarity/script.tsx            # Clarity script loader
│   └── supabase/
│       ├── server.ts                 # Server client (service role key)
│       ├── client.ts                 # Browser client (anon key)
│       └── admin-auth.ts             # Admin auth check
├── supabase/migrations/              # SQL migrations
├── public/logos/                     # Brand assets
├── .env.example                      # Env var template with docs
└── next.config.js                    # Vercel deployment config
```

---

## 7. Key Design Decisions

### 7.1 Vercel Serverless (not static export)

The site was originally static-export only. It now uses Vercel serverless functions because:
- API routes (`/api/early-access`, `/api/contact`, `/api/admin/*`) need a server runtime
- Supabase queries require the service role key (server-only)
- Resend sends emails from the server (API key must stay secret)

`next.config.js` does NOT have `output: 'export'` — Vercel handles this automatically.

### 7.2 Two FROM addresses

Using `OpenInsight <hello@openinsight.in>` for system emails and `Aditya <adii@openinsight.in>` for user-facing emails is intentional:
- Doctors see a personal email from the founder → builds trust
- Admin notifications come from the brand → clear separation in your inbox
- Both addresses use `@openinsight.in` (domain verified in Resend)

### 7.3 Best-effort emails

All email sends are wrapped in `Promise.allSettled()` and errors are logged but don't fail the HTTP response. The Supabase row is the source of truth — if Resend is down, the data is still saved.

### 7.4 Client-side draft persistence

`EarlyAccessForm` auto-saves drafts to `localStorage` so users don't lose progress if they navigate away. The draft is cleared after successful submission. No submission data is saved to localStorage — Supabase is the only source of truth.

---

## 8. Design System

- **Typography**: DM Serif Display (headings) · DM Sans (body)
- **Palette** (CSS variables in `app/globals.css`):
  - `--color-accent` `#C56B4A` (terracotta)
  - `--color-accent-2` `#A3522F` (hover)
  - `--color-dark` `#1C1B1A`
  - `--color-bg` `#FAFAF8` (warm white)
  - `--color-surface` `#FFFFFF`
- **Spacing**: 8px base unit (`--spacing-1` through `--spacing-16`)
- See `DESIGN_SYSTEM.md` and `DESIGN_QUICK_REFERENCE.md` for full reference.

---

## 9. SEO & Structured Data

- `metadataBase` + canonical + OpenGraph + Twitter cards + 16 keywords
- **JSON-LD**: `MedicalBusiness` + `Organization` and `WebSite` schemas
- `sitemap.xml` (auto-generated, all routes with priorities)
- `robots.txt` with sitemap reference

---

## 10. Accessibility

- All interactive components have ARIA labels and keyboard support
- Carousel supports ←/→, accordion supports Enter/Space
- All animations respect `@media (prefers-reduced-motion: reduce)`
- Semantic HTML throughout
- Focus-visible styles with terracotta outline

---

## 11. Adding a New Page

1. Create `app/your-page/page.tsx`
2. Export `metadata` for SEO
3. Add route to `app/sitemap.ts`
4. If it needs a form → create API route in `app/api/your-page/route.ts`
5. If it sends email → add functions to `lib/resend.ts`

---

## 12. Common Operations

### Add a new admin user
```sql
INSERT INTO public.admin_emails (email) VALUES ('newadmin@example.com')
ON CONFLICT (email) DO NOTHING;
```

### Change the founder FROM address
Update `RESEND_FOUNDER_EMAIL` in Vercel env vars. The code fallback is in `lib/resend.ts`.

### Add a new email template
1. Add the function in `lib/resend.ts`
2. Import and call it from the relevant API route
3. Wrap in `Promise.allSettled()` so email failures don't break the request

### Run the migration on a fresh Supabase project
1. Copy `supabase/migrations/0001_init.sql`
2. Paste into Supabase SQL Editor and run
3. Add your admin email at the bottom (uncomment and edit the INSERT)
