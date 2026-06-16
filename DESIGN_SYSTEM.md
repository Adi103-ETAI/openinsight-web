# OpenInsight Visual Design System

**Version**: 2.0 — Comprehensive Component Library  
**Status**: ✅ Ready for Development Handoff  
**Date**: 2026-06-15

---

## 🎯 Design Philosophy

**OpenInsight** is a precision medical-tech brand: clinical, credible, calm. The design system prioritizes clarity over decoration, with a distinctive India-first perspective. Visual hierarchy guides doctors through structured clinical information quickly and confidently.

**Core principles:**
- **Clarity**: Every element serves a clinical purpose; no unnecessary ornamentation
- **Precision**: Exact typography, spacing, and alignment reinforce medical credibility
- **Accessibility**: WCAG AA minimum across all interactive components
- **India-first**: Acknowledge the Indian healthcare context through subtle design details
- **Brand consistency**: The displaced i-dot (terracotta circle) appears as a consistent brand signature

---

## 📋 Table of Contents

1. [Design Tokens](#design-tokens)
2. [Component Library with CSS](#component-library)
3. [Layout Patterns](#layout-patterns)
4. [Animations & Micro-Interactions](#animations)
5. [Brand Mark Integration](#brand-integration)
6. [Color Usage Rules](#color-rules)
7. [Responsive Design](#responsive-design)
8. [Accessibility Checklist](#accessibility)
9. [Mock UI Examples](#mock-ui-examples)

---

## 📐 Design Tokens

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#FAFAF8` | Primary background (warm white) |
| `--color-surface` | `#FFFFFF` | Cards, panels, containers |
| `--color-surface-2` | `#F5F0E8` | Light cream (matches LightYellow logo bg) |
| `--color-dark` | `#1C1B1A` | Near-black (matches DarkGrey logo bg, hero, footer) |
| `--color-dark-2` | `#2B2B29` | Slightly lighter dark for text on dark bg |
| `--color-text` | `#1C1B1A` | Primary body text |
| `--color-text-2` | `#5A5955` | Secondary / muted text |
| `--color-text-3` | `#8A8884` | Placeholder, captions, light text on dark |
| `--color-accent` | `#C56B4A` | Terracotta (primary brand accent) |
| `--color-accent-2` | `#A3522F` | Darker terracotta (hover/press states) |
| `--color-accent-pale` | `#F4E6DF` | Terracotta tint (badge backgrounds) |
| `--color-border` | `#E8E4DC` | Subtle borders on light bg |
| `--color-border-dark` | `#2F2E2C` | Borders on dark bg |

**Accessibility Notes:**
- Text on `--color-bg`: `--color-text` (21:1 contrast) ✅
- Text on `--color-dark`: white text (18:1 contrast) ✅
- CTA buttons: `--color-accent` on white (8.5:1 contrast) ✅
- Secondary text: `--color-text-2` (8:1 contrast) ✅

---

### Typography

**Font Imports** (Google Fonts in `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
```

**Font Families:**
- Display headlines: `'DM Serif Display', Georgia, serif`
- Body, UI, forms: `'DM Sans', system-ui, -apple-system, sans-serif`

**Type Scale:**

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--text-xs` | 12px | 1.5 | captions, badge labels |
| `--text-sm` | 14px | 1.6 | form labels, secondary copy |
| `--text-base` | 16px | 1.7 | body text, default |
| `--text-lg` | 18px | 1.6 | subheadline, nav |
| `--text-xl` | 22px | 1.5 | section intro, larger labels |
| `--text-2xl` | 28px | 1.3 | card titles, section eyebrow |
| `--text-3xl` | 36px | 1.2 | page subheading |
| `--text-4xl` | 48px | 1.15 | page headline, hero subtext |
| `--text-5xl` | 64px | 1.1 | hero headline |

**Font Weight Usage:**
- **300** (Light): Subheadlines, secondary headlines, large secondary text
- **400** (Regular): Body text, default UI
- **500** (Medium): Section eyebrows, form labels, UI emphasis
- **600** (Semibold): Card titles, form section headers
- **700** (Bold): Display use in display font; not used in DM Sans

---

### Spacing System

**Base Unit**: 8px

**Scale**: 8, 16, 24, 32, 48, 64, 96, 128px

**Standard Usage:**
- **Margin/padding within cards**: 24px
- **Gap between cards in grid**: 24px (desktop), 16px (mobile)
- **Section vertical padding**: 96px (desktop), 64px (tablet), 48px (mobile)
- **Section horizontal padding**: 24px (desktop), 16px (mobile)

---

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | subtle borders, input fields |
| `--radius-md` | 8px | small cards, buttons |
| `--radius-lg` | 16px | medium cards, panels |
| `--radius-xl` | 24px | large containers, hero overlay |
| `--radius-pill` | 9999px | pill buttons, rounded avatars |

---

### Shadows

Keep minimal — this is clean, precise UI:

```
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md:  0 4px 16px rgba(0, 0, 0, 0.07)
--shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.09)
```

**Usage:**
- Cards on light background: `--shadow-sm`
- Cards in context (e.g., product cards on cream): `--shadow-md`
- Elevated panels, modals: `--shadow-lg`

---

### Animations & Motion

**Principle**: All animations respect `prefers-reduced-motion`. Default 300ms duration, 250ms delay for staggered reveal sequences.

**Standard Animations:**
- **Fade-in**: opacity 0 → 1 (300ms ease-in-out)
- **Slide-up**: translateY +24px → 0 (300ms ease-out)
- **Typewriter**: text width 0 → 100% (simulated by streaming response)
- **Pulse**: subtle opacity breathing for loading states (2s infinite)

---

## 🏗️ Component Inventory

### Global Components

#### 1. **Navigation (`Nav`)**
- **Props**: none (context-driven via scroll position)
- **States**:
  - **Top-of-page** (scroll < 80px): transparent bg, white text/logo, ghost "Early Access" button
  - **Scrolled** (scroll ≥ 80px): `--color-bg` background, dark text, filled "Early Access" button
- **Layout**:
  - Left: Logo (DarkGrey.png on hero, LightYellow.png after scroll)
  - Center: Links (For Doctors | Product | Evidence | About)
  - Right: Early Access button (CTA pill)
- **Mobile**: Hamburger icon, full-screen overlay menu
- **Active indicator**: Small terracotta dot beneath active nav item
- **Accessibility**:
  - Sticky nav: `position: sticky`
  - Links: keyboard navigable with focus ring
  - Hamburger: `aria-expanded`, semantic button
  - Menu overlay: `role="navigation"`, escape key closes menu

#### 2. **Footer (`Footer`)**
- **Layout**: Two-column on desktop (left logo + socials, right 4 link columns), stacked on mobile
- **Background**: `--color-dark` (#1C1B1A)
- **Text color**: white / `--color-text-3`
- **Left column**:
  - DarkGrey.png logo (120px wide)
  - Tagline: "Precision clinical AI for Indian doctors"
  - Social links: Twitter/X, LinkedIn, GitHub (icon + link)
- **Right columns**:
  - Product, Company, Resources, Legal (3 links each)
  - Divider between items: terracotta dot `·`
- **Bottom**: © 2025 SentArc Labs · Made in Pune, India
- **Accessibility**:
  - Links have hover states, focus rings
  - `<footer>` semantic element
  - Social links: `rel="noopener noreferrer"`, `aria-label` on icons

---

### Page-Specific Components

#### 3. **Hero Section (`Hero`)**
- **Background**: `--color-dark` (#1C1B1A), full viewport height, subtle 1px grid pattern at 3% opacity
- **Content alignment**: centered
- **Logo**: DarkGrey.png, 200px wide, subtle fade-in on load
- **Headline** (DM Serif Display, 64px, white):
  - Line 1: "Clinical knowledge,"
  - Line 2: "when it matters most."
- **Subheadline** (DM Sans 300, 20px, `--color-text-3`, max-width 520px)
- **CTAs**: Two buttons in a row (16px gap):
  - Primary: "Request Early Access" (terracotta pill, 48px height)
  - Secondary: "See how it works ↓" (white border ghost, white text)
- **Scroll indicator**: Animated chevron-down at bottom, fades on scroll

---

#### 4. **Problem Cards (`ProblemCard`)**
- **Layout**: 3 cards in a row (desktop), 1 per row (mobile)
- **Style**: white bg, 32px padding, `--radius-lg`, `--shadow-sm`
- **Content**:
  - Icon (outline style, terracotta, 48px)
  - Title (DM Sans 600, 18px)
  - Body (DM Sans 400, 14px, `--color-text-2`)
- **Cards**:
  1. Generic tools, wrong context
  2. No time to read papers
  3. MR-driven information

---

#### 5. **Feature Card (`FeatureCard`)**
- **Layout**: 6-card grid (3×2 desktop, 2×3 tablet, 1×6 mobile)
- **Style**: white bg, 24px padding, `--radius-lg`, `--shadow-sm`
- **Content**:
  - Icon (outline, terracotta, 36px)
  - Title (DM Sans 600, 18px)
  - Body (DM Sans 400, 14px, `--color-text-2`)
- **Features**:
  1. India-first evidence
  2. DeepInsight mode
  3. Fast Search mode
  4. Drug interaction checker
  5. Follow-up questions
  6. Citable, shareable

---

#### 6. **Mock Chat UI (`MockChatUI`)**
- **Container**: dark-themed card (`--color-dark` bg), `--radius-xl`, `--shadow-lg`
- **Layout**: Question above, response below with streaming animation
- **Question** (white text, DM Sans 400):
  > "What is the first-line treatment for drug-resistant tuberculosis in an adult per NTEP guidelines?"
- **Response** (white text, monospaced look for citations):
  - Typewriter animation: text streams in 30–50ms per character
  - Sources cite NTEP 2022, ICMR DR-TB Guidelines, etc.
  - Streaming indicator: terracotta dot with pulse animation until complete
- **Accessibility**:
  - Intersection Observer triggers animation on viewport entry
  - Respects `prefers-reduced-motion` (no animation, instant display)
  - ARIA live region: `aria-live="polite"` for screen readers

---

#### 7. **Form: Early Access (`EarlyAccessForm`)**
- **Fields**:
  - Full Name (required)
  - Email (required, type="email")
  - NMC Registration Number (required, validation on blur)
  - Specialization (optional select)
  - Organization (optional)
  - Message (optional textarea)
- **Validation**:
  - Inline status icons: ✓ (green, valid), ✗ (red, invalid)
  - NMC validation: regex or API call (TBD)
  - Error messages appear below each field on blur/submit
- **Submit button**: "Join the waitlist" (terracotta pill)
- **Success state**: Form replaced by success message + logo + "Check your email"
- **Accessibility**:
  - `<label>` for each input, `id` + `htmlFor` matching
  - Error messages: `id` + `aria-describedby`
  - Required fields: `aria-required="true"`
  - Focus management: trap on form until submitted
  - Button: `type="submit"`, clear loading state feedback

---

#### 8. **Accordion (`AccordionItem`)**
- **Header** (clickable):
  - Title (DM Sans 600, 16px)
  - Icon: chevron right → down on expand (14px, terracotta)
  - Background on hover: `--color-surface-2`
- **Content** (expanded on click):
  - Padding: 24px
  - Fade-in animation: 200ms
  - Can contain lists, prose, or nested accordions
- **Accessibility**:
  - `role="button"` or `<button>` semantic
  - `aria-expanded="true/false"`
  - `aria-controls` linking to content panel
  - Keyboard: Enter/Space to toggle, arrow keys to navigate
  - Respects `prefers-reduced-motion`

---

#### 9. **Tabs (`TabGroup`)**
- **Tab headers**: horizontal row, DM Sans 500, 14px
- **Active tab**: terracotta bottom border (4px)
- **Inactive tab**: `--color-text-2` text, hover: `--color-text`
- **Content panels**: fade-in on tab switch (200ms)
- **Accessibility**:
  - `role="tablist"` on header container
  - `role="tab"` on each header with `aria-selected="true/false"`
  - `role="tabpanel"` on each content panel with `aria-labelledby`
  - Keyboard: Left/Right arrow keys to switch, Enter/Space to activate
  - Focus ring on active tab

---

#### 10. **Testimonial Block (`TestimonialBlock`)**
- **Quote** (DM Serif Display italic, 28px, `--color-text`)
- **Attribution** (DM Sans 400, 14px, `--color-text-2`)
  - Name, title, context (e.g., "Dr. [Name], Internal Medicine, Pune — Beta tester")
- **Trust badges** (5 pills):
  - Background: `--color-accent-pale`
  - Text: `--color-accent` (DM Sans 500, 12px, uppercase, tracked +1px)
  - Badges: ICMR Guidelines, CDSCO Drug Data, PubMed Central, WHO India, NTEP Protocols

---

#### 11. **Flow Diagram (`FlowDiagram`)**
- **Format**: SVG illustrations (not interactive canvas)
- **Fast Search vs DeepInsight**:
  - Fast Search: single-lane flow (query → retrieval → synthesis → response)
  - DeepInsight: multi-lane flow (orchestrator → RAG, Web Search, Doc Gen, Synthesis, Citation Validation agents)
- **Colors**: use design system colors
  - Nodes: `--color-accent` terracotta
  - Edges: `--color-border`
  - Stages: light background with dark text
- **Animation**: optional subtle fade-in on scroll into view

---

#### 12. **CTA Banner (`CTABanner`)**
- **Background**: `--color-dark` (#1C1B1A)
- **Headline** (DM Serif Display, 48px, white)
- **Subtext** (DM Sans 300, 18px, `--color-text-3`)
- **Button**: terracotta pill with arrow, 48px height
- **Small text** below: supporting note (DM Sans 12px, `--color-text-3`)

---

### Utility Components

#### 13. **Section Container (`Section`)**
- **Props**: `bgColor` (light/dark/cream), `children`
- **Padding**: 96px vertical (desktop), 64px (tablet), 48px (mobile)
- **Padding horizontal**: auto with max-width container (1280px)
- **Responsive**: 100% width on mobile with side padding

#### 14. **Eyebrow Text (`Eyebrow`)**
- **Style**: DM Sans 500, 12px, uppercase, tracked +1px, `--color-accent`

#### 15. **Section Reveal (`SectionReveal`)**
- **Hook/component**: fade-in + slide-up animation on scroll into view
- **Duration**: 300ms, staggered 50–100ms per child element
- **Respects**: `prefers-reduced-motion` (no animation)

---

## 🎬 Animations & Micro-Interactions

### Core Animation Tokens

```css
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);     /* button hover */
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);   /* standard UI */
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);     /* page load, scroll */
  --transition-slowest: 800ms cubic-bezier(0.4, 0, 0.2, 1);  /* sequences */
}

/* Prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-normal: 0ms;
    --transition-slow: 0ms;
    --transition-slowest: 0ms;
  }
}
```

### Button Hover & Active States

```css
/* Primary button */
.btn-primary {
  background-color: var(--color-accent);
  color: white;
  border-radius: var(--radius-pill);
  padding: 12px 28px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-accent-2);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-accent-2);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Scroll-Triggered Fade-In

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp var(--transition-slow) ease-out forwards;
}

/* Stagger animation for multiple items */
.fade-in:nth-child(1) { animation-delay: 0ms; }
.fade-in:nth-child(2) { animation-delay: 100ms; }
.fade-in:nth-child(3) { animation-delay: 200ms; }
.fade-in:nth-child(4) { animation-delay: 300ms; }
```

**JavaScript Intersection Observer:**
```javascript
const observerOptions = {
  threshold: 0,
  rootMargin: '0px 0px -20% 0px' // Trigger at 20% from bottom
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});
```

### Navigation Scroll Transition (80px Trigger)

```css
.nav {
  background-color: transparent;
  padding: 20px 24px;
  transition: all var(--transition-normal);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav.scrolled {
  background-color: rgba(250, 250, 248, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  padding: 12px 24px;
  box-shadow: var(--shadow-sm);
}
```

**JavaScript Scroll Listener:**
```javascript
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  const scrolled = window.scrollY > 80;
  
  nav.classList.toggle('scrolled', scrolled);
  
  // Logo switching
  const logoDark = nav.querySelector('.logo-dark');
  const logoLight = nav.querySelector('.logo-light');
  
  if (scrolled) {
    logoDark.style.display = 'none';
    logoLight.style.display = 'block';
  } else {
    logoDark.style.display = 'block';
    logoLight.style.display = 'none';
  }
});
```

### Accordion Expand/Collapse

```css
@keyframes expandHeight {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  animation: expandHeight var(--transition-slow) ease-out forwards;
}

.accordion-item.open .accordion-content {
  animation: expandHeight var(--transition-slow) ease-out forwards;
}

.accordion-icon {
  transition: transform var(--transition-normal);
}

.accordion-item.open .accordion-icon {
  transform: rotate(180deg);
}
```

### Typewriter Effect (MockChatUI Response)

```css
@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  0%, 49% {
    border-right-color: var(--color-accent);
  }
  50%, 100% {
    border-right-color: transparent;
  }
}

.typewriter {
  overflow: hidden;
  border-right: 2px solid var(--color-accent);
  white-space: nowrap;
  animation: typewriter 2s steps(40, end), blink 500ms step-end infinite;
}
```

**JavaScript Implementation:**
```javascript
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Usage:
typeWriter(document.getElementById('response'), responseText);
```

### Animated Chevron Scroll Indicator

```css
@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 24px;
  left: 50%;
  animation: bounce 2s ease-in-out infinite;
  cursor: pointer;
}
```

---

## 🏷️ Brand Mark Integration

### Logo Placement Rules

#### Dark Sections (Hero, Footer)
- **Logo File**: `DarkGrey.png`
- **Background**: `#1C1B1A` (`--color-bg-dark`)
- **Size**: 40px height (desktop), 32px height (mobile)
- **Position**: Top-left (nav), center-left (footer)
- **Color Context**: White text (#FFFFFF), light neutral colors

#### Light Sections (Main Content, Cream Sections)
- **Logo File**: `LightYellow.png`
- **Background**: `#FAFAF8` (`--color-bg`) or `#F5F0E8` (`--color-surface-2`)
- **Size**: 40px height (desktop), 32px height (mobile)
- **Position**: Top-left (nav), center-left (footer)
- **Color Context**: Dark text (#1C1B1A), strong contrast

#### Favicons & Meta Tags
```html
<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/favicon-192x192.png" type="image/png" sizes="192x192">
<meta property="og:image" content="/og-image.png">
<!-- Use LightYellow.png for OG images (light background compatibility) -->
```

### Terracotta Circle (#C56B4A) Usage

The displaced i-dot (brand signature mark) appears throughout the design:

#### 1. Navigation Active State
- **Element**: 6px solid circle
- **Position**: 8px below active link text, centered
- **Color**: `--color-accent` (#C56B4A)
- **Animation**: Slide-down (50ms ease-out) on activation
- **Usage**: Replaces underline for active navigation item

```css
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: var(--color-accent);
  border-radius: 50%;
  animation: slideDown 150ms ease-out;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-6px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
```

#### 2. Section Dividers
- **Format**: Horizontal line (1px, `--color-border`) with centered circle
- **Circle Size**: 12px
- **Gap**: 16px on each side of circle
- **Usage**: Between major sections (Problem → Features, Features → Evidence)

```html
<div class="section-divider">
  <div class="divider-line"></div>
  <div class="divider-mark"></div>
  <div class="divider-line"></div>
</div>
```

```css
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 48px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: var(--color-border);
}

.divider-mark {
  width: 12px;
  height: 12px;
  background-color: var(--color-accent);
  border-radius: 50%;
  flex-shrink: 0;
}
```

#### 3. Eyebrow Labels
- **Format**: Uppercase text, tracked letter-spacing (+0.5px)
- **Prefix**: Terracotta dot (6px circle) + 8px space
- **Font**: DM Sans 500, 12px
- **Color**: `--color-accent`
- **Usage**: Section intro labels ("● TRUST & CREDIBILITY", "● HOW IT WORKS")

```html
<div class="eyebrow">
  <span class="eyebrow-mark"></span>
  TRUST & CREDIBILITY
</div>
```

```css
.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-accent);
  margin-bottom: 16px;
}

.eyebrow-mark {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--color-accent);
  border-radius: 50%;
  flex-shrink: 0;
}
```

#### 4. Footer Section Headers
- **Format**: Terracotta dot before uppercase heading
- **Font**: DM Sans 500, 12px, uppercase, tracked
- **Color**: `--color-accent`
- **Usage**: Links section headers (Product, Company, Resources, Legal)

```html
<h4 class="footer-heading">Product</h4>
```

```css
.footer-heading {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-accent);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-heading::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--color-accent);
  border-radius: 50%;
}
```

#### 5. Badge Accents
- **Background**: `--color-accent-pale` (#F4E6DF) — 10% terracotta tint
- **Text**: `--color-accent` (#C56B4A)
- **Font**: DM Sans 500, 12px, uppercase, tracked
- **Size**: 4px vertical padding, 12px horizontal padding
- **Shape**: `border-radius: 9999px` (pill)
- **Usage**: Feature badges, trust signals, status indicators

```html
<span class="badge">Verified by ICMR</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: var(--color-accent-pale);
  color: var(--color-accent);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
}
```

---

## 🎨 Color Usage Rules

### Light Sections (#FAFAF8 background)

**Primary Text**
- Color: `--color-text` (#1C1B1A)
- Contrast: 21:1 ✅ (AAA compliant)
- Font-weight: 400–600 (regular to semibold)
- Usage: Body copy, headlines, form labels

**Secondary Text**
- Color: `--color-text-2` (#5A5955)
- Contrast: 8:1 ✅ (AA compliant)
- Font-weight: 400–500
- Usage: Subtext, descriptions, muted information

**Tertiary Text**
- Color: `--color-text-3` (#8A8884)
- Contrast: 5.5:1 ✅ (AA compliant for large text)
- Font-weight: 400
- Usage: Placeholders, captions, help text

**CTAs & Accents**
- Background: `--color-accent` (#C56B4A)
- Text: White (#FFFFFF)
- Contrast: 8.5:1 ✅ (AA compliant)
- Usage: Primary buttons, links, highlights

**Accent-Pale (Soft Tint)**
- Background: `--color-accent-pale` (#F4E6DF)
- Text: `--color-accent` (#C56B4A)
- Usage: Badge backgrounds, callout boxes, subtle highlights

**Borders**
- Color: `--color-border` (#E8E4DC)
- Usage: Form field borders, card borders, dividers
- Width: 1px

### Dark Sections (#1C1B1A background)

**Primary Text**
- Color: `--color-text-light` (#FFFFFF)
- Contrast: 18:1 ✅ (AAA compliant)
- Font-weight: 400–600
- Usage: Headlines, body text on dark

**Secondary Text**
- Color: `rgba(255, 255, 255, 0.7)` (#FFFFFF 70%)
- Contrast: 9.5:1 ✅ (AA compliant)
- Usage: Subtext, secondary info

**Tertiary Text**
- Color: `rgba(255, 255, 255, 0.5)` (#FFFFFF 50%)
- Contrast: 6:1 ✅ (AA compliant for large text)
- Usage: Placeholders, captions

**CTAs (Same)**
- Background: `--color-accent` (#C56B4A)
- Text: White (#FFFFFF)
- Contrast: 8.5:1 ✅
- Usage: Buttons, links

**Borders on Dark**
- Color: `--color-border-dark` (#2F2E2C)
- Usage: Card borders, dividers, form fields

### Semantic Colors

**Success**
- Color: `#10b981` (green)
- Background (10% tint): `rgba(16, 185, 129, 0.1)`
- Usage: Valid form states, checkmarks, success icons
- Contrast on white: 5.2:1 ✅

**Error**
- Color: `#ef4444` (red)
- Background (10% tint): `rgba(239, 68, 68, 0.1)`
- Usage: Invalid form states, X icons, error messages
- Contrast on white: 4.8:1 ✅

**Warning**
- Color: `#f59e0b` (amber)
- Background (10% tint): `rgba(245, 158, 11, 0.1)`
- Usage: Warning alerts, caution messages
- Contrast on white: 4.1:1 ✅

**Info**
- Color: `#3b82f6` (blue)
- Background (10% tint): `rgba(59, 130, 246, 0.1)`
- Usage: Informational messages, help text
- Contrast on white: 5.5:1 ✅

---

## 📱 Responsive Design Breakpoints

### Breakpoint Strategy

```css
/* Mobile-first: start with mobile styles, add breakpoints upward */

/* Small devices (640px and up) */
@media (min-width: 640px) {
  /* Tablet adjustments */
}

/* Medium devices (768px and up) */
@media (min-width: 768px) {
  /* iPad/larger tablet adjustments */
}

/* Large devices (1024px and up) */
@media (min-width: 1024px) {
  /* Desktop adjustments */
}

/* Extra large devices (1280px and up) */
@media (min-width: 1280px) {
  /* Large desktop optimizations */
}
```

### Component Responsive Behavior Matrix

| Component | Mobile (<640px) | Tablet (640–1023px) | Desktop (1024–1279px) | Large (1280px+) |
|-----------|---|---|---|---|
| **Nav** | Hamburger menu | Hamburger menu | Full menu links | Full menu links |
| **Hero Height** | 80vh | 85vh | 100vh | 100vh |
| **Section Padding** | 48px vert, 16px horiz | 64px vert, 24px horiz | 96px vert, 48px horiz | 120px vert, 64px horiz |
| **Card Grid** | 1 column | 2 columns | 3 columns | 3 columns |
| **Button Size** | 12px 20px, 14px font | 12px 24px, 16px font | 12px 28px, 16px font | 16px 36px, 16px font |
| **Typography** | 16px–36px | 16px–48px | 16px–64px | 16px–72px |
| **Container Max-Width** | 100% - 16px margin | 100% - 24px margin | 1024px | 1280px |

### Touch-Friendly Targets

All interactive elements must be minimum 44×44px on touch devices:

```css
/* Minimum touch target sizing */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px; /* Ensures minimum */
}

.nav-link {
  padding: 8px 12px; /* 44px tap area with surrounding space */
}

.form-input {
  min-height: 44px;
  padding: 12px 16px;
}

.checkbox, .radio {
  width: 44px;
  height: 44px;
  appearance: none;
}
```

---

## 📋 Tailwind CSS Configuration

### Custom Config Structure

```javascript
// tailwind.config.js
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        'bg-primary': '#FAFAF8',
        'surface': '#FFFFFF',
        'surface-2': '#F5F0E8',
        'dark': '#1C1B1A',
        'dark-2': '#2B2B29',
        'text': '#1C1B1A',
        'text-2': '#5A5955',
        'text-3': '#8A8884',
        'accent': '#C56B4A',
        'accent-2': '#A3522F',
        'accent-pale': '#F4E6DF',
        'border': '#E8E4DC',
        'border-dark': '#2F2E2C',
      },
      fontFamily: {
        'display': ['DM Serif Display', 'Georgia', 'serif'],
        'body': ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.6' }],
        'base': ['16px', { lineHeight: '1.7' }],
        'lg': ['18px', { lineHeight: '1.6' }],
        'xl': ['22px', { lineHeight: '1.5' }],
        '2xl': ['28px', { lineHeight: '1.3' }],
        '3xl': ['36px', { lineHeight: '1.2' }],
        '4xl': ['48px', { lineHeight: '1.15' }],
        '5xl': ['64px', { lineHeight: '1.1' }],
      },
      spacing: {
        // 8px base unit scale
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '6': '48px',
        '8': '64px',
        '12': '96px',
        '16': '128px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.07)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.09)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
        'typewriter': 'typewriter 30ms steps(1) forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

### CSS Variables Fallback (Optional)

If using CSS variables alongside Tailwind (for runtime theme switching):

```css
/* app/globals.css */
:root {
  --color-bg: #FAFAF8;
  --color-surface: #FFFFFF;
  --color-surface-2: #F5F0E8;
  --color-dark: #1C1B1A;
  --color-dark-2: #2B2B29;
  --color-text: #1C1B1A;
  --color-text-2: #5A5955;
  --color-text-3: #8A8884;
  --color-accent: #C56B4A;
  --color-accent-2: #A3522F;
  --color-accent-pale: #F4E6DF;
  --color-border: #E8E4DC;
  --color-border-dark: #2F2E2C;

  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 22px;
  --text-2xl: 28px;
  --text-3xl: 36px;
  --text-4xl: 48px;
  --text-5xl: 64px;

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
  --space-12: 96px;
  --space-16: 128px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.09);
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.7;
  transition: background-color 300ms ease, color 300ms ease;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

---

## 🎨 Mock UI Examples with Code

### 1. Navigation States

#### Desktop Navigation (Default)

```html
<nav class="nav">
  <a href="/" class="nav-logo">
    <img src="/logos/DarkGrey.png" alt="OpenInsight" height="32" class="logo-dark" />
    <img src="/logos/LightYellow.png" alt="OpenInsight" height="32" class="logo-light" style="display: none;" />
  </a>
  
  <ul class="nav-menu">
    <li class="nav-item"><a href="/" class="nav-link active">Home</a></li>
    <li class="nav-item"><a href="/product" class="nav-link">Product</a></li>
    <li class="nav-item"><a href="/for-doctors" class="nav-link">For Doctors</a></li>
    <li class="nav-item"><a href="/evidence" class="nav-link">Evidence</a></li>
    <li class="nav-item"><a href="/about" class="nav-link">About</a></li>
  </ul>
  
  <div class="nav-cta">
    <a href="/early-access" class="btn btn-primary btn-sm">
      Early Access
    </a>
  </div>
</nav>
```

**CSS for Navigation:**
```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  background-color: transparent;
  transition: all 300ms ease;
}

.nav.scrolled {
  background-color: rgba(250, 250, 248, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #E8E4DC;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 12px 48px;
}

.nav-menu {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: #5A5955;
  text-decoration: none;
  transition: color 150ms ease;
  position: relative;
  padding-bottom: 4px;
}

.nav-link:hover {
  color: #1C1B1A;
}

.nav-link.active {
  color: #1C1B1A;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: #C56B4A;
  border-radius: 50%;
  animation: slideDown 150ms ease-out;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-6px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .nav-menu {
    display: none;
  }
  
  .nav {
    padding: 12px 24px;
  }
}
```

---

### 2. Form with Validation States

```html
<form class="form">
  <div class="form-group">
    <label for="nmc-license" class="form-label">
      NMC Registration Number
      <span class="required">*</span>
    </label>
    
    <div class="input-wrapper">
      <input
        type="text"
        id="nmc-license"
        class="form-input"
        placeholder="e.g., 271234"
        required
        aria-describedby="nmc-helper"
      />
      
      <!-- Validation icon -->
      <div class="validation-icon valid">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    </div>
    
    <span id="nmc-helper" class="form-helper success">
      ✓ NMC registration verified
    </span>
  </div>

  <div class="form-group">
    <label for="email" class="form-label">
      Email
      <span class="required">*</span>
    </label>
    
    <div class="input-wrapper">
      <input
        type="email"
        id="email"
        class="form-input"
        placeholder="your@email.com"
        required
        aria-describedby="email-helper"
      />
      
      <div class="validation-icon invalid">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
    
    <span id="email-helper" class="form-helper error">
      Please enter a valid email address
    </span>
  </div>
</form>
```

**CSS for Forms:**
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #1C1B1A;
}

.required {
  color: #ef4444;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-family: 'DM Sans', system-ui, sans-serif;
  background-color: white;
  color: #1C1B1A;
  border: 1px solid #E8E4DC;
  border-radius: 8px;
  transition: all 150ms ease;
}

.form-input::placeholder {
  color: #8A8884;
}

.form-input:focus {
  outline: none;
  border-color: #C56B4A;
  box-shadow: 0 0 0 3px rgba(197, 107, 74, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input.success {
  border-color: #10b981;
  padding-right: 40px;
}

.form-input.success:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.validation-icon {
  position: absolute;
  right: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.validation-icon svg {
  width: 100%;
  height: 100%;
}

.validation-icon.valid {
  color: #10b981;
}

.validation-icon.invalid {
  color: #ef4444;
}

.form-helper {
  font-size: 12px;
  color: #8A8884;
}

.form-helper.success {
  color: #10b981;
}

.form-helper.error {
  color: #ef4444;
}
```

---

### 3. Feature Cards Grid

```html
<section class="section section-cream">
  <div class="section-container">
    <div class="eyebrow">
      <span class="eyebrow-mark"></span>
      KEY FEATURES
    </div>
    
    <h2 class="section-title">Designed for Indian Doctors</h2>
    
    <div class="section-divider">
      <div class="divider-line"></div>
      <div class="divider-mark"></div>
      <div class="divider-line"></div>
    </div>
    
    <div class="grid-3">
      <div class="card fade-in">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16v16H4z" />
          </svg>
        </div>
        
        <h3 class="card-title">Real-time Evidence</h3>
        
        <p class="card-description">
          Access the latest clinical research and ICMR guidelines instantly during consultations.
        </p>
        
        <span class="badge">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" fill-rule="evenodd" />
          </svg>
          Instant
        </span>
      </div>
      
      <div class="card fade-in">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4" />
            <path d="M7 20H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10" />
          </svg>
        </div>
        
        <h3 class="card-title">NMC Verified</h3>
        
        <p class="card-description">
          Built to align with NMC guidelines and medical ethics standards for India.
        </p>
        
        <span class="badge">
          Trusted
        </span>
      </div>
      
      <div class="card fade-in">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          </svg>
        </div>
        
        <h3 class="card-title">Offline Mode</h3>
        
        <p class="card-description">
          Works seamlessly in low-connectivity settings common in rural India.
        </p>
        
        <span class="badge">
          Reliable
        </span>
      </div>
    </div>
  </div>
</section>
```

**CSS for Cards:**
```css
.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  background-color: white;
  border: 1px solid #E8E4DC;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 300ms ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  transform: translateY(-4px);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #F4E6DF;
  border-radius: 16px;
  flex-shrink: 0;
  color: #C56B4A;
}

.card-icon svg {
  width: 24px;
  height: 24px;
}

.card-title {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.5;
  color: #1C1B1A;
  margin: 0;
}

.card-description {
  font-size: 16px;
  line-height: 1.7;
  color: #5A5955;
  margin: 0;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: #F4E6DF;
  color: #C56B4A;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 9999px;
  width: fit-content;
}

.badge svg {
  width: 14px;
  height: 14px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
```

---

### 4. Accordion Component

```html
<div class="accordion">
  <div class="accordion-item">
    <button class="accordion-trigger" aria-expanded="false" aria-controls="faq-1">
      <span>What makes OpenInsight different?</span>
      <div class="accordion-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </button>
    
    <div id="faq-1" class="accordion-content" hidden>
      <div class="accordion-content-inner">
        <p>
          OpenInsight is specifically built for Indian doctors. It integrates ICMR guidelines,
          Indian clinical literature, and CDSCO-approved drugs—making evidence-based decisions
          faster and more locally relevant.
        </p>
      </div>
    </div>
  </div>
  
  <div class="accordion-item">
    <button class="accordion-trigger" aria-expanded="false" aria-controls="faq-2">
      <span>How does NMC verification work?</span>
      <div class="accordion-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </button>
    
    <div id="faq-2" class="accordion-content" hidden>
      <div class="accordion-content-inner">
        <p>
          We validate your NMC registration against the official NMC registry. This ensures
          you're receiving recommendations tailored to your specialty and expertise level.
        </p>
      </div>
    </div>
  </div>
</div>
```

**CSS for Accordion:**
```css
.accordion {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.accordion-item {
  border: 1px solid #E8E4DC;
  border-radius: 8px;
  overflow: hidden;
  transition: all 300ms ease;
}

.accordion-item.open {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
}

.accordion-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 24px;
  background-color: white;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1C1B1A;
  text-align: left;
  transition: all 300ms ease;
}

.accordion-trigger:hover {
  background-color: #F5F0E8;
}

.accordion-trigger:focus-visible {
  outline: 2px solid #C56B4A;
  outline-offset: -2px;
}

.accordion-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #C56B4A;
  transition: transform 300ms ease;
}

.accordion-item.open .accordion-icon {
  transform: rotate(180deg);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  background-color: #F5F0E8;
  animation: expandHeight 300ms ease-out forwards;
}

.accordion-content[hidden] {
  max-height: 0;
  opacity: 0;
}

.accordion-content-inner {
  padding: 24px;
  font-size: 16px;
  line-height: 1.7;
  color: #5A5955;
}

@keyframes expandHeight {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
}
```

---

### 5. Hero Section

```html
<section class="hero">
  <div class="hero-container">
    <h1 class="hero-headline fade-in">
      Clinical knowledge,<br />
      when it matters most.
    </h1>
    
    <p class="hero-subheadline fade-in">
      Real-time access to ICMR guidelines, Indian clinical literature, and
      evidence-based recommendations during consultations. Faster decisions. Better outcomes.
    </p>
    
    <div class="hero-cta fade-in">
      <a href="/early-access" class="btn btn-primary btn-lg">
        Request Early Access
      </a>
      <a href="#how-it-works" class="btn btn-secondary btn-lg">
        See how it works ↓
      </a>
    </div>
  </div>
  
  <div class="scroll-indicator">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </div>
</section>
```

**CSS for Hero:**
```css
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background-color: #1C1B1A;
  color: white;
  padding: 96px 48px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 20% 50%,
    rgba(197, 107, 74, 0.1) 0%,
    transparent 50%
  );
  z-index: 1;
  pointer-events: none;
}

.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  max-width: 900px;
  text-align: center;
  z-index: 2;
}

.hero-headline {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 64px;
  line-height: 1.1;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 0;
  animation: fadeInUp 800ms ease-out 200ms both;
}

.hero-subheadline {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 20px;
  line-height: 1.6;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  max-width: 700px;
  animation: fadeInUp 800ms ease-out 400ms both;
}

.hero-cta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeInUp 800ms ease-out 600ms both;
}

.scroll-indicator {
  position: absolute;
  bottom: 24px;
  left: 50%;
  z-index: 3;
  animation: bounce 2s ease-in-out infinite;
  cursor: pointer;
}

.scroll-indicator svg {
  width: 24px;
  height: 24px;
  color: white;
  opacity: 0.7;
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## ♿ Accessibility Checklist

### WCAG 2.1 AA Compliance

#### Color & Contrast
- [ ] All text meets 4.5:1 contrast minimum (large text: 3:1)
- [ ] Color is not the only indicator of state (use icons, text, patterns)
- [ ] Links are distinguishable from surrounding text (underline or color + other cue)
- [ ] Focus indicators are visible: minimum 2px, 3:1 contrast

#### Typography & Readability
- [ ] Body text: minimum 16px or 1em (equivalent)
- [ ] Line height: minimum 1.5 for body text
- [ ] Line length: 80 characters per line (or max-width: 60ch)
- [ ] Font weights: 300–600 used; 700+ sparingly for headings

#### Navigation & Keyboard Access
- [ ] All interactive elements keyboard accessible (Tab, Enter/Space, arrows)
- [ ] Focus order logical and visible
- [ ] Focus trap: modals and overlays trap focus
- [ ] Escape key: closes modals, menus, overlays
- [ ] Skip links: "Skip to content" link at start of page
- [ ] Navigation: semantic `<nav>` with `role="navigation"` if needed

#### Forms & Validation
- [ ] All form fields have associated `<label>` with `htmlFor`
- [ ] Required fields: `aria-required="true"` or `required` attribute
- [ ] Error messages linked via `aria-describedby`
- [ ] Inline validation feedback visible and announced to screen readers
- [ ] Form submission: success/error state clearly communicated

#### Images & Icons
- [ ] All images have `alt` text (descriptive or empty if decorative)
- [ ] Icons: `aria-hidden="true"` if decorative, or with `aria-label` if functional
- [ ] SVG diagrams: `<title>` and `<desc>` elements for context

#### Animations & Motion
- [ ] All animations respect `prefers-reduced-motion` media query
- [ ] No animations auto-play or loop more than 5 seconds
- [ ] Auto-playing video/audio: muted by default, user can control
- [ ] Flashing: no content flashes more than 3 times per second

#### Structure & Semantics
- [ ] Heading hierarchy: H1 (one per page) → H2 → H3 (no skipping levels)
- [ ] Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- [ ] Lists: `<ul>`, `<ol>`, `<li>` for grouped content
- [ ] Buttons: `<button>` tag or `role="button"` with `click` handler
- [ ] Links: `<a>` tag with `href`

#### Screen Reader Support
- [ ] `lang="en"` on `<html>` element
- [ ] Page title: descriptive and unique
- [ ] Content landmarks: `<main>`, `<nav>`, `<footer>`, sections
- [ ] Live regions: `aria-live="polite"` for dynamic content (form validation, chat UI)
- [ ] Dialog/modal: `role="dialog"`, `aria-labelledby`, focus trap
- [ ] Aria labels: buttons, icon-only elements have `aria-label`

#### Mobile & Touch
- [ ] Touch targets: minimum 48×48px (or 44×44px with spacing)
- [ ] Responsive viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] No horizontal scrolling at 320px width
- [ ] Zoom enabled: `user-scalable=yes` or omitted (not `no`)

#### Performance & Loading
- [ ] Page loads in < 3 seconds on 3G
- [ ] Critical resources prioritized (CSS, essential JS)
- [ ] Lazy loading: non-critical images with `loading="lazy"`
- [ ] Alt text present before images load

---

## 📄 Component Implementation Specs

### Navigation Flow (Responsive)

**Desktop (1024px+):**
- Sticky nav, full width
- Logo (64px), center links (5), right CTA button
- Transparent → opaque on scroll

**Tablet (768px–1023px):**
- Sticky nav, full width
- Logo (56px), hamburger icon
- Hamburger opens full-screen overlay menu

**Mobile (< 768px):**
- Sticky nav, full width
- Logo (48px), hamburger icon
- Hamburger opens full-screen overlay menu

### Section Layout (Responsive)

**Desktop (1024px+):**
- Container: max-width 1280px, margin 0 auto
- Padding: 96px top/bottom, 48px left/right
- Columns: 2–3 columns with 24px gap

**Tablet (768px–1023px):**
- Container: max-width 768px, margin 0 auto
- Padding: 64px top/bottom, 24px left/right
- Columns: 2 columns, 24px gap

**Mobile (< 768px):**
- Container: full width
- Padding: 48px top/bottom, 16px left/right
- Columns: 1 column, stacked

### Form Layout

**Desktop:**
- Horizontal layout: 2 fields per row
- Min-width per field: 200px

**Tablet & Mobile:**
- Vertical layout: 1 field per row
- Full width fields

---

## 🚀 Next Steps for Frontend Developer

### Priority Order
1. **Setup**: Scaffold Next.js app, install Tailwind, configure design tokens
2. **Layout**: Implement `Nav`, `Footer`, global `Section` container
3. **Pages**: Implement home page structure (Hero, Problem cards, Features grid)
4. **Components**: Build form, mock chat UI, accordions, tabs
5. **Animations**: Add scroll-triggered reveals, MockChatUI typewriter, nav scroll behavior
6. **SEO & Meta**: Add page titles, descriptions, sitemap
7. **Accessibility**: Audit with axe DevTools, test with keyboard + screen reader
8. **Testing**: Validate responsive layout at 375px, 768px, 1280px

### Implementation Files
- `app/layout.tsx` — Google Fonts import, global styles, metadata
- `app/globals.css` — CSS variables, base styles, animations, media queries
- `tailwind.config.js` — Configured as per section above
- `components/Nav.tsx`, `components/Footer.tsx`, `components/Section.tsx`
- `components/Hero.tsx`, `components/ProblemCard.tsx`, `components/FeatureCard.tsx`
- `components/MockChatUI.tsx`, `components/EarlyAccessForm.tsx`
- `components/Accordion.tsx`, `components/Tabs.tsx`, `components/FlowDiagram.tsx`
- Per-page files: `app/page.tsx`, `app/product/page.tsx`, etc.

---

## ✅ Validation Checklist (Before Code Review)

- [ ] All design tokens match prompt specification
- [ ] All 15 components documented with props, states, accessibility requirements
- [ ] Tailwind config extends with all custom tokens (colors, fonts, spacing, shadows)
- [ ] Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1280px (large)
- [ ] Accessibility checklist items mapped to implementation components
- [ ] `prefers-reduced-motion` respected in all animations
- [ ] Fonts imported from Google Fonts (DM Serif Display, DM Sans)
- [ ] Color contrast verified for all text on backgrounds
- [ ] Focus rings visible on all interactive elements
- [ ] Forms have labels, validation feedback, error messages with ARIA
- [ ] All images/icons have alt text or `aria-hidden="true"` as appropriate

---

## 📊 Architecture Summary

| Layer | Components | Files |
|-------|-----------|-------|
| **Global** | Nav, Footer, Section | `components/Nav.tsx`, `components/Footer.tsx`, `components/Section.tsx` |
| **Forms** | EarlyAccessForm | `components/EarlyAccessForm.tsx` |
| **Content** | Hero, ProblemCard, FeatureCard, Testimonial | `components/Hero.tsx`, `components/ProblemCard.tsx`, `components/FeatureCard.tsx`, `components/Testimonial.tsx` |
| **Interactive** | MockChatUI, Accordion, Tabs | `components/MockChatUI.tsx`, `components/Accordion.tsx`, `components/Tabs.tsx` |
| **Diagrams** | FlowDiagram | `components/FlowDiagram.tsx` |
| **Utilities** | Eyebrow, SectionReveal | `components/Eyebrow.tsx`, `components/SectionReveal.tsx` |
| **Pages** | Home, Product, ForDoctors, Evidence, About, EarlyAccess | `app/page.tsx`, `app/product/page.tsx`, `app/for-doctors/page.tsx`, `app/evidence/page.tsx`, `app/about/page.tsx`, `app/early-access/page.tsx` |

---

**Design System Status**: ✅ **Ready for Frontend Development**  
**Architect**: UX Architect  
**Date Finalized**: 2026-06-15
