# GUL — Interactive Indian Wedding Invitation

A production-ready, mobile-first digital wedding invitation experience built with React, TypeScript, Vite, and Framer Motion.

## 🌹 Overview

**GUL** (गुल) is a modern Indian wedding invitation website that feels like a living, breathing invitation has come to life. It combines:

- Hand-drawn aesthetic inspired by vintage Indian postcards
- Smooth scroll choreography and interactive animations
- Fully editable content through an integrated admin panel
- Responsive design optimized for mobile (primary) and desktop
- Route variants supporting multiple invitation types
- Event stamps with 3D flip interactions
- Paper texture and authentic visual language

## ✨ Features

### Core Experience
- **Opening Animation** — Rose exchange between bride and groom hands
- **Hero Section** — Large couple photography with typography
- **Event Stamps** — Interactive 3D-flipping postcard-style event cards
- **Photo Gallery** — Memory and family photography sections
- **RSVP Form** — Styled like wedding stationery
- **Location Card** — Venue information with map integration
- **Closing Section** — Elegant farewell with card signature

### Technical Features
- **Vite Build System** — Lightning-fast development and production builds
- **TypeScript** — Full type safety throughout
- **Framer Motion** — Smooth, performant animations
- **Tailwind CSS** — Rapid, responsive styling
- **Admin Panel** — Real-time content editing
- **Route Variants** — Support multiple invitation variants (bride/groom/all)
- **Responsive Design** — Mobile-first, works on all devices
- **Accessibility** — Semantic HTML, reduced-motion support

## 🎯 Quick Start

### Installation

```bash
cd card-3
npm install
npm run dev
```

The dev server will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
  components/
    Opening.tsx           # Rose exchange opening animation
    Hero.tsx              # Hero section with couple photo
    EventStamp.tsx        # 3D flipping event cards
    PhotoGallery.tsx      # Memory and family photos
    RSVP.tsx              # RSVP form styled as stationery
    Location.tsx          # Venue information
    Closing.tsx           # Farewell section
    StorySection.tsx      # Narrative sections
    ProgramHeader.tsx     # Program section header

  admin/
    AdminPanel.tsx        # Content editing interface

  data/
    config.ts             # Central configuration & content model
    assets.ts             # Asset manifest and utilities

  styles/
    index.css             # Global styles, Tailwind, animations

  App.tsx                 # Main application component
  main.tsx                # React entry point

public/assets/            # Static assets organized by category
  hand left.png
  hand right.png
  engagement_stamp.png
  mehandi_stamp.png
  wedding_stamp.png
  [typography, backgrounds, overlays...]
```

## ⚙️ Configuration

All content is centralized in `src/data/config.ts`. Edit there to:

- Change couple names and initials
- Update event details (dates, times, venues)
- Modify RSVP fields
- Adjust location information
- Change theme colors
- Add/remove/reorder events

### Example: Update Couple Names

```typescript
export const gulConfig: WeddingCardConfig = {
  couple: {
    personA: 'Your Name',
    personB: 'Partner Name',
    initials: 'YP',
  },
  // ... rest of config
}
```

### Example: Add New Event

```typescript
events: [
  // ... existing events
  {
    id: 'sangeet',
    name: 'Sangeet',
    localName: 'संगीत',
    date: '19 October 2026',
    time: '6:00 PM onwards',
    venue: 'The Taj Palace',
    city: 'New Delhi',
    description: 'An evening of music and dance',
    theme: {
      bg: '#F5A623',
      text: '#2C2C2C',
      accent: '#D4443D',
    },
    frontAsset: 'sangeet_stamp.png',
  },
]
```

## 🎨 Admin Panel

Click the **⚙** button (bottom right) to access the admin panel. Edit:

- **General** — Card name, couple information
- **Couple** — Names and initials
- **Hero** — Title, subtitle, description
- **Events** — Event details, dates, venues
- **RSVP** — Form title, description, enabled status
- **Location** — Venue, address, map URL

Changes are saved to the application state in real-time.

## 🔗 Route Variants

Support multiple invitation types via URL search params:

```
/?route=/all                  # All events
/?route=/bride/2              # Bride variant (engagement + wedding)
/?route=/groom/T              # Groom variant (all events)
```

Add new variants in `src/data/config.ts`:

```typescript
export const routeConfig: RouteConfig = {
  '/bride/2': { events: ['engagement', 'wedding'] },
  '/groom/T': { events: ['engagement', 'mehendi', 'wedding'] },
  '/all': { events: ['engagement', 'mehendi', 'wedding'] },
  // Add new variants here
}
```

## 📸 Asset Organization

Assets are organized in `public/assets/`:

```
assets/
  hand left.png              # Animation hands
  hand right.png
  engagement_stamp.png       # Event stamps
  mehandi_stamp.png
  wedding_stamp.png
  bg_overlay_red.png         # Background overlays
  bg_overlay_yellow.png
  stamp_like_bg_*.png        # Stamp backgrounds
  vivah typography.png       # Typography assets
  the karyakram typography.png
  aapka intazaar rahega.png
```

Reference assets via the manifest in `src/data/assets.ts`:

```typescript
import { getAsset } from '@/data/assets'
const handPath = getAsset('hand_bride') // Returns '/assets/hand left.png'
```

## 🎬 Animations

All animations use:

- **Framer Motion** — For scroll-triggered reveals and interactions
- **CSS Transforms** — For performant animations
- **Reduced Motion** — Respects `prefers-reduced-motion` for accessibility

### Motion Principles

- Cubic-bezier easing for smooth, natural movement
- Subtle 100-500ms durations for elegance
- Scale and opacity for performant reveals
- No bounce or excessive elasticity

## 🎨 Design Tokens

Typography:

```css
--display: Georgia, serif
--serif: Crimson Text, serif
--body: Inter, sans-serif
--devanagari: Noto Sans Devanagari, sans-serif
```

Colors:

```css
--paper: #FAF6F1
--paper-warm: #F5EFE7
--red: #D4443D
--maroon: #8B3A36
--terracotta: #C85A3A
--saffron: #F4A460
--ink: #2C2C2C
```

## 📱 Responsive Breakpoints

- **Mobile** — 320px–767px (primary experience)
- **Tablet** — 768px–1023px
- **Desktop** — 1024px+ (refined adaptation of mobile)

## ♿ Accessibility

- Semantic HTML throughout
- Keyboard navigation support
- ARIA labels where appropriate
- `prefers-reduced-motion` support
- Sufficient color contrast (WCAG AA)
- Alt text for images
- Form labels and error handling

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Static Hosting

```bash
npm run build
# Deploy dist/ folder to any static host
```

## 🔮 Future Enhancements

- Backend content persistence (Supabase/PostgreSQL)
- Pre-rendered cinematic hand animation
- Additional event types and variations
- Gallery image upload and management
- Email RSVP integration
- Multiple language support
- Invitation variant builder UI
- Analytics and tracking

## 📝 License

Created for the GUL wedding invitation project.

---

**Made with 🌹 and care for celebrating love.**
