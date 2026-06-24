<div align="center">
  <img src="public/logos/DarkGrey.png" alt="OpenInsight Logo" width="400"/>
</div>

<h1 align="center">OpenInsight</h1>

<p align="center">
  <strong>AI-Powered Clinical Decision Support for Indian Doctors</strong>
</p>

<p align="center">
  A multi-page marketing website built with Next.js, React, TypeScript, and Tailwind CSS.
</p>

<p align="center">
  <a href="./CHANGELOG.md">Changelog</a> · <a href="./ARCHITECTURE.md">Architecture</a> · <a href="./IMPROVEMENTS_AND_SUGGESTIONS.md">Improvements & Suggestions</a>
</p>

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, features, interactive demo, stats, testimonials, FAQ |
| `/product` | Product overview + 3-column comparison table |
| `/for-doctors` | Doctor personas & workflows |
| `/evidence` | Clinical evidence sources (ICMR, PubMed, WHO, Cochrane, CDC, StatPearls) |
| `/about` | Company story & timeline |
| `/early-access` | NMC-gated early access signup (enhanced form) |
| `/contact` | Contact form + contact info |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Auto-generated robots |

## Components (16)

**Layout & navigation**: `Nav` (scroll-progress + glassmorphism), `Footer` (newsletter + Launch App), `AnnouncementBanner`, `BackToTop`, `CookieConsent`

**Content**: `FeatureCard`, `Accordion`, `SectionReveal`, `StatsCounter` (animated counters), `TestimonialsCarousel`

**Interactive**: `InteractiveDemo` (tabbed Fast-Search / DeepInsight demo), `FAQAccordion` (searchable), `ComparisonTable`, `MockChatUI`

**Forms**: `EarlyAccessForm` (progress bar + persistence + consent), `ContactForm`

## Tech Stack

- **Framework:** Next.js 14 (App Router) — static export (`output: 'export'`)
- **UI Library:** React 18
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + CSS Modules + CSS Variables
- **Fonts:** DM Serif Display (headings) · DM Sans (body)
- **Design tokens:** Terracotta `#C56B4A` · Dark `#1C1B1A` · Warm white `#FAFAF8`

## Getting Started

```bash
npm install
npm run dev
```

## Build (static export)

```bash
npm run build    # outputs ./out/
```

The site is configured for static export (`output: 'export'` in `next.config.js`), so no server runtime is required. Serve the `out/` directory with any static file host.

## Branch Policy

All active development happens on the **`web-insight`** branch. Do **not** commit to `main`.

## Documentation

- **[CHANGELOG.md](./CHANGELOG.md)** — versioned history of changes
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — structure, data model, what changed in each round
- **[IMPROVEMENTS_AND_SUGGESTIONS.md](./IMPROVEMENTS_AND_SUGGESTIONS.md)** — prioritised backlog across all three OpenInsight repos
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** — full design system reference
- **[DESIGN_QUICK_REFERENCE.md](./DESIGN_QUICK_REFERENCE.md)** — quick-lookup design tokens

## Related Repositories

- **Backend**: [`Adi103-ETAI/openinsight`](https://github.com/Adi103-ETAI/openinsight) (`restruct` branch) — FastAPI with `/search`, `/deep-insights`, `/vault`, `/reports` endpoints
- **Product frontend**: [`Adi103-ETAI/openinsight-ui`](https://github.com/Adi103-ETAI/openinsight-ui) (`nextjs-ui` branch) — the actual doctor-facing app
- **Marketing site** (this repo): links to the product app via the "Launch App" CTA in the nav and footer

## Accessibility

- All interactive components have ARIA labels and keyboard support
- All animations respect `@media (prefers-reduced-motion: reduce)`
- Semantic HTML throughout (`main`, `nav`, `header`, `footer`, `section`, `article`)

## License

Proprietary — SentArc Labs.
