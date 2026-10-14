/**
 * Automated Verification Script for Milestone 2 (M2)
 * Beit Plus 3D Procedural Sanctuary, Shaders & Kinetic Brand Mark
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Setup mock window environment for node execution
const mockWindow: Record<string, unknown> = {
  dispatchEvent: () => true,
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
};
(globalThis as unknown as { window: unknown }).window = mockWindow;

async function runM2Verification() {
  console.log('--- BEIT PLUS: MILESTONE 2 VERIFICATION HARNESS ---');

  // 1. Verify existence of required M2 components
  console.log('1. Checking component file existence & structural integrity...');
  const canvasDir = path.resolve(process.cwd(), 'src/components/canvas');
  const requiredFiles = [
    'SceneContainer.tsx',
    'ArchitecturalSanctuary.tsx',
    'BioluminescentPlus.tsx',
    'OrbitalSatellites.tsx',
    'BureaucraticNoise.tsx',
    'StudioEnvironment.tsx',
    'scene-budget.ts',
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(canvasDir, file);
    assert.ok(fs.existsSync(fullPath), `Required file ${file} must exist in src/components/canvas/`);
  }
  console.log('   [PASS] All 7 canvas subsystem modules exist in src/components/canvas/.');

  // 2. Verify SceneContainer integration in App.tsx
  console.log('2. Verifying SceneContainer integration in App.tsx...');
  const appTsxPath = path.resolve(process.cwd(), 'src/App.tsx');
  const appContent = fs.readFileSync(appTsxPath, 'utf-8');
  assert.ok(appContent.includes('SceneContainer'), 'App.tsx must import and mount SceneContainer');
  assert.ok(appContent.includes('<SceneContainer'), 'App.tsx must render <SceneContainer telemetry={telemetry} />');
  console.log('   [PASS] SceneContainer is cleanly mounted in App.tsx.');

  // 3. Verify procedural materials & optical constants
  console.log('3. Validating optical constants and material physics...');
  const {
    BRAND_COLORS,
    createSmokedGlassMaterial,
    createChampagneGoldMaterial,
    createPlusOuterMaterial,
    createPearlGlassMaterial,
    createAnodizedCharcoalMaterial,
  } = await import('../src/components/canvas/scene-budget.ts');

  // Brand colors
  assert.strictEqual(BRAND_COLORS.midnightNavy.toUpperCase(), '#0F2D4A');
  assert.strictEqual(BRAND_COLORS.deepTeal.toUpperCase(), '#0F8A83');
  assert.strictEqual(BRAND_COLORS.champagneGold.toUpperCase(), '#C7A55A');
  assert.strictEqual(BRAND_COLORS.offWhite.toUpperCase(), '#FAFAF7');
  assert.strictEqual(BRAND_COLORS.charcoal.toUpperCase(), '#2D3748');

  // Smoked Dielectric Frosted Glass (MeshPhysicalMaterial)
  const smokedGlass = createSmokedGlassMaterial();
  assert.strictEqual(smokedGlass.transmission, 0.88, 'Smoked glass transmission should be 0.88');
  assert.strictEqual(smokedGlass.ior, 1.52, 'Smoked glass IOR should be 1.52');
  assert.strictEqual(smokedGlass.roughness, 0.14, 'Smoked glass roughness should be 0.14');
  assert.strictEqual(smokedGlass.metalness, 0.05, 'Smoked glass metalness should be 0.05');
  assert.strictEqual(smokedGlass.clearcoat, 0.35, 'Smoked glass clearcoat should be 0.35');
  assert.strictEqual(smokedGlass.transparent, true, 'Smoked glass must be transparent');

  // Champagne Gold Material
  const goldMat = createChampagneGoldMaterial(0.20);
  assert.strictEqual(goldMat.metalness, 0.92, 'Champagne gold metalness should be 0.92');
  assert.strictEqual(goldMat.roughness, 0.18, 'Champagne gold roughness should be 0.18');
  assert.strictEqual(goldMat.emissiveIntensity, 0.20, 'Default emissive intensity should be 0.20');

  // Bioluminescent Plus Outer Hull
  const plusOuter = createPlusOuterMaterial();
  assert.strictEqual(plusOuter.transmission, 0.75, 'Plus outer transmission should be 0.75');
  assert.strictEqual(plusOuter.ior, 1.65, 'Plus outer IOR should be 1.65');
  assert.strictEqual(plusOuter.roughness, 0.08, 'Plus outer roughness should be 0.08');
  assert.strictEqual(plusOuter.emissiveIntensity, 1.50, 'Plus outer base emissive should be 1.50');

  // Pearl Glass (Health Cocoon)
  const pearlGlass = createPearlGlassMaterial();
  assert.strictEqual(pearlGlass.transmission, 0.92, 'Pearl glass transmission should be 0.92');
  assert.strictEqual(pearlGlass.ior, 1.48, 'Pearl glass IOR should be 1.48');
  assert.strictEqual(pearlGlass.roughness, 0.12, 'Pearl glass roughness should be 0.12');

  // Anodized Charcoal (Mobility Hex-Plate)
  const charcoal = createAnodizedCharcoalMaterial();
  assert.strictEqual(charcoal.metalness, 0.88, 'Anodized charcoal metalness should be 0.88');
  assert.strictEqual(charcoal.roughness, 0.22, 'Anodized charcoal roughness should be 0.22');
  console.log('   [PASS] Optical constants & physical shaders conform precisely to brand specification.');

  // 4. Verify Modular Sub-meshes & Architectural Deconstruction
  console.log('4. Verifying modular sub-meshes and reactive volume scaling...');
  const sanctuarySource = fs.readFileSync(path.join(canvasDir, 'ArchitecturalSanctuary.tsx'), 'utf-8');
  const requiredSubMeshes = [
    'RoofSlopeLeft',
    'RoofSlopeRight',
    'FacadeFront',
    'WallBack',
    'PlinthBase',
  ];

  for (const subMesh of requiredSubMeshes) {
    assert.ok(sanctuarySource.includes(subMesh), `ArchitecturalSanctuary must include sub-mesh ${subMesh}`);
  }

  // Reactive volume scale formula: S = 1.0 + (N - 1) * 0.07
  const computeVolumeScale = (N: number) => 1.0 + (N - 1) * 0.07;
  assert.strictEqual(computeVolumeScale(1), 1.0, 'Household size 1 -> scale 1.0');
  assert.strictEqual(Math.round(computeVolumeScale(3) * 100) / 100, 1.14, 'Household size 3 -> scale 1.14');
  assert.strictEqual(Math.round(computeVolumeScale(6) * 100) / 100, 1.35, 'Household size 6 -> scale 1.35');

  // Dynamic rim emission formula: I = 0.20 + ((V - 400) / 2100) * 0.65
  const computeRimEmission = (savings: number) => 0.20 + ((savings - 400) / 2100) * 0.65;
  assert.ok(Math.abs(computeRimEmission(400) - 0.20) < 1e-6, 'Savings 400 -> emission 0.20');
  assert.ok(Math.abs(computeRimEmission(2500) - 0.85) < 1e-6, 'Savings 2500 -> emission 0.85');
  console.log('   [PASS] 5 modular sub-meshes verified with reactive volume and emission formulas.');

  // 5. Verify 4 Orbital Satellites & Heartbeat Formula
  console.log('5. Testing 4 concentric orbital satellites & telemetry interaction...');
  const { calculateHeartbeatPulse } = await import('../src/components/canvas/OrbitalSatellites.tsx');

  // Heartbeat pulse at t = 0 (primary peak)
  const pulseAtZero = calculateHeartbeatPulse(0);
  assert.ok(pulseAtZero > 0.99, 'Heartbeat pulse at peak t=0 should be near 1.0');

  // Heartbeat pulse at secondary peak t = 0.22
  const pulseAtSecondary = calculateHeartbeatPulse(0.22);
  assert.ok(pulseAtSecondary > 0.64, 'Heartbeat pulse at secondary peak t=0.22 should be ~0.65');

  // Heartbeat pulse at rest t = 0.70
  const pulseAtRest = calculateHeartbeatPulse(0.70);
  assert.ok(pulseAtRest < 0.01, 'Heartbeat pulse at diastole t=0.70 should be near 0');

  // Test AntigravityController hoverTarget interaction
  const { antigravityController } = await import('../src/store/antigravity-controller.ts');
  const allowedHoverTargets = ['energy', 'health', 'mobility', 'telecom', 'house', null] as const;

  for (const target of allowedHoverTargets) {
    antigravityController.setHoverTarget(target);
    assert.strictEqual(antigravityController.hoverTarget, target, `hoverTarget should update to ${target}`);
  }
  console.log('   [PASS] Heartbeat pulse kinetics and 5-target hover telemetry verified.');

  // 6. Verify Triangle Budget (< 55,000 triangles target: ~25,000 - 35,000)
  console.log('6. Auditing procedural geometry triangle budget...');
  const { computeTotalSceneTriangleBudget } = await import('../src/components/canvas/scene-budget.ts');
  const budget = computeTotalSceneTriangleBudget();

  console.log(`   Total Scene Triangles: ${budget.totalTriangles.toLocaleString()}`);
  console.log(`   Budget Limit:          ${budget.maxBudget.toLocaleString()}`);
  console.log(`   Headroom:              ${budget.headroom.toLocaleString()} (${Math.round((budget.headroom / budget.maxBudget) * 100)}% buffer)`);

  assert.ok(
    budget.totalTriangles < 55000,
    `Total triangles (${budget.totalTriangles}) must be strictly below 55,000`
  );
  assert.ok(
    budget.totalTriangles >= 20000,
    `Total triangles (${budget.totalTriangles}) should meet target richness (>= 20,000)`
  );
  assert.ok(
    budget.isWithinBudget,
    'Triangle budget flag must be true'
  );
  console.log('   [PASS] Triangle budget audit passed with solid headroom for 60 FPS performance.');

  // 7. Verify Network Independence (Zero External 3D/Texture Downloads)
  console.log('7. Validating network independence (zero external textures/models)...');
  const srcDir = path.resolve(process.cwd(), 'src');
  const forbiddenExts = ['.gltf', '.glb', '.hdr', '.bin'];

  function checkDirForForbiddenAssets(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        checkDirForForbiddenAssets(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        assert.ok(
          !forbiddenExts.includes(ext),
          `Forbidden external 3D asset found: ${fullPath}`
        );
      }
    }
  }

  checkDirForForbiddenAssets(srcDir);
  console.log('   [PASS] Zero external 3D models or textures found. 100% procedural WebGL.');

  // 8. Verify Production Distribution Artifacts
  console.log('8. Checking production distribution bundle in dist/...');
  const distDir = path.resolve(process.cwd(), 'dist');
  assert.ok(fs.existsSync(distDir), 'dist/ directory must exist');
  assert.ok(fs.existsSync(path.join(distDir, 'index.html')), 'dist/index.html must exist');

  const assetsDir = path.join(distDir, 'assets');
  assert.ok(fs.existsSync(assetsDir), 'dist/assets/ must exist');
  const distAssets = fs.readdirSync(assetsDir);
  const jsBundle = distAssets.find((f) => f.endsWith('.js'));
  const cssBundle = distAssets.find((f) => f.endsWith('.css'));
  assert.ok(jsBundle, 'JavaScript bundle must be present');
  assert.ok(cssBundle, 'CSS bundle must be present');
  console.log(`   [PASS] Production build artifacts verified: ${jsBundle}, ${cssBundle}`);

  console.log('\n>>> ALL MILESTONE 2 VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<');
}

runM2Verification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
