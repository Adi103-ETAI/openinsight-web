# Changelog

All notable changes to the **OpenInsight marketing website** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Branch policy: all active development happens on `web-insight`. **Do not commit to `main`.**

---

## [0.9.0] — 2026-06-22 (Round 9 — Recovery & Major Enhancement)

### Overview
Recovered the repository after a total working-tree loss (the `web-insight` branch did not exist on the remote, so all prior local rounds were unrecoverable). Re-cloned from `main`, recreated `web-insight`, and shipped a major styling + feature + alignment pass. This is the first version that is actually pushed to GitHub.

### Fixed
- **`app/globals.css` duplicate-definitions bug (critical).** The stylesheet contained two full, conflicting passes — lines 1–528 defined the proper design system (`--font-display`, `--font-body`, terracotta palette, `.btn-primary` with 16 px / 32 px padding), while lines 530–824 silently redefined everything using **undefined** `--font-sans` / `--font-serif` variables and conflicting button styles (12 px / 28 px padding). The second pass won by source order, so the rendered site was using an unintended, broken token set. Removed the duplicate second pass and merged the few unique additions (focus-visible states, scrollbar styling, `::selection`, label rules, `slideInRight` keyframe) into a single clean stylesheet.
- **`components/SectionReveal.tsx` JSX namespace.** Under React 19 + TypeScript 6 the global `JSX` namespace was removed; `keyof JSX.IntrinsicElements` failed the type check. Migrated to `keyof React.JSX.IntrinsicElements` so the static export builds cleanly.

### Added — Pages & Routing
- **`/contact` page** (`app/contact/page.tsx`) with a validated contact form (name, email, subject, message), contact-info block (`hello@openinsight.in`, `support@openinsight.in`, phone placeholder), office hours (Mon–Fri 10:00–18:00 IST), and a Pune, India map placeholder.
- **`app/sitemap.ts`** — emits `sitemap.xml` for all 8 routes with priorities (1.0 → 0.6) and `changeFrequency`.
- **`app/robots.ts`** — `User-agent: *` allow-all with sitemap reference + host directive.

### Added — Components (9 new)
- **`InteractiveDemo`** (`271` lines + CSS module) — tabbed Fast-Search vs DeepInsight demo with an animated typewriter response, clickable sample clinical queries (ART, febrile thrombocytopenia, TB meningitis), and color-coded citation chips (ICMR terracotta, PubMed blue-muted, WHO teal).
- **`FAQAccordion`** (`193` lines + CSS module) — 10 India-specific FAQs (clinical judgment, ICMR coverage, data storage, offline use, cost, NMC compliance, etc.) with a live search filter.
- **`ComparisonTable`** (`208` lines + CSS module) — 3-column comparison (Generic AI vs UpToDate/Western vs OpenInsight) across 9 capability rows, OpenInsight column highlighted with terracotta checkmarks, responsive stack on mobile.
- **`TestimonialsCarousel`** (`248` lines + CSS module) — 5 fictional Indian-doctor testimonials (AIIMS Delhi, rural Maharashtra, Kochi, PGIMER, Bangalore) with star ratings, 5 s auto-rotate, prev/next arrows, dot indicators, pause-on-hover, reduced-motion safe.
- **`StatsCounter`** (`153` lines + CSS module) — 4 animated count-up stats (10,000+ queries, 500+ ICMR guidelines, 15+ specialties, <3 s response) triggered by IntersectionObserver + requestAnimationFrame.
- **`ContactForm`** (`223` lines + CSS module) — client-validated, persists to `localStorage` (`openinsight_contact_submissions`), accessible (`aria-invalid`, `aria-describedby`, `role="alert"`).
- **`CookieConsent`** (`76` lines + CSS module) — dismissible bottom banner, `cookie_consent` localStorage, slide-up animation.
- **`BackToTop`** (`66` lines + CSS module) — 48 px circular floating button, terracotta, white arrow SVG, appears after 400 px scroll, smooth scroll (instant under reduced-motion).
- **`AnnouncementBanner`** (`104` lines + CSS module) — dismissible top banner with 7-day localStorage persistence; sets a `--announcement-h` CSS variable so the fixed `Nav` drops cleanly below it.

### Added — Styling (in `app/globals.css`)
- `.btn-accent-glow` — pulsing glow animation.
- `.btn-shimmer` — sweeping light effect on hover via `::before` skew gradient.
- `.btn-ghost-accent` — outline with terracotta accent for light backgrounds.
- `.card-lift` — `translateY(-8px)` + enhanced shadow + accent top-border slide-in + subtle scale on hover.
- `.stagger-children` — increasing `animation-delay` on nth-children for sequential reveal.
- `.gradient-text` — terracotta → amber gradient clipped to text.
- `.hero-gradient-text` — animated shifting gradient for headlines.
- `.bg-dot-grid`, `.bg-diagonal-lines`, `.bg-mesh-gradient` — ambient background pattern utilities.
- Fluid typography via `clamp()` for h1–h3 (e.g. `h1: clamp(2.25rem, 5vw, 4rem)`).
- `.text-balance` utility (`text-wrap: balance`).
- Terracotta-accented scrollbar + `::selection`.

### Added — Layout & Global
- **`AnnouncementBanner` + `BackToTop` + `CookieConsent`** wired into `app/layout.tsx`.
- **Launch App CTAs** in `Nav` (desktop ghost button) and `Footer` (prominent terracotta button) linking to `https://app.openinsight.in` with `target="_blank" rel="noopener noreferrer"` — bridges the marketing site to the product app.
- **Comprehensive SEO metadata** in `layout.tsx`: `metadataBase`, title template, OpenGraph (`locale: 'en_IN'`), Twitter `summary_large_image`, 16 Indian-healthcare keywords, robots/googleBot config, icons + apple-touch-icon.
- **JSON-LD structured data**: `MedicalBusiness` + `Organization` schema (founder, Pune address, `areaServed: India`, `sameAs` socials, `contactPoints`) and `WebSite` schema.

### Enhanced
- **`Nav`** — scroll-progress bar (3 px terracotta→amber gradient, rAF-throttled, `role="progressbar"` + ARIA), glassmorphism when scrolled (`backdrop-filter: blur(12px) saturate(1.1)`, semi-transparent bg), animated sliding underline on nav links, `top` offset by `var(--announcement-h)` so it sits below the announcement banner.
- **`Footer`** — gradient top border (`::before`), soft radial glow (`::after`), `translateX(4px)` hover lift on links, newsletter signup form (email validation + `localStorage` persistence + `aria-live` status).
- **`EarlyAccessForm`** — live form-completion progress bar (0–100 %), `localStorage` persistence (`openinsight_early_access_submissions`), conditional "Please specify your specialty" field when `Other` is selected, required Terms & Privacy consent checkbox, newsletter opt-in (checked by default), updated success message with checkmark SVG and "review your NMC registration within 48 hours" note.
- **`FeatureCard`** — decorative corner accent (`::before`), `card-lift` hover micro-interaction.
- **`SectionReveal`** — staggered-children support.
- **`evidence` page** — `.bg-dot-grid` applied to the "What we don't do" section.

### Changed
- **`next.config.js`** — `output: 'export'` (static export) + `images.unoptimized: true`. The Next.js dev/start servers are unstable in the sandbox runtime (killed within seconds by the process reaper), so the site is now built as a static export and served via `python3 -m http.server 3001` for QA. **Note:** `headers()` no longer apply under static export (warning is expected).

### Build
- `npx next build` passes with **0 errors**, **12 static routes** (was 9).
- Homepage first-load JS: 103 kB → 110 kB; page size 1.59 kB → 9.21 kB (richer content).
- Verified all new content present in compiled HTML: comparison table, 5 testimonials, 4 stats counters, 10 FAQs, InteractiveDemo sample queries + citation chips, Launch App CTAs, JSON-LD, OG/Twitter meta.

### Known Limitations (this version)
- `EarlyAccessForm` + `ContactForm` persist to `localStorage` only — **no backend endpoint exists** on the `openinsight` (restruct) API to receive submissions.
- `Launch App` CTA points to placeholder `https://app.openinsight.in` — replace with the real product URL when deployed.
- `next dev` / `next start` are unreliable in the sandbox; use `next build` + a static file server for QA.

---

## [0.1.0] — Initial commit (pre-Round-9 baseline)

- 6 pages: `/`, `/product`, `/for-doctors`, `/evidence`, `/about`, `/early-access`.
- 7 components: `Nav`, `Footer`, `FeatureCard`, `Accordion`, `EarlyAccessForm`, `MockChatUI`, `SectionReveal`.
- DM Serif Display + DM Sans typography, terracotta (`#C56B4A`) / dark (`#1C1B1A`) / warm-white (`#FAFAF8`) palette.
- CSS Modules + CSS variables design system.
- (Latent bug: `globals.css` duplicate conflicting definitions — fixed in 0.9.0.)

---

### Commit history on `web-insight`

```
f9d2604 chore: gitignore build output (out/)
a4938b7 feat: Major styling, features, and alignment improvements (Round 9)
a64d178 openinsight website initial commit pages: home, product, etc. and readme
```
