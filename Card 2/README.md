# Card 2 — Vite + React + TypeScript Build

This is a fresh Vite + React + TypeScript implementation of Phases 1–5 of the wedding invitation site (Vartika & Hardik).

## Project Structure

```
src/
├── components/
│   ├── Preloader.tsx         # Phase 1: Hand/rose convergence animation
│   ├── Preloader.css
│   ├── Hero.tsx              # Phase 2: Main hero with sunset bg & names
│   ├── Hero.css
│   ├── GallerySection.tsx     # Gallery of frames
│   ├── GallerySection.css
│   ├── KaaryakramSection.tsx  # Phase 3: Transition to events
│   ├── KaaryakramSection.css
│   ├── EventStamps.tsx        # Phase 4: Postal stamp event cards
│   ├── EventStamps.css
│   ├── RSVPSection.tsx        # RSVP form
│   ├── RSVPSection.css
│   ├── FooterSection.tsx      # Footer
│   └── FooterSection.css
├── App.tsx
├── App.css
├── main.tsx
└── index.css
assets/
└── hand animation/
    ├── hand left.png         # Bride's hand (transparent PNG)
    └── hand right.png        # Groom's hand (transparent PNG)
```

## Phases Implemented

### Phase 1 — Hero Preloader ✓
- Hand/rose convergence animation with GSAP
- Fade-in on contact, pulse effect
- "Touch to continue" hint
- Respects `prefers-reduced-motion`

### Phase 2 — Main Hero ✓
- Full-viewport hero with background image overlay
- Couple names + tagline fade-in
- Scroll hint animation

### Phase 3 — Kaaryakram Section ✓
- Damask background pattern
- Transition to event cards
- Section heading + subtitle

### Phase 4 — Event Stamps ✓
- Postal stamp-style cards (circular with dashed borders)
- Three events: Engagement, Haldi, Wedding
- Responsive grid layout
- Hover scale + shadow effects

### Phase 5 — Responsive & Performance ✓
- Mobile-first breakpoints
- CSS clamp() for fluid typography & spacing
- Lazy image loading (via `loading="lazy"`)
- GSAP ScrollTrigger for entrance animations

## Getting Started

```bash
npm install
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production (output: dist/)
```

## Configuration

- **Vite**: Hot module replacement, fast dev server
- **React 18**: Latest features
- **TypeScript**: Type-safe components
- **GSAP**: Smooth animations with ScrollTrigger
- **Framer Motion**: Ready for future interactive states

## Fonts

The project uses Google Fonts:
- **Cormorant Garamond**: Display & body serif (via @font-face in index.html can be added)
- **IM Fell English**: Elegant serif accent (optional, can be added)

Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=IM+Fell+English:ital@0;1&display=swap" rel="stylesheet" />
```

## Color Palette

```css
--gold: #dfb76c;
--gold-light: #f3dfa2;
--gold-dim: #8a6d15;
--crimson: #6b0000;
--ivory: #faf6ee;
--deep-bg: #0a0300;
--deep-green-bg: #05140a;
```

## Next Steps (Phases 6–7)

- **Phase 6**: Firebase Auth + Firestore admin panel (not included in this build)
- **Phase 7**: Dynamic invite links via Firestore (future iteration)

---

Built with ❤️ for Vartika & Hardik's celebration.
