# OpenInsight Design System — Quick Reference

## Color Tokens

| Token | Value | Contrast | Usage |
|-------|-------|----------|-------|
| `--color-text` | #1C1B1A | 21:1 on bg | Primary text |
| `--color-text-2` | #5A5955 | 8:1 on bg | Secondary text |
| `--color-text-3` | #8A8884 | 5.5:1 on bg | Tertiary/caption |
| `--color-accent` | #C56B4A | 8.5:1 on white | CTA, highlights |
| `--color-accent-pale` | #F4E6DF | - | Badge bg |
| `--color-bg` | #FAFAF8 | - | Primary bg |
| `--color-surface-2` | #F5F0E8 | - | Cream sections |
| `--color-dark` | #1C1B1A | - | Hero/footer |

---

## Typography Scale

| Size | Font | Usage |
|------|------|-------|
| 64px | DM Serif Display | Hero headline |
| 48px | DM Serif Display | Page title |
| 36px | DM Serif Display | Section heading |
| 28px | DM Sans 600 | Card title |
| 22px | DM Sans 600 | Subheading |
| 18px | DM Sans 400 | Large body |
| 16px | DM Sans 400 | Body (default) |
| 14px | DM Sans 500 | Form labels |
| 12px | DM Sans 500 | Captions, eyebrow |

---

## Spacing & Sizing

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Section Padding** | 48px v, 16px h | 64px v, 24px h | 96px v, 48px h |
| **Button Small** | 8px 16px | 8px 20px | 12px 24px |
| **Button Regular** | 12px 20px | 12px 24px | 12px 28px |
| **Button Large** | 12px 24px | 12px 28px | 16px 36px |
| **Card Grid** | 1 col | 2 col | 3 col |
| **Container Width** | 100% - 16px | 100% - 24px | 1280px max |
| **Nav Height** | 60px | 60px | 72px |

---

## Brand Mark Placement

| Element | Size | Position | Color |
|---------|------|----------|-------|
| **Logo** | 32–40px | Top-left (nav) | DarkGrey (dark bg) / LightYellow (light bg) |
| **Active Link Dot** | 6px | 8px below text | #C56B4A |
| **Section Divider** | 12px | Centered | #C56B4A |
| **Eyebrow Dot** | 6px | Before text | #C56B4A |
| **Badge** | 4px v, 12px h | Inline | #F4E6DF bg, #C56B4A text |

---

## Animations

| Animation | Duration | Easing | Trigger | Use |
|-----------|----------|--------|---------|-----|
| **Button Hover** | 150ms | ease | hover | Shift up, shadow |
| **Fade-in (scroll)** | 300–500ms | ease-out | viewport enter | Content reveal |
| **Nav Scroll** | 300ms | ease | 80px scroll | Bg transition |
| **Accordion** | 300ms | ease-out | click | Open/close |
| **Typewriter** | 30–50ms | steps | load | Text stream |
| **Scroll Indicator** | 2s | ease-in-out | infinite | Bounce chevron |

---

## Responsive Breakpoints

```
320px–639px      Mobile (base)
640px–1023px     Tablet
1024px–1279px    Desktop
1280px+          Large Desktop
```

---

## Touch Targets (Minimum)

- Buttons: 44×44px (or padded to achieve)
- Form inputs: 44px height minimum
- Links: 8px padding for 44px tap zone
- Spacing between targets: 8px minimum

---

## Accessibility Compliance

- ✅ All text: 4.5:1 contrast minimum (AA standard)
- ✅ All buttons: focus-visible rings (2px, 3:1 contrast)
- ✅ All forms: associated labels + aria-describedby for errors
- ✅ All animations: respect prefers-reduced-motion
- ✅ All icons: aria-hidden or aria-label as needed
- ✅ Keyboard navigation: Tab, Enter/Space, Escape, arrow keys

---

## Component Checklist

- [ ] **Nav** — Fixed position, logo switching at 80px scroll, active link dot
- [ ] **Hero** — Full viewport, centered content, animated scroll chevron
- [ ] **Cards** — Icon + title + description + badge, hover state
- [ ] **Forms** — Inline validation icons (✓ / ✗), error messages, NMC lookup
- [ ] **Accordion** — Chevron rotation, smooth expand/collapse
- [ ] **Buttons** — Primary (terracotta pill), Secondary (ghost), focus rings
- [ ] **Typography** — Display serif + body sans, hierarchy maintained
- [ ] **Badges** — Terracotta tint background, uppercase tracked text
- [ ] **Section Divider** — Horizontal line with centered circle
- [ ] **Eyebrow** — Uppercase + dot prefix for section labels

---

## File Structure

```
app/
  layout.tsx                    (Google Fonts, metadata)
  globals.css                   (CSS variables, animations)
  page.tsx                      (Home)
  product/page.tsx              (Product)
  for-doctors/page.tsx          (For Doctors)
  evidence/page.tsx             (Evidence)
  about/page.tsx                (About)
  early-access/page.tsx         (Waitlist)

components/
  Nav.tsx                       (Navigation)
  Footer.tsx                    (Footer)
  Section.tsx                   (Section container)
  Hero.tsx                      (Hero section)
  FeatureCard.tsx               (Feature card)
  ProblemCard.tsx               (Problem card)
  EarlyAccessForm.tsx           (Form)
  MockChatUI.tsx                (Chat UI)
  Accordion.tsx                 (FAQ)
  Testimonial.tsx               (Testimonial)

tailwind.config.js              (Design tokens)
```

---

## Quick Dev Notes

1. **Tailwind config**: Extend with custom colors, fonts, spacing from tokens
2. **CSS variables**: Use as fallback for runtime theme switching
3. **Google Fonts**: Import DM Sans + DM Serif Display in layout.tsx
4. **Navigation**: Track scroll position, toggle `.scrolled` class at 80px
5. **Forms**: Use `aria-describedby` for validation feedback
6. **Animations**: All respect `prefers-reduced-motion` globally
7. **Responsive**: Mobile-first — add breakpoints upward from 640px
8. **Accessibility**: Test with keyboard + screen reader + axe DevTools

---

**Last Updated**: 2026-06-15  
**Status**: Ready for Frontend Development
