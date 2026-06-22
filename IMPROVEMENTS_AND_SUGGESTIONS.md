# Improvements & Suggestions — OpenInsight Website

> Status snapshot after Round 9 (v0.9.0). Items are grouped by **priority** and tagged with the repo they belong to: `[web]` = this marketing repo, `[ui]` = `openinsight-ui` (nextjs-ui), `[api]` = `openinsight` (restruct).
>
> This is a working document — check off items as they ship and re-rank priorities each round.

---

## 0. TL;DR — the single most important finding

**The three repos are not fully on the same page.** The backend (`openinsight`) is the most mature piece and ships four real endpoints (`/search`, `/deep-insights`, `/vault`, `/reports`). The product frontend (`openinsight-ui`) only wires up `/search` — DeepInsights, Vault, and Reports are advertised but never called. The marketing site (this repo) advertises all four but its lead-capture forms have no backend to submit to. **Closing this loop is the highest-leverage work available.**

---

## 1. 🔴 High priority — alignment & data loss

### 1.1 Backend: add an early-access endpoint  `[api]`
- **Problem**: `EarlyAccessForm` and `ContactForm` on the marketing site persist to `localStorage` only. Leads are lost the moment the user clears their browser.
- **Suggestion**: add `POST /early-access` and `POST /contact` to the FastAPI app. Schema mirrors the existing form fields (`fullName`, `email`, `phone`, `specialty`, `institution`, `city`, `nmcNumber`, `referral`, `consent`, `newsletter`). Store in a new MongoDB collection `leads`. Add rate limiting (the backend already has `src/api/middleware/rate_limit.py`).
- **Marketing side**: swap the `localStorage` write for a `fetch('/api/early-access', …)` call (the marketing site can proxy through its own `/api` route, or call the backend directly with CORS configured).

### 1.2 Frontend: wire DeepInsights  `[ui]`
- **Problem**: `/deep-insights` is the headline differentiating feature — the marketing site has a whole tabbed InteractiveDemo about it — but `openinsight-ui` never calls it.
- **Suggestion**: add a "Deep" toggle in `IndexView`'s `QueryZone`. When on, POST to `/deep-insights` instead of `/search`. Render the richer response (`sections`, `sub_queries`, `contradictions`, `confidence`) in a new `DeepInsightsAnswerCard` component. The backend already returns a structured `DeepInsightsResponse` — see `src/api/routes/deep_insights.py`.

### 1.3 Frontend: migrate Vault from localStorage → backend  `[ui]`
- **Problem**: `VaultView` uses `useStore` (localStorage). Saved citations don't survive a device switch or browser clear.
- **Suggestion**: replace the localStorage store with calls to the backend `/vault/items` CRUD API (already implemented, MongoDB-backed). Keep localStorage as an offline cache, but treat the backend as source of truth. Add `X-User-ID` header plumbing (the backend already reads it via `_get_user_id`).

### 1.4 Frontend: wire Reports  `[ui]`
- **Problem**: `/reports/generate` can produce clinical-summary and evidence-review PDFs, but the UI has no "Export PDF" button.
- **Suggestion**: add an export action on `AnswerCard` that POSTs the current `QueryResponse` (answer + citations + confidence) to `/reports/generate` with `report_type: "clinical_summary"` and `format: "pdf"`, then triggers a download of the returned PDF blob.

### 1.5 Frontend: replace mock `/api/chat`  `[ui]`
- **Problem**: `src/app/api/chat/route.ts` returns fake tokens (`chunk-1`, `chunk-2` …). It's a placeholder SSE demo, not real streaming.
- **Suggestion**: either (a) implement real streaming chat on the backend (`POST /chat` that streams `/search` results token-by-token), or (b) delete the mock and use the existing `/search` POST with a loading state. The current mock misleads users into thinking chat works.

### 1.6 Marketing: replace placeholder product URL  `[web]`
- **Problem**: `Launch App` CTAs point to `https://app.openinsight.in` — a placeholder.
- **Suggestion**: replace with the real deployed `openinsight-ui` URL once it's live. Centralise it in a `lib/config.ts` constant (`PRODUCT_APP_URL`) so it's a one-line change.

---

## 2. 🟠 Medium priority — features & polish

### 2.1 Marketing: blog / resources hub  `[web]`
- Add `/blog` with 4–6 evergreen clinical-AI articles (e.g. "Why ICMR-first matters", "How DeepInsight cross-checks contradictions", "Reading CDSCO drug labels with AI"). Markdown or MDX. Greatly improves SEO + organic discovery.
- Each post gets its own `/blog/[slug]` route with reading-time estimate, share buttons, and "Was this helpful?" feedback.

### 2.2 Marketing: real interactive demo (not mock)  `[web]`
- The current `InteractiveDemo` uses canned typewriter text. If a public read-only demo endpoint is acceptable, wire it to `/search` with a curated allow-list of sample queries so visitors get a *real* answer with real citations. Gate behind a "Demo mode — limited queries" banner.
- Fallback: keep the mock but label it clearly as "illustrative" to set honest expectations.

### 2.3 All repos: Hindi language support  `[web][ui][api]`
- The target audience is Indian doctors, many of whom practise in Hindi-speaking regions. Add a `hi` locale:
  - `[web]`: `next-intl` or a simple locale switcher on the marketing nav.
  - `[ui]`: i18n the product app strings.
  - `[api]`: a Hindi system-prompt variant in `src/query/prompts.py` (the LLM providers already support multilingual output).

### 2.4 Marketing: PWA / offline  `[web]`
- Add `next-pwa` (or a hand-rolled service worker) so the marketing site + key pages work offline and are installable. Especially relevant for doctors on flaky cellular data.
- Static export is already PWA-friendly — this is mostly a manifest + SW addition.

### 2.5 Marketing: analytics  `[web]`
- No tracking is installed. Add Plausible (privacy-friendly, GDPR-clean) or Google Analytics 4. Key events: `cta_click` (Early Access, Launch App), `demo_query_run`, `faq_search`, `form_submit`. Avoid heavy trackers that hurt Core Web Vitals.

### 2.6 Marketing: image optimisation  `[web]`
- Logos are PNGs. Add WebP/AVIF versions and a `<picture>` element. Static export currently forces `images.unoptimized: true`; a pre-build script that converts PNGs → WebP would let you serve modern formats without losing the static-export benefit.

### 2.7 Frontend: command palette  `[ui]`
- Add `⌘K` command palette for quick actions (new query, open vault, export report, toggle theme). The marketing site already sets a precedent with keyboard shortcuts; mirror it in the product.

### 2.8 Backend: streaming `/search`  `[api]`
- `/search` is currently request/response. For long DeepInsights runs, stream partial results via SSE so the UI can show progress (sub-queries forming, retrieval done, synthesising…). The frontend mock `/api/chat` already demonstrates the SSE pattern — reuse it for real.

---

## 3. 🟡 Lower priority — quality & DX

### 3.1 Marketing: TypeScript strict mode  `[web]`
- `tsconfig.json` has `strict: false`. Turn it on and fix the resulting errors. Prevents a class of runtime bugs and improves refactor safety.

### 3.2 Marketing: testing  `[web]`
- No test framework is configured. Add Playwright (already a dep in `openinsight-ui`) for the 3 critical flows: homepage renders, early-access form submits, nav links work. Target a smoke-test suite that runs in <30 s.

### 3.3 Marketing: Lighthouse / Core Web Vitals audit  `[web]`
- Run Lighthouse on all 8 pages. Many animations (parallax, mesh gradients, carousel auto-rotate) may impact the "Performance" score on mid-range devices. Consider gating heavy effects behind `@media (prefers-reduced-data)` or a device-capability check.

### 3.4 Marketing: a11y audit  `[web]`
- Run axe-core or Lighthouse a11y across all pages. Known risk areas: carousel keyboard trap, color contrast on `--color-text-3` (`#8A8884`) against warm-white, focus order when the AnnouncementBanner is dismissed.

### 3.5 Marketing: dark mode  `[web]`
- The design system has `--color-dark` tokens but no theme toggle. A warm dark mode (charcoal `#1C1B1A` bg, warm-white text, terracotta accents) would suit night-shift clinicians. `next-themes` + a `[data-theme="dark"]` selector block.

### 3.6 All repos: shared types package  `[web][ui][api]`
- `QueryResponse`, `Citation`, `VaultItem` are redefined in both frontends and (as Pydantic models) the backend. Extract a shared `@openinsight/types` package (or an OpenAPI-generated TS client) so contracts stay in sync. The backend already has Pydantic models — generate TS via `openapi-typescript`.

### 3.7 Backend: early-access + contact lead schema  `[api]`
- Pair with §1.1. Add Pydantic models + a `leads` collection. Include `source` field (`marketing_web` / `marketing_contact`) so you can attribute conversion.

### 3.8 CI/CD  `[all]`
- None of the three repos has CI visible. Add GitHub Actions:
  - `[web]`: `next build` + Lighthouse CI on PR.
  - `[ui]`: `next build` + Playwright smoke.
  - `[api]`: `pytest -m "not requires_gpu"` + `ruff check` + `black --check` (the backend `AGENTS.md` already lists these commands).

---

## 4. 🟢 Nice-to-have — delighters

### 4.1 Marketing: doctor persona switcher  `[web]`
- Let visitors pick a persona ("I'm a GP in a rural PHC" / "I'm a resident at a tertiary hospital") and re-skin the homepage hero copy + featured testimonials to match. Personalisation without auth.

### 4.2 Marketing: live stats from backend  `[web]`
- `StatsCounter` currently shows hardcoded numbers (10,000+, 500+, 15+, <3 s). If the backend exposes a `/stats` endpoint (query count, guideline count, avg latency), wire the counters to real data with a daily cache.

### 4.3 Marketing: before/after clinical scenario  `[web]`
- A scroll-driven comparison: "Without OpenInsight" (doctor googling, MR brochure, 15-min literature search) vs "With OpenInsight" (3-second cited answer). High emotional impact for the target audience.

### 4.4 Frontend: research vault sharing  `[ui]`
- Let a doctor share a vault collection via a read-only link (e.g. for case discussion with a colleague). Backend `/vault` would need a `shared` flag + a public read endpoint.

### 4.5 Backend: citation graph  `[api]`
- Expose which sources cite which (PubMed → ICMR, Cochrane → PubMed). The frontend could render an interactive citation graph — a genuinely differentiating visual vs UpToDate.

---

## 5. Specific styling refinements (marketing site)

These are incremental polish items observed during QA — none are blockers:

1. **Hero EKG line** — the SVG pulse line is subtle; consider animating the `stroke-dashoffset` so it "draws" itself on load.
2. **ComparisonTable mobile** — when stacked, the "OpenInsight" highlight bar could be a left-border accent instead of a full background fill, to reduce visual weight.
3. **TestimonialsCarousel dots** — add `aria-label="Go to testimonial N"` on each dot (currently only the wrapper has a label).
4. **FAQAccordion search** — show a "No questions match '{query}'" empty state (currently just hides non-matches silently).
5. **EarlyAccessForm progress bar** — animate width changes with a 200 ms transition so it feels responsive rather than jumpy.
6. **AnnouncementBanner** — add a "Don't show again" vs "Remind me tomorrow" choice instead of a single dismiss.
7. **CookieConsent** — link "Learn more" to a real `/privacy` page (does not exist yet — add it alongside `/terms`).
8. **Nav scroll-progress** — under reduced-motion, the width still transitions (80 ms linear); set `transition: none` under `prefers-reduced-motion`.
9. **Footer newsletter** — show a small "We send ~1 email/month. Unsubscribe anytime." reassurance line under the input.
10. **StatsCounter** — the `<3s` stat doesn't count up (it's text); animate the number 0→3 with the `s` suffix appearing after, for consistency with the other three.

---

## 6. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Leads lost (localStorage only) | High | High | §1.1 — backend early-access endpoint |
| Marketing over-promises vs product reality | High | Med | §1.2–1.5 — wire frontend to backend features |
| `next dev/start` unstable in sandbox | High | Low | Already mitigated via static export + `http.server` |
| `web-insight` branch not on remote | Med | High | **Fixed in v0.9.0** — pushed this round |
| No backup of in-progress work | Med | High | The 15-min cron review job + git commits are the backup |
| Hindi audience underserved | Med | Med | §2.3 — i18n |
| Performance on low-end devices | Med | Med | §3.3 — Lighthouse audit + gate heavy effects |

---

## 7. Recommended next-round focus (for the cron job)

If the next 15-minute review round picks this up, the highest-value sequence is:

1. **Add `/privacy` and `/terms` pages** (unblocks CookieConsent "Learn more" link — quick win).
2. **Create `lib/config.ts`** with `PRODUCT_APP_URL` + `API_BASE_URL` constants (removes hardcoded URLs).
3. **Add a blog stub** (`/blog` index + one sample post) — biggest SEO lever.
4. **Fix the 10 styling refinements in §5** — each is <15 min.
5. **Add `/api/early-access` route handler** on the marketing site that proxies to the backend once §1.1 lands (so the form is backend-ready even if the backend endpoint ships later).

---

*Document last updated: 2026-06-22 (v0.9.0). Maintained alongside `CHANGELOG.md` and `ARCHITECTURE.md`.*
