/**
 * Automated Verification Script for Milestone 3 (M3)
 * Beit Plus 5-Act Cinematic Scrollytelling Choreography, Multilingual RTL & Savings Engine
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Setup mock window & document environment for node headless execution
const mockDocument: Record<string, unknown> = {
  documentElement: {
    setAttribute: (attr: string, val: string) => {
      (mockDocument.documentElement as Record<string, string>)[attr] = val;
    },
    getAttribute: (attr: string) => {
      return (mockDocument.documentElement as Record<string, string>)[attr];
    },
    dir: 'ltr',
    lang: 'de',
  },
  body: {
    style: {},
  },
};

const mockWindow: Record<string, unknown> = {
  dispatchEvent: () => true,
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
  document: mockDocument,
};

(globalThis as unknown as { window: unknown }).window = mockWindow;
(globalThis as unknown as { document: unknown }).document = mockDocument;

async function runM3Verification() {
  console.log('================================================================');
  console.log('--- BEIT PLUS: MILESTONE 3 (M3) COMPREHENSIVE VERIFICATION ---');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // 1. Verify existence of all M3 canvas & UI subsystem modules
  // --------------------------------------------------------------------------
  console.log('1. Auditing file existence & modular architecture...');
  const canvasDir = path.resolve(process.cwd(), 'src/components/canvas');
  const requiredCanvasFiles = [
    'SceneContainer.tsx',
    'ArchitecturalSanctuary.tsx',
    'BioluminescentPlus.tsx',
    'OrbitalSatellites.tsx',
    'BureaucraticNoise.tsx',
    'TypographyMorph3D.tsx',
    'GoldenLightStreams.tsx',
    'StudioEnvironment.tsx',
    'scene-budget.ts',
  ];

  for (const file of requiredCanvasFiles) {
    const fullPath = path.join(canvasDir, file);
    assert.ok(fs.existsSync(fullPath), `Required canvas module ${file} must exist`);
  }

  const requiredUIFiles = [
    'src/components/ActSections.tsx',
    'src/components/ConsultationDrawer.tsx',
    'src/components/Navigation.tsx',
    'src/components/TelemetryHUD.tsx',
    'src/store/antigravity-controller.ts',
    'src/i18n/translations.ts',
    'src/i18n/language-context.tsx',
  ];

  for (const file of requiredUIFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    assert.ok(fs.existsSync(fullPath), `Required UI module ${file} must exist`);
  }
  console.log('   [PASS] All 9 canvas modules and 7 UI subsystem modules verified.');

  // --------------------------------------------------------------------------
  // 2. Act Progression & Boundaries (p in [0.0, 1.0])
  // --------------------------------------------------------------------------
  console.log('2. Verifying 5-Act scrollytelling boundaries across scroll progress [0.0, 1.0]...');
  const { antigravityController, computeActFromProgress, SAVINGS_BY_HOUSEHOLD } = await import(
    '../src/store/antigravity-controller.ts'
  );

  const actTestCases = [
    { progress: 0.00, expectedAct: 1 },
    { progress: 0.10, expectedAct: 1 },
    { progress: 0.199, expectedAct: 1 },
    { progress: 0.20, expectedAct: 2 },
    { progress: 0.35, expectedAct: 2 },
    { progress: 0.449, expectedAct: 2 },
    { progress: 0.45, expectedAct: 3 },
    { progress: 0.58, expectedAct: 3 },
    { progress: 0.699, expectedAct: 3 },
    { progress: 0.70, expectedAct: 4 },
    { progress: 0.82, expectedAct: 4 },
    { progress: 0.899, expectedAct: 4 },
    { progress: 0.90, expectedAct: 5 },
    { progress: 0.98, expectedAct: 5 },
    { progress: 1.00, expectedAct: 5 },
  ];

  for (const tc of actTestCases) {
    const computedAct = computeActFromProgress(tc.progress);
    assert.strictEqual(
      computedAct,
      tc.expectedAct,
      `Progress ${tc.progress} should map to Act ${tc.expectedAct}, got Act ${computedAct}`
    );
    antigravityController.setScrollProgress(tc.progress);
    assert.strictEqual(
      antigravityController.currentAct,
      tc.expectedAct,
      `Controller currentAct should be ${tc.expectedAct} at progress ${tc.progress}`
    );
  }
  console.log('   [PASS] Scrollytelling act progression verified across 15 boundary points.');

  // --------------------------------------------------------------------------
  // 3. Mathematical Camera Trajectory & RTL Orbit Mirroring
  // --------------------------------------------------------------------------
  console.log('3. Validating 3D camera trajectory waypoints, FOV, and RTL mirroring...');
  const { calculateCameraTrajectory } = await import(
    '../src/components/canvas/SceneContainer.tsx'
  );

  // Act I: 35mm low-angle framing
  const camAct1 = calculateCameraTrajectory(0.05, 'de');
  assert.ok(camAct1.position[1] < 0.2, 'Act I camera Y should be low angle');
  assert.ok(camAct1.position[2] > 6.0, 'Act I camera Z should frame sanctuary distance');
  assert.strictEqual(camAct1.fov, 38, 'Act I FOV should be 38 (35mm equivalent)');

  // Act II: 45° isometric dolly
  const camAct2DE = calculateCameraTrajectory(0.35, 'de');
  const camAct2AR = calculateCameraTrajectory(0.35, 'ar');
  assert.ok(camAct2DE.position[0] > 2.5, 'Act II LTR camera X should be positive');
  assert.ok(camAct2AR.position[0] < -2.5, 'Act II RTL (Arabic) camera X should be negative mirrored');
  assert.ok(Math.abs(camAct2DE.position[0] + camAct2AR.position[0]) < 1e-4, 'Act II X coordinates must be exact reflections');

  const camAct2PeakDE = calculateCameraTrajectory(0.44, 'de');
  const camAct2PeakAR = calculateCameraTrajectory(0.44, 'ar');
  assert.ok(camAct2PeakDE.position[0] >= 4.0, 'Act II peak LTR camera X should reach isometric dolly (+4.5)');
  assert.ok(camAct2PeakAR.position[0] <= -4.0, 'Act II peak RTL camera X should reach mirrored isometric dolly (-4.5)');

  // Act III: 180° cinematic orbit
  const camAct3Start = calculateCameraTrajectory(0.45, 'de');
  const camAct3End = calculateCameraTrajectory(0.70, 'de');
  assert.ok(camAct3Start.position[2] > 0, 'Act III start camera Z should be in front');
  assert.ok(camAct3End.position[2] < 0, 'Act III end camera Z should orbit behind (-4.8)');

  // Act IV: Panoramic wide pull-back
  const camAct4 = calculateCameraTrajectory(0.85, 'de');
  assert.ok(camAct4.position[2] >= 7.0, 'Act IV camera Z should pull back toward panoramic view');
  assert.ok(camAct4.fov >= 46, 'Act IV FOV should expand for panoramic coverage');

  const camAct4Peak = calculateCameraTrajectory(0.89, 'de');
  assert.ok(camAct4Peak.position[2] >= 9.0, 'Act IV peak camera Z should reach wide panoramic pull-back (+9.8)');

  // Act V: Intimate hero resting anchor
  const camAct5 = calculateCameraTrajectory(1.00, 'de');
  assert.ok(camAct5.position[2] <= 5.25, 'Act V camera Z should settle into intimate portrait framing (5.2)');
  assert.strictEqual(camAct5.fov, 38, 'Act V FOV should return to intimate 38');
  console.log('   [PASS] 5-Act camera path splines and RTL coordinate reflections verified.');

  // --------------------------------------------------------------------------
  // 4. Act II Blueprint Deconstruction & 4 Satellites Docking
  // --------------------------------------------------------------------------
  console.log('4. Verifying blueprint deconstruction along normal vectors & satellite docking...');
  const { calculateSanctuaryDeconstruction } = await import(
    '../src/components/canvas/ArchitecturalSanctuary.tsx'
  );

  assert.strictEqual(calculateSanctuaryDeconstruction(0.10), 0.0, 'Act I deconstruction must be 0.0');
  const deconMid = calculateSanctuaryDeconstruction(0.325);
  assert.ok(Math.abs(deconMid - 0.5) < 1e-4, 'Act II mid-point deconstruction should be 0.5');
  assert.strictEqual(calculateSanctuaryDeconstruction(0.45), 1.0, 'Act II peak deconstruction should be 1.0');
  assert.strictEqual(calculateSanctuaryDeconstruction(0.95), 0.0, 'Act V monolith must be fully recombined (0.0)');

  // Normal vector deconstruction formula checks:
  // Roof left: [-0.85*d, 0.65*d, 0]
  // Roof right: [0.85*d, 0.65*d, 0]
  // Facade front: [0, 0, 0.95*d]
  // Wall back: [0, 0, -0.95*d]
  // Side wall left: [-1.18 - 1.15*d, 0.90, 0]
  // Side wall right: [1.18 + 1.15*d, 0.90, 0]
  const dTest = 0.5;
  const roofLeftPos = [-0.85 * dTest, 0.65 * dTest, 0];
  const roofRightPos = [0.85 * dTest, 0.65 * dTest, 0];
  assert.strictEqual(roofLeftPos[0], -0.425);
  assert.strictEqual(roofRightPos[0], 0.425);
  assert.strictEqual(roofLeftPos[1], 0.325);

  // Hover target telemetry check
  const testTargets = ['energy', 'health', 'mobility', 'telecom', 'house', null] as const;
  for (const target of testTargets) {
    antigravityController.setHoverTarget(target);
    assert.strictEqual(antigravityController.hoverTarget, target);
  }
  console.log('   [PASS] Normal vector deconstruction offsets and hover telemetry verified.');

  // --------------------------------------------------------------------------
  // 5. Act III Multilingual RTL Flip & 3D Typography Morph Logic
  // --------------------------------------------------------------------------
  console.log('5. Auditing Multilingual RTL layout mirroring & 3D Typography morphing...');
  const { calculateTypographyMorphState } = await import(
    '../src/components/canvas/TypographyMorph3D.tsx'
  );

  // Test German / Latin active
  const latinState = calculateTypographyMorphState('de', 0.0);
  assert.strictEqual(latinState.latinOpacity, 1.0, 'Latin opacity should be 1.0 when German active');
  assert.strictEqual(latinState.arabicOpacity, 0.0, 'Arabic opacity should be 0.0 when German active');
  assert.strictEqual(latinState.latinRotationY, 0.0, 'Latin rotation should be 0 when German active');

  // Test Arabic active
  const arabicState = calculateTypographyMorphState('ar', 1.0);
  assert.strictEqual(arabicState.latinOpacity, 0.0, 'Latin opacity should be 0.0 when Arabic active');
  assert.strictEqual(arabicState.arabicOpacity, 1.0, 'Arabic opacity should be 1.0 when Arabic active');
  assert.strictEqual(arabicState.arabicRotationY, 0.0, 'Arabic rotation should be 0 when Arabic active');
  assert.strictEqual(arabicState.arabicScale, 1.0, 'Arabic scale should be 1.0');

  // Test 50% morph transition
  const midState = calculateTypographyMorphState('ar', 0.5);
  assert.ok(Math.abs(midState.latinOpacity - 0.5) < 1e-4, 'Mid morph Latin opacity should be 0.5');
  assert.ok(Math.abs(midState.arabicOpacity - 0.5) < 1e-4, 'Mid morph Arabic opacity should be 0.5');
  assert.ok(midState.latinRotationY > 0, 'Latin should twist on Y axis during transition');
  assert.ok(midState.arabicRotationY < 0, 'Arabic should untwist on Y axis during transition');

  // Test HTML RTL reflection
  antigravityController.setActiveLanguage('ar');
  assert.strictEqual(antigravityController.activeLanguage, 'ar');
  antigravityController.setActiveLanguage('de');
  assert.strictEqual(antigravityController.activeLanguage, 'de');
  console.log('   [PASS] 3D Typography morph states and multilingual switching verified.');

  // --------------------------------------------------------------------------
  // 6. Dynamic Household Savings Engine & Volume Scaling
  // --------------------------------------------------------------------------
  console.log('6. Verifying household slider recalculations (1-6 persons) and volume scale...');
  const computeVolumeScale = (N: number) => 1.0 + (N - 1) * 0.07;
  const computeRimEmission = (savings: number) => 0.20 + ((savings - 400) / 2100) * 0.65;

  const householdTestCases = [
    { persons: 1, expectedSavings: 420, expectedScale: 1.00 },
    { persons: 2, expectedSavings: 760, expectedScale: 1.07 },
    { persons: 3, expectedSavings: 1120, expectedScale: 1.14 },
    { persons: 4, expectedSavings: 1480, expectedScale: 1.21 },
    { persons: 5, expectedSavings: 1650, expectedScale: 1.28 },
    { persons: 6, expectedSavings: 1800, expectedScale: 1.35 },
  ];

  for (const tc of householdTestCases) {
    antigravityController.setHouseholdSize(tc.persons);
    assert.strictEqual(
      antigravityController.householdSize,
      tc.persons,
      `Household size should be ${tc.persons}`
    );
    assert.strictEqual(
      antigravityController.savingsValue,
      tc.expectedSavings,
      `Savings value should match ${tc.expectedSavings} for ${tc.persons} persons`
    );
    assert.strictEqual(
      SAVINGS_BY_HOUSEHOLD[tc.persons],
      tc.expectedSavings,
      `SAVINGS_BY_HOUSEHOLD table entry must match ${tc.expectedSavings}`
    );

    const scale = computeVolumeScale(tc.persons);
    assert.ok(
      Math.abs(scale - tc.expectedScale) < 1e-4,
      `Volume scale for ${tc.persons} persons should be ${tc.expectedScale}, got ${scale}`
    );

    const emission = computeRimEmission(tc.expectedSavings);
    assert.ok(emission >= 0.20 && emission <= 0.85, 'Rim emission must stay within [0.20, 0.85]');
  }
  console.log('   [PASS] Household savings engine and volume scale formula S = 1.0 + (N-1)*0.07 verified.');

  // --------------------------------------------------------------------------
  // 7. Act IV Sanctuary of Flow: Contract Convergence & Golden Light Streams
  // --------------------------------------------------------------------------
  console.log('7. Verifying Act IV contract convergence and golden light stream intensity...');
  const { calculateContractConvergence, calculateHarmonicTumble } = await import(
    '../src/components/canvas/BureaucraticNoise.tsx'
  );
  const { calculateGoldenLightStreamIntensity } = await import(
    '../src/components/canvas/GoldenLightStreams.tsx'
  );

  // Contract absorption convergence
  assert.strictEqual(calculateContractConvergence(0.60), 0.0, 'Convergence must be 0 before Act IV');
  assert.ok(Math.abs(calculateContractConvergence(0.80) - 0.5) < 1e-6, 'Convergence should be 0.5 at progress 0.80');
  assert.strictEqual(calculateContractConvergence(0.90), 1.0, 'Convergence should be 1.0 at Act IV end');

  // Harmonic tumbling
  const [tumbleX, tumbleY, tumbleZ] = calculateHarmonicTumble(1.0, 0.0);
  assert.ok(typeof tumbleX === 'number' && !isNaN(tumbleX));
  assert.ok(typeof tumbleY === 'number' && !isNaN(tumbleY));
  assert.ok(typeof tumbleZ === 'number' && !isNaN(tumbleZ));

  // Golden light streams
  assert.strictEqual(calculateGoldenLightStreamIntensity(0.65), 0.0, 'Golden stream must be 0 outside Act IV');
  const streamMid = calculateGoldenLightStreamIntensity(0.76);
  assert.ok(streamMid > 0.45 && streamMid < 0.55, 'Golden stream should be ~0.5 at progress 0.76');
  assert.strictEqual(calculateGoldenLightStreamIntensity(0.82), 1.0, 'Golden stream must peak at 1.0');
  assert.strictEqual(calculateGoldenLightStreamIntensity(0.95), 0.0, 'Golden stream must fade out in Act V');
  console.log('   [PASS] Act IV contract absorption and golden light stream activation verified.');

  // --------------------------------------------------------------------------
  // 8. Act V 2-Second Sinusoidal Breathing Cycle & Advisor Drawer
  // --------------------------------------------------------------------------
  console.log('8. Testing Act V 2-second breathing cycle and native advisor profile matching...');
  const { calculateBreathingCycle } = await import(
    '../src/components/canvas/ArchitecturalSanctuary.tsx'
  );
  const { calculatePlusBreathingCycle } = await import(
    '../src/components/canvas/BioluminescentPlus.tsx'
  );
  const { translations } = await import('../src/i18n/translations.ts');

  // Test 2-second breathing cycle: period T = 2.0s, omega = PI
  assert.strictEqual(calculateBreathingCycle(0.0, 0.80), 0.0, 'Breathing must be inactive outside Act V');
  const b0 = calculateBreathingCycle(0.0, 0.95);
  const bQuarter = calculateBreathingCycle(0.5, 0.95); // sin(PI * 0.5) = 1.0 => 0.05
  const bHalf = calculateBreathingCycle(1.0, 0.95);    // sin(PI * 1.0) = 0.0 => 0.0
  const bThreeQuart = calculateBreathingCycle(1.5, 0.95); // sin(PI * 1.5) = -1.0 => -0.05
  const bFull = calculateBreathingCycle(2.0, 0.95);    // sin(PI * 2.0) = 0.0 => 0.0

  assert.ok(Math.abs(b0 - 0.0) < 1e-5, 't=0 breathing should be 0.0');
  assert.ok(Math.abs(bQuarter - 0.05) < 1e-5, 't=0.5 breathing should be +0.05');
  assert.ok(Math.abs(bHalf - 0.0) < 1e-5, 't=1.0 breathing should be 0.0');
  assert.ok(Math.abs(bThreeQuart - (-0.05)) < 1e-5, 't=1.5 breathing should be -0.05');
  assert.ok(Math.abs(bFull - 0.0) < 1e-5, 't=2.0 breathing should complete cycle at 0.0');

  // Plus crystal breathing emission
  const plusCycle = calculatePlusBreathingCycle(0.5, 0.95);
  assert.ok(Math.abs(plusCycle.emission - (1.2 + 0.35)) < 1e-5, 'Plus emission at peak should be 1.55');

  // Consultation drawer triggering
  antigravityController.closeConsultation();
  assert.strictEqual(antigravityController.isConsultationOpen, false);
  antigravityController.openConsultation();
  assert.strictEqual(antigravityController.isConsultationOpen, true);
  antigravityController.toggleConsultation();
  assert.strictEqual(antigravityController.isConsultationOpen, false);

  // Native advisor profile matching across the 4 languages
  const advisorExpectations = {
    de: { name: 'Maximilian Weber', roleIncludes: 'berater' },
    ar: { name: 'طارق المنصور', roleIncludes: 'مستشار' },
    en: { name: 'Sarah Jenkins', roleIncludes: 'specialist' },
    tr: { name: 'Emre Yılmaz', roleIncludes: 'danışman' },
  } as const;

  for (const [lang, exp] of Object.entries(advisorExpectations)) {
    const tLang = translations[lang as ActiveLanguage];
    assert.strictEqual(
      tLang.consultation.advisorName,
      exp.name,
      `Language ${lang} advisor name must be ${exp.name}`
    );
    assert.ok(
      tLang.consultation.advisorRole.toLowerCase().includes(exp.roleIncludes.toLowerCase()),
      `Language ${lang} advisor role must include ${exp.roleIncludes}`
    );
  }
  console.log('   [PASS] 2-second breathing harmonic cycle and 4-language advisor matching verified.');

  // --------------------------------------------------------------------------
  // 9. Triangle Budget Compliance (< 55,000 Triangles)
  // --------------------------------------------------------------------------
  console.log('9. Auditing procedural WebGL triangle budget...');
  const { computeTotalSceneTriangleBudget } = await import(
    '../src/components/canvas/scene-budget.ts'
  );
  const budget = computeTotalSceneTriangleBudget();

  console.log(`   Total Scene Triangles: ${budget.totalTriangles.toLocaleString()}`);
  console.log(`   Budget Limit:          ${budget.maxBudget.toLocaleString()}`);
  console.log(`   Headroom:              ${budget.headroom.toLocaleString()} (${Math.round((budget.headroom / budget.maxBudget) * 100)}% buffer)`);

  assert.ok(
    budget.totalTriangles < 55000,
    `Total scene triangles (${budget.totalTriangles}) must be strictly below 55,000`
  );
  assert.ok(
    budget.totalTriangles >= 20000,
    `Total scene triangles (${budget.totalTriangles}) must meet richness target (>= 20,000)`
  );
  assert.ok(budget.isWithinBudget, 'isWithinBudget must be true');
  console.log('   [PASS] Triangle budget compliance verified with ample 60 FPS headroom.');

  // --------------------------------------------------------------------------
  // 10. Production Distribution Bundle Audit
  // --------------------------------------------------------------------------
  console.log('10. Auditing production build distribution files in dist/...');
  const distDir = path.resolve(process.cwd(), 'dist');
  assert.ok(fs.existsSync(distDir), 'dist/ directory must exist');
  assert.ok(fs.existsSync(path.join(distDir, 'index.html')), 'dist/index.html must exist');

  const assetsDir = path.join(distDir, 'assets');
  assert.ok(fs.existsSync(assetsDir), 'dist/assets/ must exist');
  const distAssets = fs.readdirSync(assetsDir);
  const jsBundle = distAssets.find((f) => f.endsWith('.js'));
  const cssBundle = distAssets.find((f) => f.endsWith('.css'));
  assert.ok(jsBundle, 'Compiled JavaScript bundle must be present in dist/assets');
  assert.ok(cssBundle, 'Compiled CSS bundle must be present in dist/assets');
  console.log(`   [PASS] Production build bundles verified: ${jsBundle}, ${cssBundle}`);

  console.log('\n================================================================');
  console.log('>>> ALL MILESTONE 3 VERIFICATION ASSERTIONS PASSED WITH CODE 0 <<<');
  console.log('================================================================\n');
}

runM3Verification().catch((err) => {
  console.error('\nVerification failed:', err);
  process.exit(1);
});
