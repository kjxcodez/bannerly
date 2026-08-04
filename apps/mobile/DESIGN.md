# Bannerly — Design System

*"Small print studio" aesthetic: warm, tactile, reassuring. The app should feel like a friendly neighborhood print shop, not a generic design-tool interface — closer to a well-loved stationery store than a SaaS dashboard.*

---

## 1. Design Principles

1. **Reassuring, not clinical.** Every screen should make a first-time user feel "I can make something good here," even with zero design background. No jargon (no "canvas," "layers," "assets" — say "design," "photo," "text").
2. **Constrained by design, not by limitation.** The slot-based editor isn't a lesser version of a free-form canvas — it's the point. Visual language should reinforce "this is easy because it's considered," not "this is easy because it's basic."
3. **One accent color does the talking.** Coral carries all primary actions. Gold is reserved exclusively for Premium/celebratory moments — the instant a user sees gold, they should know something special is happening.
4. **Paper, not glass.** Avoid heavy blur/glassmorphism, neon glows, or dark-mode-first defaults. Warm, matte, paper-like surfaces throughout.

---

## 2. Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-cream` | `#FAF6EE` | Primary screen background |
| `--color-bg-cream-deep` | `#F2ECDD` | Card/section backgrounds, subtle layering above the base cream |
| `--color-ink` | `#2B2621` | Primary text — deep warm brown-black, never pure `#000` |
| `--color-ink-muted` | `#6B5F52` | Secondary text, captions, placeholder text |
| `--color-coral` | `#E8623D` | Primary actions — buttons, active tab, selected slot outline, links |
| `--color-coral-pressed` | `#C94F2E` | Pressed/active state of coral elements |
| `--color-coral-tint` | `#FBE4DA` | Coral at 12% — selected-state backgrounds, badges |
| `--color-gold` | `#C99A3A` | Premium badges, upgrade CTAs, celebratory success states only |
| `--color-gold-tint` | `#F6EBD2` | Premium section backgrounds |
| `--color-border` | `#E4DBC9` | Card borders, dividers — always soft, never high-contrast hairlines |
| `--color-success` | `#4A7A5E` | Muted sage green — save confirmations, export success |
| `--color-error` | `#B14538` | Errors — a desaturated red-clay, not a harsh alert red, to stay in-palette |
| `--color-white` | `#FFFFFF` | Editor canvas surface only (the design itself sits on true white/template bg, not cream, so exported output isn't tinted) |

**Rule:** the editor canvas is the one place cream doesn't apply — the canvas shows the template's actual background so what users see is exactly what exports.

---

## 3. Typography

| Role | Typeface | Notes |
|---|---|---|
| **Display** (headers, "Make something today", category titles) | A warm serif with real personality — **Fraunces** (variable, adjustable optical size) or **Lora** if Fraunces isn't available cross-platform. Used at Bold/SemiBold only, never body-length text. | This is the "print shop" signal — serif display against a sans body is the single strongest brand cue in the whole system. |
| **Body / UI** | **Inter** or **Manrope** — clean, humanist, highly legible at small sizes on-device. | All buttons, labels, form fields, descriptions. |
| **Caption / Meta** | Same as body, one step down in size and in `--color-ink-muted` | Character counts, template category tags, timestamps. |

### Type scale (base 16px / 1rem)

| Token | Size | Weight | Usage |
|---|---|---|---|
| `display-lg` | 32px | Serif, SemiBold | "Make something today" header |
| `display-md` | 24px | Serif, SemiBold | Screen titles, category section headers |
| `title` | 18px | Sans, SemiBold | Card titles, modal headers |
| `body` | 15px | Sans, Regular | Default UI text |
| `body-sm` | 13px | Sans, Regular | Secondary text, helper copy |
| `caption` | 11px | Sans, Medium, letter-spacing +0.02em | Tags, counters, timestamps |

Line height: 1.4× for body, 1.15× for display. Letter-spacing on display stays default (0) — the serif already carries personality, don't fight it with tracking.

---

## 4. Spacing & Layout

8px base unit throughout.

| Token | Value |
|---|---|
| `space-xs` | 4px |
| `space-sm` | 8px |
| `space-md` | 16px |
| `space-lg` | 24px |
| `space-xl` | 32px |
| `space-2xl` | 48px |

- Screen horizontal padding: `space-md` (16px) on phone, `space-xl` on tablet.
- Card internal padding: `space-md`.
- Grid gutter (template gallery, 2-column grid): `space-sm`.

---

## 5. Radius & Elevation

- **Radius:** everything rounded, nothing sharp. Cards `16px`, buttons `12px`, small chips/tags `8px`, the app's own icon/avatar-style elements `full (999px)`.
- **Shadows:** restrained, warm-tinted, never pure black. `box-shadow: 0 2px 8px rgba(43, 38, 33, 0.08)` for cards; `0 4px 16px rgba(43, 38, 33, 0.12)` for modals/sheets. No glow, no colored shadows except a very subtle coral shadow under the primary FAB/export button (`0 4px 12px rgba(232, 98, 61, 0.25)`).
- **Borders:** 1px `--color-border`, used instead of shadow where a flatter feel suits (e.g., input fields).

---

## 6. Components

### Buttons
- **Primary** — solid coral fill, white text, `12px` radius, `space-md` horizontal padding, `48px` min height (touch target).
- **Secondary** — cream-deep fill, ink text, coral 1px border.
- **Premium/Upgrade** — gold fill, ink text (not white — gold+white fails contrast comfortably; gold+ink reads richer anyway), small crown or star glyph leading.
- **Destructive** (remove image, delete) — outline only, `--color-error` text/border, no fill until pressed.

### Cards (template gallery)
- `16px` radius, cream-deep background, `1px` border, thumbnail fills top ~70%, category tag chip + template name below.
- Premium templates get a small gold corner ribbon or badge — consistent, small, never covering the thumbnail's content.

### Slot editor (canvas)
- Selected slot: `2px` coral outline + `4px` coral-tint glow ring, corner handles only if resizing is supported.
- Unselected slots on tap-to-reveal: thin dashed `--color-border` outline so users always know what's editable, even before tapping.

### Tags/Chips (category filters)
- Pill shape, `8px` radius or full — cream-deep default, coral-tint + coral text when active/selected.

### Empty states
- Illustration space + serif headline + one sentence of plain-language guidance + a single clear action button. Never just an icon and "No results."

### Toasts/Confirmations
- Bottom-anchored, cream-deep background, sage-green left accent for success, ink text. Auto-dismiss 2.5s.

---

## 7. Motion

- Keep it minimal and functional — this brand's warmth comes from color/type/copy, not animation.
- Template selection → editor: simple shared-element scale/fade, 200ms ease-out.
- Slot selection: outline fades in over 120ms, no bounce.
- Export success: one subtle celebratory moment (gold confetti-lite or a soft scale-pulse on the success checkmark) — this is the *one* place a little extra motion earns its keep, since it's the emotional payoff moment of the whole app.
- Respect reduced-motion device settings everywhere; fall back to instant/opacity-only transitions.

---

## 8. Voice & Copy Guidelines

- Second person, active voice, plain verbs: "Save your design," not "Design saved successfully by system."
- Button labels state the outcome: "Export design," "Save to gallery," "Upgrade to Premium" — never "Submit," "OK," "Continue" alone.
- Empty/error states explain and invite action: "No templates match your search. Try a different word, or browse all categories." — never a bare "No results found."
- Premium copy sells the *outcome*, not the feature list: "No ads, ever" beats "Ad-free experience enabled."

---

## 9. Accessibility Floor

- All interactive elements ≥ 44×44px touch target.
- Text contrast: ink (`#2B2621`) on cream (`#FAF6EE`) = ~11:1 (comfortably AA/AAA). Coral text on white/cream checked against 4.5:1 minimum for body-size text; use coral only at button/label sizes where contrast margin is safer, not for long body copy.
- Every icon-only control has an accessible label.
- Selected/focused states are never color-only — always paired with an outline or icon change for colorblind users.

---

*This document is the source of truth for design tokens. When implementing, define these as actual theme constants (e.g., a `theme.ts` in `packages/shared-types` or a local `theme/tokens.ts` in `apps/mobile`) rather than hardcoding hex values per-screen.*