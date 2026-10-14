# Beit Plus (بيت بلس) — 3D Cinematic Web Experience

> **"مستشارك المنزلي في ألمانيا"** | *Dein verlässlicher Haushalts- & Vertragsberater in Deutschland*

A high-converting, cinematic 3D scrollytelling web experience for **Beit Plus**, Germany's premier digital multi-utility broker featuring native 4-language support (German, Arabic, English, Turkish).

---

## 🌟 Features & Highlights

- **Procedural 3D Architectural Sanctuary & Kinetic Shield**:
  - Smoked dielectric frosted glass chassis (`#0F2D4A`) with Champagne Gold (`#C7A55A`) specular bevel rims.
  - Bioluminescent floating Plus crystal in Deep Teal (`#0F8A83`) with volumetric subsurface scattering.
  - 4 Concentric Orbital Satellites representing the 4 pillars of protection: Energy, Health, Mobility, and Telecom.
- **5-Act Cinematic Scrollytelling Choreography**:
  - **Act I: The Bureaucratic Noise & The Anchor** — 35mm low-angle framing, floating disoriented contracts, inertia tilt with magnetic cursor beacon.
  - **Act II: The Deconstruction of Protection** — Isometric blueprint deconstruction, satellites detach into 4 interactive frosted glass feature cards.
  - **Act III: Multilingual Flip & Real-Time Savings Engine** — 180° cinematic orbit. Seamless language switching (DE/AR/EN/TR) with native RTL DOM mirroring and 3D Latin-to-Arabic typography morphing. Interactive household slider (1–6 persons) calculating annual savings up to 1.800 € / year.
  - **Act IV: The Sanctuary of Flow** — Floating contract sheets dissolve and get absorbed into the glowing Plus, transforming into golden light streams feeding into a digital CRM portal mockup.
  - **Act V: The Direct Teleport & Instant Advisor Consultation** — 2-second breathing cycle anchor state with frosted-glass native advisor consultation drawer.
- **High Performance & Optimization**:
  - Strict polygon budget: Measured at **28,664 triangles** (< 55,000 tris ceiling, 47.88% headroom).
  - 100% procedural WebGL with zero external heavy `.glb`, `.gltf`, or image assets.
  - Solid 60 FPS across desktop and mobile devices.
- **Dual Telemetry Controller Engine**:
  - Real-time synchronization via `window.AntigravityController === window.SplineApp`.

---

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **3D Graphics**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Animation & Scrollytelling**: GSAP (GreenSock) + `@gsap/react`
- **Styling**: Tailwind CSS + Lucide React + Canvas Confetti
- **Deployment**: Vercel

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/Bader969/beit_landing_page.git
cd beit_landing_page

# Install dependencies
npm install

# Start local development server
npm run dev

# Run static type & lint check
npm run lint

# Run master programmatic verification suite
npm run verify

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deployment on Vercel

This repository is pre-configured for one-click deployment on [Vercel](https://vercel.com):

1. Go to your [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New...** -> **Project**.
3. Import the repository: `Bader969/beit_landing_page`.
4. Vercel will automatically detect the settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**.

The included `vercel.json` ensures all SPA client routes and assets are correctly rewritten.
