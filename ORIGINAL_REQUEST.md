# Original User Request

## Initial Request — 2026-10-13T19:37:08Z

Cinematic, high-converting 3D web experience for "Beit Plus" (Germany's premier multilingual multi-utility broker), built with Vite + React + Three.js (@react-three/fiber / Drei) + GSAP + Tailwind CSS, featuring a 5-act scrollytelling journey with a procedural 3D architectural house sanctuary, bioluminescent plus crystal, orbital satellites, real-time multilingual RTL/LTR morphing, and an interactive dynamic savings calculator.

Working directory: c:\Users\bader\Documents\Beitplus_Landing_Page
Integrity mode: development

## Requirements

### R1. 3D Architectural Sanctuary & Kinetic Brand Mark
- Procedural 3D scene implementing the Beit Plus architectural brand mark:
  - House Chassis in Midnight Navy (#0F2D4A) with smoked dielectric frosted glass (transmission ~0.88, IOR ~1.52, roughness ~0.14) and Champagne Gold (#C7A55A) specular bevel rims.
  - Floating Bioluminescent Plus crystal offset forward along the Z-axis in the roof notch, rendered in glowing Deep Teal (#0F8A83) with volumetric subsurface emission.
  - 4 Concentric Orbital Satellites representing the 4 pillars of protection:
    1. Energy Filament (flowing electric spline curve in #0F8A83).
    2. Health Cocoon (semi-translucent pearl glass sphere with heartbeat pulse).
    3. Mobility Hex-Plate (anodized charcoal mesh with gold rim #C7A55A).
    4. Telecom & Digital Home Node (pulsing fiber-optic constellation web).
- WebGL scene performance target: < 55,000 triangles total, procedural textures/shaders, locked at solid 60 FPS across desktop and mobile viewports with adaptive pixel ratio.

### R2. 5-Act Cinematic Scrollytelling Choreography
Progressive scroll-driven camera and scene timeline:
- Act I (0% - 20%): "The Bureaucratic Noise & The Anchor" — camera at 35mm low-angle framing the 3D house. Floating disoriented grey contract sheets drift in the periphery. Mouse inertia tilting up to ±14° with magnetic beacon attraction toward the cursor. Volumetric lighting bounce.
- Act II (20% - 45%): "The Deconstruction of Protection" — isometric dolly rotation (45°), roof and walls deconstruct like a luxury blueprint. The 4 orbital satellites detach into 4 interactive frosted glass feature cards:
  1. Strom & Gas: Dynamic kilowatt counter glowing in Deep Teal.
  2. Krankenkasse: 3D cross with health pulse rhythm.
  3. KFZ & Sachwerte: Reinforced metallic shield plate.
  4. Hausrat & DSL: Glowing fiber-optic luminous web.
- Act III (45% - 70%): "The Multilingual Flip & Real-Time Savings Engine" — 180° cinematic orbit. Seamless language switching between German (DE), Arabic (AR), English (EN), and Turkish (TR). When Arabic is active, the layout flips organically to RTL and the 3D typography morphs between Latin ("BEIT PLUS") and authentic Arabic typography ("بيت بلس مستشارك المنزلي في ألمانيا"). Real-time interactive household slider (1–6 persons) dynamically scaling the house volume, gold rim emission, and updating the live HUD savings counter (up to 1.800 € / year).
- Act IV (70% - 90%): "The Sanctuary of Flow" — panoramic wide-angle pull-back. Pillars recombine into the central monolith. Floating contract sheets dissolve and get absorbed into the glowing Plus, transforming into golden light streams (#C7A55A) feeding into an interactive digital CRM client portal mockup.
- Act V (90% - 100%): "The Direct Teleport & Instant Advisor Consultation" — floating resting anchor state with 2-second breathing cycle. Clicking the 3D sanctuary or CTA triggers an elegant frosted-glass consultation drawer connecting directly with a native-speaking advisor in the selected language.

### R3. Antigravity Controller & Event Telemetry
Clean reactive state controller exposing real-time telemetry on `window.SplineApp` / `window.AntigravityController`:
- `scrollProgress` (float: 0.0 to 1.0) driving camera and timeline interpolation.
- `activeLanguage` ('de' | 'ar' | 'en' | 'tr') triggering RTL layout mirror and text morph.
- `hoverTarget` ('energy' | 'health' | 'mobility' | 'telecom' | 'house') driving depth-of-field and focus lighting.
- `savingsValue` (number: 400 to 2500) driving pulse rhythm and gold emission intensity.

### R4. Programmatic Verification Suite
Automated build, lint, and verification harness:
- Automated Vite production build execution with zero TypeScript or packaging errors.
- ESLint / static syntax check.
- Verification script asserting presence of all 5 acts, 4-language RTL switching, Three.js canvas initialization, and event telemetry bindings.

## Acceptance Criteria

### Visual & Interactive Fidelity
- [ ] 3D House chassis, glowing Plus, and all 4 orbital satellites render with exact brand colors (#0F2D4A, #0F8A83, #C7A55A, #FAFAF7, #2D3748) and material properties.
- [ ] Mouse move tilts the 3D scene with smooth damping, and scroll smoothly moves the camera through Acts I to V.
- [ ] Switching language to Arabic mirrors the DOM to `dir="rtl"` and morphs 3D typography cleanly.
- [ ] Household members slider (1–6) updates the savings calculation and visual gold rim emission.
- [ ] Clicking the Act V CTA or House opens the native-speaking consultation drawer.

### Technical & Performance Standards
- [ ] Production build (`npm run build`) completes cleanly with zero errors or unresolved imports.
- [ ] `window.AntigravityController` or `window.SplineApp` correctly dispatches and responds to `scrollProgress`, `activeLanguage`, `hoverTarget`, and `savingsValue`.
- [ ] Scene geometry stays strictly below 55,000 triangles and renders without external blocking textures.
- [ ] Verification test suite passes all assertions.
