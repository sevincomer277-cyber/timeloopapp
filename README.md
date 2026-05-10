# TimeCapsule

A premium digital time capsule platform where users can send messages, photos, videos, and memories to their future selves or future dates.

## About

TimeCapsule lets you seal a moment in time and send it forward. Write a letter to your future self, preserve a wedding day in photos and voice notes, or contribute to a shared century capsule opening in 2100. Each capsule locks until a chosen date and unlocks with full ceremony when the moment arrives.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (SSR/SPA) |
| Frontend | React 19 + TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS properties |
| Language | TypeScript 5.7 (strict) |
| Deployment | Netlify |
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |
| Icons | Lucide React |

## Running Locally

```bash
npm install
npm run dev        # Dev server on port 3000
npm run build      # Production build
```

With Netlify CLI (recommended for full feature emulation):

```bash
netlify dev        # Runs on port 8888 with Netlify features
```

## Design System

The UI is built around a deep temporal luxury aesthetic:

- **Background**: near-black void (`#06060e`) to deep navy  
- **Accent**: warm amber gold (`#c8a96d`) — a color that evokes candlelight, old photographs, and precious things  
- **Typography**: Cormorant Garamond italic for emotional display text; DM Sans for clean body copy  
- **Effects**: glassmorphism cards, animated star field, film grain overlay, section reveal animations, live countdown timers

## Key Features

- **Hero** with animated star field, atmospheric orbs, live statistics
- **How It Works** — 3-step sealed process visualization  
- **Featured Capsules** — glassmorphism cards with live countdown timers and progress bars
- **Century Capsule Showcase** — large dramatic countdown to 2100  
- **Testimonials** — editorial layout with real-feeling stories  
- **Pricing** — 3 tiers (Free / Keeper $6/mo / Legacy $18/mo)  
- **FAQ** — accordion with smooth height animations  
- **Create Capsule Modal** — 4-step wizard (type → content → date → seal)
- **Dark/Light mode toggle** — CSS variable theming
- **AdSense-ready** — natural ad slots between sections

## Routes

- `/` — Full landing page
- `/faq` — Standalone FAQ page
