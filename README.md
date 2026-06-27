<div align="center">
  <img src="public/logos/DarkGrey.png" alt="OpenInsight Logo" width="400"/>
</div>

<h1 align="center">OpenInsight — Marketing Website</h1>

<p align="center">
  <strong>AI-Powered Clinical Decision Support for Indian Doctors</strong>
</p>

<p align="center">
  Multi-page marketing site with early-access signup, contact form, and admin dashboard.<br/>
  Built with Next.js 14, React 18, TypeScript, Tailwind CSS, Supabase, and Resend.
</p>

<p align="center">
  <a href="./CHANGELOG.md">Changelog</a> · <a href="./ARCHITECTURE.md">Architecture</a> · <a href="./IMPROVEMENTS_AND_SUGGESTIONS.md">Improvements</a>
</p>

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env vars (see Environment Variables below)
cp .env.example .env.local
# Fill in real values for Supabase, Resend, etc.

# 3. Run dev server
npm run dev
# → http://localhost:3000

# 4. Production build (Vercel handles this automatically)
npm run build
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, features, interactive demo, stats, testimonials, FAQ |
| `/product` | Product overview + 3-column comparison table |
| `/for-doctors` | Doctor personas & workflows |
| `/evidence` | Clinical evidence sources (ICMR, PubMed, WHO, Cochrane, CDC, StatPearls) |
| `/about` | Company story & timeline |
| `/early-access` | NMC-gated early access signup (enhanced form → Supabase + Resend) |
| `/contact` | Contact form + contact info (→ Supabase + Resend) |
| `/admin` | Admin dashboard (auth-gated, view/export submissions & messages) |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Auto-generated robots |

---

## How It Works — Data Flow

This is **not** a static-only site. It has a full backend powered by Vercel serverless functions:

```
User fills form
       │
       ▼
┌─────────────────────────┐
│  Next.js API Route      │
│  /api/early-access      │     /api/contact
│  /api/admin/submissions │     /api/admin/export
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
┌─────────┐   ┌──────────┐
│ Supabase│   │  Resend   │
│ (DB)    │   │ (Email)   │
└─────────┘   └──────────┘
```

### Early Access Signup Flow
1. Doctor fills out the form on `/early-access`
2. `POST /api/early-access` validates, then:
   - **Inserts row** into Supabase `early_access_submissions` table
   - **Sends admin notification** to `ADMIN_NOTIFY_EMAIL` (from `OpenInsight <hello@openinsight.in>`)
   - **Sends welcome email** to the doctor (from `Aditya <adii@openinsight.in>`)

### Contact Form Flow
1. User fills form on `/contact`
2. `POST /api/contact` validates, then:
   - **Inserts row** into Supabase `contact_messages` table
   - **Sends admin notification** to `ADMIN_NOTIFY_EMAIL`
   - **Sends auto-reply** to the user (from `Aditya <adii@openinsight.in>`)

### Admin Dashboard
- `/admin` — View all submissions & contact messages (auth-gated via `ADMIN_EMAILS`)
- `/api/admin/submissions` — API for the admin dashboard
- `/api/admin/export` — CSV export of submissions

---

## Email Architecture

All transactional emails are sent via [Resend](https://resend.com). Two FROM addresses:

| Email Type | FROM Address | Purpose |
|---|---|---|
| Admin notifications | `OpenInsight <hello@openinsight.in>` | Signup alerts, contact messages → your inbox |
| User-facing emails | `Aditya <adii@openinsight.in>` | Welcome emails, contact auto-replies → builds personal trust |

**Where do emails land?**
- `ADMIN_NOTIFY_EMAIL` env var → where admin notifications go (set to your inbox)
- Replies to `adii@openinsight.in` → needs email forwarding set up (GoDaddy DNS → your inbox)

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values. Also set them in **Vercel → Settings → Environment Variables**.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (public, RLS protects data) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only, never expose) |
| `RESEND_API_KEY` | Yes | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | No | System FROM address (default: `OpenInsight <hello@openinsight.in>`) |
| `RESEND_FOUNDER_EMAIL` | No | Founder FROM address (default: `Aditya <adii@openinsight.in>`) |
| `ADMIN_NOTIFY_EMAIL` | Yes | Where admin notifications land (your inbox) |
| `ADMIN_EMAILS` | Yes | Comma-separated emails allowed to access `/admin` |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog analytics key |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog host URL |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | No | Microsoft Clarity session recording ID |

---

## Project Structure

```
openinsight-web/
├── app/
│   ├── layout.tsx                    # Root layout: Nav + Footer + SEO + JSON-LD
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Design tokens + utility classes
│   ├── product/page.tsx              # Product overview
│   ├── for-doctors/page.tsx          # Doctor personas
│   ├── evidence/page.tsx             # Clinical evidence sources
│   ├── about/page.tsx                # Company story + timeline
│   ├── early-access/page.tsx         # Signup form page
│   ├── contact/page.tsx              # Contact form + info
│   ├── admin/page.tsx                # Admin dashboard
│   ├── api/
│   │   ├── early-access/route.ts     # POST: signup → Supabase + Resend
│   │   ├── contact/route.ts          # POST: contact → Supabase + Resend
│   │   └── admin/
│   │       ├── submissions/route.ts  # GET: list submissions (auth-gated)
│   │       └── export/route.ts       # GET: CSV export (auth-gated)
│   ├── sitemap.ts                    # Auto-generated sitemap.xml
│   └── robots.ts                     # Auto-generated robots.txt
├── components/
│   ├── Nav.tsx / .module.css         # Sticky nav + scroll-progress + glassmorphism
│   ├── Footer.tsx / .module.css      # Footer + newsletter + Launch App CTA
│   ├── EarlyAccessForm.tsx / .module.css  # Progress bar + draft persistence + validation
│   ├── ContactForm.tsx / .module.css      # Contact form with validation
│   ├── InteractiveDemo.tsx / .module.css   # Tabbed Fast-Search / DeepInsight demo
│   ├── TestimonialsCarousel.tsx / .module.css
│   ├── FAQAccordion.tsx / .module.css
│   ├── ComparisonTable.tsx / .module.css
│   ├── StatsCounter.tsx / .module.css
│   ├── FeatureCard.tsx / .module.css
│   ├── Accordion.tsx / .module.css
│   ├── SectionReveal.tsx
│   ├── MockChatUI.tsx
│   ├── CookieConsent.tsx / .module.css
│   ├── BackToTop.tsx / .module.css
│   └── AnnouncementBanner.tsx / .module.css
├── lib/
│   ├── resend.ts                     # Email helpers (4 functions: signup notify, signup welcome, contact notify, contact auto-reply)
│   ├── posthog/provider.tsx          # PostHog analytics wrapper
│   ├── clarity/script.tsx            # Microsoft Clarity script
│   └── supabase/
│       ├── server.ts                 # Server-side Supabase client (service role)
│       ├── client.ts                 # Client-side Supabase client (anon)
│       └── admin-auth.ts             # Admin auth helper
├── supabase/
│   └── migrations/0001_init.sql      # Database schema (3 tables + RLS policies)
├── public/
│   └── logos/                        # DarkGrey.png (dark bg) · LightYellow.png (light bg)
├── .env.example                      # Template for environment variables
├── next.config.js                    # Vercel deployment (no static export — API routes need server)
├── tailwind.config.js
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) — deployed on Vercel |
| UI | React 18 + TypeScript 5 |
| Styling | Tailwind CSS 4 + CSS Modules + CSS Variables |
| Database | Supabase (PostgreSQL + Row-Level Security) |
| Email | Resend (transactional email API) |
| Analytics | PostHog + Microsoft Clarity |
| Fonts | DM Serif Display (headings) · DM Sans (body) |
| Design tokens | Terracotta `#C56B4A` · Dark `#1C1B1A` · Warm white `#FAFAF8` |

---

## Database Schema (Supabase)

Three tables, all with Row-Level Security:

| Table | Purpose | Who can write | Who can read |
|---|---|---|---|
| `early_access_submissions` | Doctor signups | Anyone (anon INSERT) | Admin emails only |
| `contact_messages` | Contact form messages | Anyone (anon INSERT) | Admin emails only |
| `admin_emails` | Admin allowlist | Service role only | Everyone (for RLS checks) |

See `supabase/migrations/0001_init.sql` for the full schema.

---

## Branch Policy

Active development on **`web-insight-3`** branch. Do **not** commit to `main`.

---

## Deployment

Deployed on **Vercel**. Push to `web-insight-3` triggers automatic deployment.

**Important Vercel settings:**
- Framework Preset: Next.js
- Root Directory: `/` (default)
- Build Command: `npm run build`
- All env variables from `.env.example` must be set in Vercel dashboard

---

## Related Repositories

| Repo | Branch | Purpose |
|---|---|---|
| [`openinsight`](https://github.com/Adi103-ETAI/openinsight) | `restruct` | FastAPI backend — `/search`, `/deep-insights`, `/vault`, `/reports` |
| [`openinsight-ui`](https://github.com/Adi103-ETAI/openinsight-ui) | `nextjs-ui` | Doctor-facing product app |
| **This repo** (`openinsight-web`) | `web-insight-3` | Marketing site + early access + admin dashboard |

---

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — detailed technical architecture
- **[CHANGELOG.md](./CHANGELOG.md)** — versioned history of changes
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** — full design system reference
- **[DESIGN_QUICK_REFERENCE.md](./DESIGN_QUICK_REFERENCE.md)** — quick-lookup design tokens
- **[IMPROVEMENTS_AND_SUGGESTIONS.md](./IMPROVEMENTS_AND_SUGGESTIONS.md)** — prioritized backlog

---

## Accessibility

- All interactive components have ARIA labels and keyboard support
- All animations respect `@media (prefers-reduced-motion: reduce)`
- Semantic HTML throughout (`main`, `nav`, `header`, `footer`, `section`, `article`)

## License

Proprietary — SentArc Labs.
