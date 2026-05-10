# AGENTS.md — TimeCapsule

This document is the authoritative guide for AI agents and developers working on this codebase.

## Project Overview

**TimeCapsule** is a premium digital time capsule SaaS platform. Users create capsules containing messages, photos, videos, and voice notes, set a future unlock date, and receive them when the day arrives.

Built on TanStack Start with a luxury dark aesthetic (near-black + amber gold + Cormorant Garamond).

## Architecture

### Framework
TanStack Start (SSR-capable React meta-framework). Routes are file-based under `src/routes/`. The router config is in `src/router.tsx`.

### Directory Structure

```
src/
  routes/
    __root.tsx       — Root layout: Google Fonts links, SEO meta, HTML shell
    index.tsx        — Full landing page (all sections + modal, ~700 lines)
    faq.tsx          — Standalone FAQ page
  styles.css         — Design system: CSS custom properties, keyframes, utility classes
  router.tsx         — TanStack Router setup

public/              — Static assets

netlify.toml         — Build config: `vite build`, publish `dist/client`
vite.config.ts       — Vite plugins: TanStack Start, Netlify, Tailwind
tsconfig.json        — Strict TypeScript, @/* alias for src/*
package.json         — Dependencies
```

### Key Files

**`src/routes/index.tsx`** — The entire landing page lives here as a series of React components:
- `StarField` — deterministic (non-random) animated star particles, SSR-safe
- `Nav` — sticky nav with scroll detection, mobile menu, dark/light toggle
- `HeroSection` — full-viewport hero with animated background
- `HowItWorksSection`, `FeaturedCapsulesSection`, `CountdownShowcaseSection`
- `TestimonialsSection`, `PricingSection`, `FAQSection`, `Footer`
- `CreateCapsuleModal` — 4-step capsule creation wizard (frontend only, no persistence yet)
- `SmallCountdown`, `LargeCountdown` — live countdown timers using `useCountdown` hook
- `CapsuleCard` — glassmorphism card with countdown, progress bar, blur preview

**`src/styles.css`** — Pure CSS design system. Uses:
- CSS custom properties (`--gold`, `--void`, `--glass`, etc.) under `:root`
- Light mode overrides under `[data-theme="light"]`
- Keyframe animations: `twinkle`, `float`, `fade-up`, `pulse-glow`, `grain`, `shimmer`
- Named utility classes: `.btn-gold`, `.btn-ghost`, `.glass-card`, `.capsule-card`, `.section-label`, `.gradient-text`, `.glow-divider`, `.grain`, `.section-reveal`

**`src/routes/__root.tsx`** — Adds Google Fonts (Cormorant Garamond + DM Sans) via `links` array in `head()`.

## Design System

### Color Palette (dark mode)
| Token | Value | Usage |
|-------|-------|-------|
| `--void` | `#06060e` | Page background |
| `--deep` | `#0a0c1c` | Section alternate background |
| `--surface-1` | `#0f1126` | Modal, featured sections |
| `--gold` | `#c8a96d` | Primary accent |
| `--gold-bright` | `#e8cb8c` | Headlines, countdown values |
| `--text-primary` | `#ede9e1` | Body text |
| `--text-secondary` | `#9e9ab0` | Descriptions |
| `--text-muted` | `#56536a` | Labels, metadata |

### Typography
- **Display** (`--font-display`): Cormorant Garamond italic, weight 300-400 — section headers, hero
- **Body** (`--font-body`): DM Sans, weight 300-600 — all prose and UI text

### Theming
Dark/light mode toggles via `document.documentElement.setAttribute('data-theme', theme)`. All colors defined as CSS variables with `[data-theme="light"]` overrides.

## Coding Conventions

### React Patterns
- `useCountdown(Date)`, `useScrollReveal()`, `useNavScroll()` are module-level hooks in `index.tsx`
- Section reveal uses IntersectionObserver; `{ ref, visible }` from `useScrollReveal()`
- Star field uses deterministic hash `(i * 2654435761) >>> 0` for SSR-safe positions (no Math.random)
- Modal state lives in `Home` component, passed down via callbacks

### Styling
- Prefer CSS custom properties over inline magic numbers
- Use named CSS classes from `styles.css` for complex components
- Use Tailwind utilities for layout (flex, grid, responsive breakpoints)
- Animate only `transform` and `opacity` — never `top`, `left`, `width`, `height`

### Ad Slots
Natural `div.ad-slot` elements placed at:
1. Above capsule feed in `FeaturedCapsulesSection` (728×90)
2. Between testimonials heading (728×90)
3. Bottom of FAQ section (300×250)

## Non-Obvious Decisions

1. **Star field uses multiplicative hash** instead of `Math.random()` to avoid React hydration mismatches between server and client renders.

2. **All landing page sections are in one file** (`index.tsx`). If the file grows beyond ~1000 lines, extract sections into `src/components/sections/`.

3. **Capsule preview is CSS-blurred** for private capsules (`filter: blur(4px)`) — a visual metaphor for the sealed-until-future design.

4. **Create Capsule modal is purely frontend** — no backend persistence. To add real storage, implement a Netlify Function and wire up the `handleSeal` callback in `CreateCapsuleModal`.

## Adding Features

### Real capsule persistence
- Use `netlify-database` skill to set up Postgres with Drizzle ORM
- Define a `capsules` table in `db/schema.ts`
- Create a server function in `src/server/capsules.ts`
- Replace the `handleSeal` callback with a mutation

### Authentication
- Use `netlify-identity` skill
- Protect capsule creation behind auth
- Scope capsule queries to the authenticated user

### New landing page sections
Follow the pattern: create a component function, use `useScrollReveal()` for entrance animation, wrap content in `div` with `maxWidth: 1100, margin: '0 auto'`, add to the `Home` component JSX.
