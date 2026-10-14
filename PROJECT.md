# Beit Plus — High-Converting 3D Multilingual Multi-Utility Broker Experience

## 1. Executive Summary & Brand Blueprint

**Beit Plus** ("Haus Plus") is Germany's premier multilingual multi-utility broker platform, dedicated to modern households across Germany, specifically bridging the gap for German, Arabic, Turkish, and English-speaking residents.

The application delivers a cinematic 3D web experience built with **React 19, Three.js, React Three Fiber (R3F), Drei, GSAP, and Tailwind CSS**, featuring an architectural 3D house sanctuary, dynamic scrollytelling across 5 distinct acts, authentic RTL/LTR typography switching, and real-time telemetry-driven savings calculations.

---

## 2. Core Architecture & Tech Stack

- **Runtime & Framework**: React 19 (`react`, `react-dom`) with TypeScript 5.7+
- **Bundler & Build Tooling**: Vite 6.1+ (`@vitejs/plugin-react`)
- **3D Graphics & Physics**: Three.js (`three` r186+), `@react-three/fiber` v9+, `@react-three/drei` v10+
- **Animation & Timelines**: GSAP 3.15+ (`gsap`, `@gsap/react`)
- **Styling & Design Tokens**: Tailwind CSS 3.4+ with custom brand palette and RTL direction support
- **State & Telemetry**: Singleton reactive engine `AntigravityController` dual-bound to `window.AntigravityController` and `window.SplineApp`
- **Internationalization (i18n)**: Native React Context supporting German (`de`), Arabic (`ar` with `dir="rtl"` and Cairo typography), English (`en`), and Turkish (`tr`)

---

## 3. Brand Identity & Color Palette

| Token | Hex Value | Role & Usage |
|---|---|---|
| **Midnight Navy** | `#0F2D4A` | Architectural house chassis, dark mode foundation, primary background |
| **Deep Teal** | `#0F8A83` | Bioluminescent Plus crystal, energy pillar accents, active interactive highlights |
| **Champagne Gold** | `#C7A55A` | Specular bevel rims, luxury trims, premium savings counter readouts |
| **Off-White** | `#FAFAF7` | Primary high-contrast text, clean card accents |
| **Charcoal** | `#2D3748` | Neutral glass surfaces, control widgets, secondary card backgrounds |

---

## 4. 5-Act Scrollytelling Choreography

```
Scroll Progress:  0.0 ───────── 0.20 ───────── 0.45 ───────── 0.70 ───────── 0.90 ───────── 1.0
                  │   Act I     │    Act II    │   Act III   │    Act IV   │   Act V     │
                  │ Bureaucracy │ Four Pillars │ Savings/RTL │ Flow Portal │ Advisor Teleport│
```

### Act I: The Bureaucratic Noise & The Anchor (0% – 20%)
- **Cinematic Framing**: 35mm low-angle camera framing the solid 3D house monolith.
- **Narrative**: The overwhelming chaos of German utility bills, contracts, and letters (Strom, Gas, Krankenkasse, DSL). Floating grey document sheets drift in peripheral space with subtle inertia.
- **Interactions**: Cursor inertia tilting up to ±14° with magnetic beacon attraction toward the cursor.

### Act II: The Deconstruction of Protection (20% – 45%)
- **Cinematic Framing**: 45° isometric dolly rotation; the house chassis deconstructs into a luxury architectural blueprint.
- **The Four Pillars**:
  1. **Energy (Strom & Gas)**: Dynamic kilowatt & savings metric glowing in Deep Teal (`#0F8A83`).
  2. **Health (Krankenkassen & Zahnzusatz)**: Heartbeat pulse rhythm and medical protection shield.
  3. **Mobility (KFZ & Sachwerte)**: Reinforced metallic automotive shield plate.
  4. **Telecom (DSL & Glasfaser)**: Luminous fiber-optic constellation web.
- **Interactions**: Hovering on pillars highlights corresponding 3D satellites and updates `hoverTarget` telemetry.

### Act III: The Multilingual Flip & Real-Time Savings Engine (45% – 70%)
- **Cinematic Framing**: 180° cinematic orbit around the architectural sanctuary.
- **Multilingual Dynamics**: Seamless language switching across German (DE), Arabic (AR), English (EN), and Turkish (TR). Arabic activation instantly flips layout to RTL (`dir="rtl"`) with authentic Cairo font family.
- **Dynamic Savings Engine**: Interactive household slider (1–6 persons) dynamically calculates annual savings (up to 1.800 €/year), updates pillar breakdowns, and adjusts the 3D gold rim emission.

### Act IV: The Sanctuary of Flow (70% – 90%)
- **Cinematic Framing**: Panoramic wide-angle pull-back. Pillars recombine into a unified central monolith.
- **Narrative**: Chaotic contract sheets dissolve into streams of golden light (`#C7A55A`) absorbed by the central Plus, flowing directly into a mock digital client portal.
- **Features Highlighted**: Automated yearly tariff audits, guaranteed one-click cancellation protection, secure document vault, and assigned personal advisor.

### Act V: The Direct Teleport & Instant Native Consultation (90% – 100%)
- **Cinematic Framing**: Floating resting anchor state with a soothing 2-second breathing pulse.
- **Call to Action**: Direct teleportation to personal consultation via drawer modal. Native-speaking advisor matched in the user's selected language (German, Arabic, English, or Turkish).
- **Channels**: Instant WhatsApp messaging, 15-minute phone callback request, and scheduled video calendar appointments.

---

## 5. Antigravity Controller Telemetry Interface Contract

Both `window.AntigravityController` and `window.SplineApp` implement the `AntigravityControllerAPI` contract:

```typescript
export interface TelemetryState {
  scrollProgress: number;     // 0.0 to 1.0
  activeLanguage: 'de' | 'ar' | 'en' | 'tr';
  hoverTarget: 'energy' | 'health' | 'mobility' | 'telecom' | 'house' | null;
  savingsValue: number;       // Annual Euros, e.g. 420 to 1800
  householdSize: number;      // 1 to 6 persons
  isConsultationOpen: boolean;
  currentAct: 1 | 2 | 3 | 4 | 5;
}

export interface AntigravityControllerAPI {
  readonly scrollProgress: number;
  readonly activeLanguage: ActiveLanguage;
  readonly hoverTarget: HoverTarget;
  readonly savingsValue: number;
  readonly householdSize: number;
  readonly isConsultationOpen: boolean;
  readonly currentAct: ActNumber;

  getState(): TelemetryState;
  setScrollProgress(progress: number): void;
  setActiveLanguage(lang: ActiveLanguage): void;
  setHoverTarget(target: HoverTarget): void;
  setHouseholdSize(size: number): void;
  setSavingsValue(value: number): void;
  setConsultationOpen(isOpen: boolean): void;
  openConsultation(): void;
  closeConsultation(): void;
  toggleConsultation(): void;

  subscribe(listener: (state: TelemetryState) => void): () => void;
  emit(event: string, detail?: unknown): void;
}
```

Events are also dispatched globally as `antigravity:telemetry` on `window`.

---

## 6. Milestone Plan & Execution Roadmap

| Milestone | Scope & Deliverables | Status |
|---|---|---|
| **M1: Core Scaffolding & Antigravity Telemetry** | React 19 + TypeScript + Vite project bootstrap, package dependencies, config files (`vite.config.ts`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`), `AntigravityController` engine with dual `window` binding, 4-language i18n system with RTL support, HUD & UI shell, `PROJECT.md`, zero-error production build. | **COMPLETE** |
| **M2: 3D Procedural Sanctuary & Shaders** | R3F canvas, procedural house chassis with smoked dielectric frosted glass, glowing Plus crystal with volumetric subsurface emission, 4 orbital satellites, low-poly geometry (< 55k triangles), 60 FPS performance envelope. | Next Up |
| **M3: Scrollytelling Choreography & GSAP Engine** | 5-Act scroll timeline integration, camera path splines, mouse inertia tilting, blueprint deconstruction in Act II, portal flow animation in Act IV. | Scheduled |
| **M4: Dynamic Savings Engine & Multilingual Morph** | 3D typography morphing between Latin and Arabic glyphs, real-time household slider reaction on 3D house volume and gold rim emission. | Scheduled |
| **M5: Native Consultation Drawer & Verification Suite** | Production-ready consultation modal, end-to-end telemetry verification script, visual testing, final performance polish. | Scheduled |

---

## 7. Directory Structure & Layout Discipline

```
Beitplus_Landing_Page/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── PROJECT.md
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── ActSections.tsx
│   │   ├── TelemetryHUD.tsx
│   │   ├── ConsultationDrawer.tsx
│   │   └── acts/
│   ├── i18n/
│   │   ├── language-context.tsx
│   │   └── translations.ts
│   ├── store/
│   │   └── antigravity-controller.ts
│   └── types/
│       └── telemetry.ts
└── .agents/teamwork/   (metadata, logs, and handoff reports only)
```
