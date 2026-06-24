# Architecture & Change Log — OpenInsight Marketing Website

> This document explains **what the OpenInsight marketing website is**, **how it is structured**, and **exactly what changed in Round 9 (v0.9.0)**. It is intended for developers joining the project and for reviewers auditing the diff.

---

## 1. Project Identity

| Field | Value |
|---|---|
| Repo | `Adi103-ETAI/openinsight-web` |
| Working branch | `web-insight` (do **not** commit to `main`) |
| Role | **Marketing website** for OpenInsight — a pure static site that describes the product, captures early-access leads, and funnels doctors toward the real product app. |
| Stack | Next.js 14 (App Router) · React 18 · TypeScript 5 · Tailwind CSS 4 · CSS Modules · CSS Variables |
| Output | Static export (`output: 'export'`) — no server runtime required |
| Sister repos | `openinsight` (FastAPI backend, `restruct` branch) · `openinsight-ui` (Next.js product app, `nextjs-ui` branch) |

### Design system
- **Typography**: DM Serif Display (headings) · DM Sans (body) — loaded from Google Fonts.
- **Palette** (CSS variables in `app/globals.css`):
  - `--color-accent` `#C56B4A` (terracotta) · `--color-accent-2` `#A3522F` (hover)
  - `--color-dark` `#1C1B1A` · `--color-bg` `#FAFAF8` (warm white)
  - `--color-surface` `#FFFFFF` · `--color-surface-2` `#F5F0E8`
- **Spacing**: 8 px base unit (`--spacing-1` … `--spacing-16`).
- **Radius / shadow / transition** tokens all defined as variables.

---

## 2. Repository Structure (post-v0.9.0)

```
openinsight-web/
├── app/
│   ├── layout.tsx              # Root layout: Nav + Footer + global widgets + SEO/JSON-LD
│   ├── page.tsx                # Home (hero, features, demo, stats, testimonials, FAQ)
│   ├── globals.css             # Single source of truth for design tokens + utilities
│   ├── product/page.tsx        # Product overview + ComparisonTable
│   ├── for-doctors/page.tsx    # Doctor personas & workflows
│   ├── evidence/page.tsx       # Clinical evidence sources (dot-grid bg)
│   ├── about/page.tsx          # Company story + timeline
│   ├── early-access/page.tsx   # NMC-gated signup form (enhanced)
│   ├── contact/page.tsx        # NEW: contact form + info
│   ├── sitemap.ts              # NEW: sitemap.xml generator
│   └── robots.ts               # NEW: robots.txt generator
├── components/
│   ├── Nav.tsx / .module.css       # Sticky nav + scroll-progress + glassmorphism
│   ├── Footer.tsx / .module.css    # Footer + newsletter + Launch App CTA
│   ├── FeatureCard.tsx / .module.css
│   ├── Accordion.tsx / .module.css
│   ├── EarlyAccessForm.tsx / .module.css   # Enhanced: progress bar + persistence
│   ├── MockChatUI.tsx                      # (legacy, retained)
│   ├── SectionReveal.tsx                   # Scroll-reveal + stagger
│   ├── InteractiveDemo.tsx / .module.css   # NEW: tabbed demo + typewriter
│   ├── FAQAccordion.tsx / .module.css      # NEW: 10 FAQs + search
│   ├── ComparisonTable.tsx / .module.css   # NEW: 3-col capability matrix
│   ├── TestimonialsCarousel.tsx / .module.css # NEW: 5-doctor carousel
│   ├── StatsCounter.tsx / .module.css      # NEW: IntersectionObserver counters
│   ├── ContactForm.tsx / .module.css        # NEW
│   ├── CookieConsent.tsx / .module.css      # NEW
│   ├── BackToTop.tsx / .module.css          # NEW
│   └── AnnouncementBanner.tsx / .module.css # NEW
├── public/logos/                # DarkGrey.png (dark bg) · LightYellow.png (light bg)
├── next.config.js               # output: 'export', images.unoptimized
├── tailwind.config.js
├── CHANGELOG.md                 # Versioned changelog
├── ARCHITECTURE.md              # This file
├── IMPROVEMENTS_AND_SUGGESTIONS.md
└── README.md
```

**16 components** (9 new in v0.9.0) · **8 pages** (1 new) · **2 SEO route files** (new) · **~6,100 lines** total.

---

## 3. Page-by-page composition (Home)

The homepage now composes the full marketing narrative:

```
layout.tsx
├── <head> SEO meta + 2× JSON-LD (MedicalBusiness, WebSite)
├── AnnouncementBanner        ← NEW (dismissible, 7-day localStorage)
├── Nav                        ← scroll-progress bar + glassmorphism + Launch App CTA
├── <main>
│   └── page.tsx
│       ├── Hero               ← EKG SVG + trust badges + gradient text
│       ├── Problem cards
│       ├── Features grid      ← FeatureCard × 6 (card-lift hover)
│       ├── InteractiveDemo    ← NEW (Fast-Search / DeepInsight tabs)
│       ├── StatsCounter       ← NEW (4 animated counters)
│       ├── TestimonialsCarousel ← NEW (5 doctors, auto-rotate)
│       ├── FAQAccordion       ← NEW (10 Q&A + search filter)
│       └── Final CTA
├── Footer                     ← newsletter + Launch App + gradient border
├── BackToTop                  ← NEW (floating, 400px trigger)
└── CookieConsent              ← NEW (bottom banner)
```

---

## 4. What Changed in Round 9 (v0.9.0)

### 4.1 Critical bug fix
**`app/globals.css` had two full, conflicting passes.** Lines 1–528 defined the real design system; lines 530–824 redefined everything with **undefined** `--font-sans` / `--font-serif` variables and conflicting button styles. Because CSS source order wins, the rendered site was silently using the broken second pass. **Fix:** deleted the duplicate second pass, merged the 5 unique additions (focus-visible, scrollbar, `::selection`, labels, `slideInRight`) into one clean file. This alone materially improved typography and button sizing across every page.

### 4.2 New components (9)

| Component | Lines | Purpose |
|---|---|---|
| `InteractiveDemo` | 271 | Tabbed Fast-Search vs DeepInsight demo with typewriter + clickable sample queries + citation chips |
| `TestimonialsCarousel` | 248 | 5-doctor carousel, 5 s auto-rotate, prev/next + dots, pause-on-hover |
| `ContactForm` | 223 | Validated contact form, `localStorage` persistence, accessible |
| `ComparisonTable` | 208 | 3-column capability matrix, 9 rows, OpenInsight highlighted |
| `FAQAccordion` | 193 | 10 India-specific FAQs + live search filter |
| `StatsCounter` | 153 | 4 count-up stats via IntersectionObserver + rAF |
| `AnnouncementBanner` | 104 | Top banner, 7-day dismissal, drives `--announcement-h` CSS var |
| `CookieConsent` | 76 | Bottom GDPR-style banner, `localStorage` |
| `BackToTop` | 66 | Floating terracotta button, 400 px trigger |

### 4.3 New pages & routes
- `/contact` — contact form + info + map placeholder.
- `/sitemap.xml` + `/robots.txt` — generated by `app/sitemap.ts` / `app/robots.ts`.

### 4.4 Styling additions (`globals.css`)
- **Buttons**: `.btn-accent-glow` (pulse), `.btn-shimmer` (sweep), `.btn-ghost-accent`.
- **Cards**: `.card-lift` (translateY + shadow + accent top-border).
- **Reveal**: `.stagger-children` (nth-child delays).
- **Text**: `.gradient-text`, `.hero-gradient-text`, `.text-balance`.
- **Backgrounds**: `.bg-dot-grid`, `.bg-diagonal-lines`, `.bg-mesh-gradient`.
- **Typography**: fluid `clamp()` sizing for h1–h3.
- **Scrollbar / selection**: terracotta accents.

### 4.5 Enhanced existing components
- **Nav** — 3 px scroll-progress bar (rAF-throttled, ARIA progressbar), glassmorphism when scrolled (`blur(12px) saturate(1.1)`), animated sliding underline on links, Launch App ghost CTA (desktop), mobile-menu offset by `var(--announcement-h)`.
- **Footer** — gradient top border, soft radial glow, `translateX(4px)` link hover, newsletter form (validation + `localStorage` + `aria-live`), prominent Launch App button.
- **EarlyAccessForm** — live completion progress bar, `localStorage` persistence, conditional "specify specialty" field, required Terms consent checkbox, newsletter opt-in, checkmark success state.
- **FeatureCard** — decorative corner accent, `card-lift` hover.
- **SectionReveal** — stagger support + React 19 `JSX` namespace fix.

### 4.6 SEO & structured data
- `metadataBase` + canonical + OG (`locale: 'en_IN'`) + Twitter card + 16 keywords.
- **JSON-LD**: `MedicalBusiness` + `Organization` (founder, Pune address, `areaServed: India`, `sameAs`, `contactPoints`) and `WebSite` schema.
- `sitemap.xml` (8 routes, priorities 1.0 → 0.6) + `robots.txt` with sitemap reference.

### 4.7 Marketing ↔ Product alignment
- **Launch App CTAs** in `Nav` + `Footer` → `https://app.openinsight.in` (`target="_blank" rel="noopener noreferrer"`). This is the first version that actually bridges the marketing site to the product app.

### 4.8 Build configuration
- `next.config.js` → `output: 'export'` + `images.unoptimized: true`. The sandbox runtime kills `next dev` / `next start` within seconds, so static export + `python3 -m http.server 3001` is the QA path. `headers()` no longer apply (expected warning).

---

## 5. Data & State Model

The marketing site is **purely client-side** — there is no database and no server runtime. State lives in two places:

| Store | Keys | Purpose |
|---|---|---|
| `localStorage` | `openinsight_early_access_submissions` | Array of EarlyAccessForm submissions |
| `localStorage` | `openinsight_contact_submissions` | Array of ContactForm submissions |
| `localStorage` | `openinsight_newsletter_signups` | Footer newsletter emails |
| `localStorage` | `cookie_consent` | Cookie banner dismissal |
| `localStorage` | `announcement_dismissed` | Timestamp; re-show after 7 days |
| React state | — | Nav scroll position, carousel index, FAQ filter, etc. |

> **⚠️ Limitation**: because there is no backend early-access endpoint on the `openinsight` (restruct) API, submissions are **not** sent anywhere. They only persist in the visitor's browser. See `IMPROVEMENTS_AND_SUGGESTIONS.md` §3.

---

## 6. Build & QA Workflow

```bash
# Install
npm install

# Build static export → ./out/
npx next build        # 12 routes, 0 errors

# Serve for local QA (next dev/start are unstable in this sandbox)
cd out && python3 -m http.server 3001

# QA via agent-browser
agent-browser open http://localhost:3001/
agent-browser screenshot qa-home.png
```

**Verification performed in v0.9.0:**
- `npx next build` → 0 errors, 12 static routes.
- `agent-browser` screenshots captured for home, product, for-doctors, evidence, about, early-access, contact.
- VLM (glm-4.6v) analysis: homepage rated "polished and filled" (previously "sparse, excessive whitespace").
- `grep` confirmed all new content present in compiled HTML (testimonials, stats, FAQ, comparison table, InteractiveDemo, Launch CTAs, JSON-LD).

---

## 7. Alignment with Sister Repos

| Capability | Backend (`openinsight`) | Frontend (`openinsight-ui`) | **Marketing site (this repo)** |
|---|---|---|---|
| `/search` RAG | ✅ FastAPI | ✅ `/api/search` proxy | Advertised ✓ |
| `/deep-insights` multi-agent | ✅ FastAPI | ❌ not called | Advertised ✓ (InteractiveDemo mocks it) |
| `/vault` MongoDB CRUD | ✅ FastAPI | ❌ uses localStorage | Advertised ✓ |
| `/reports/generate` PDF | ✅ FastAPI | ❌ not called | Advertised ✓ |
| `/chat` streaming | ❌ no endpoint | ⚠️ mock tokens | n/a |
| Early-access signup | ❌ no endpoint | n/a | ⚠️ localStorage only |
| Link to product app | n/a | n/a | ✅ Launch App CTA (v0.9.0) |

**Bottom line**: the marketing site is the most feature-complete of the three on its own terms, but it **advertises capabilities the product frontend doesn't yet wire up**. See `IMPROVEMENTS_AND_SUGGESTIONS.md` for the remediation plan.

---

## 8. Accessibility & Performance Notes
- Every new interactive component has ARIA labels and keyboard support (carousel ←/→, accordion Enter/Space, tabs roving tabindex).
- All animations respect `@media (prefers-reduced-motion: reduce)` and the `--announcement-h` / `data-reduce-motion` hooks.
- Static export → all pages are prerendered HTML; first-load JS shared chunk is 87.4 kB.
- Images are PNG logos with `unoptimized: true` (static-export constraint). WebP/AVIF would require a build step.
