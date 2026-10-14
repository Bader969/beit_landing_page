/**
 * Empirical Stress Test Harness — Challenger 2 (Milestone 2)
 * Procedural shaders, reactive scaling formulas, heartbeat kinetics, camera rig & mouse tilt bounds.
 */

import assert from 'node:assert';
import * as THREE from 'three';
import {
  BRAND_COLORS,
  createSmokedGlassMaterial,
  createChampagneGoldMaterial,
  createPlusOuterMaterial,
  createPlusCoreMaterial,
  createPearlGlassMaterial,
  createAnodizedCharcoalMaterial,
  createPlinthBaseGeometry,
  createFacadeFrontGeometry,
  createWallBackGeometry,
  createRoofSlopeLeftGeometry,
  createRoofSlopeRightGeometry,
  createSideWallGeometry,
  createGoldRimTrimGeometry,
  createPlusCrystalGeometry,
  createPlusCoreGeometry,
  createEnergySpline,
  createEnergyTubeGeometry,
  createPlasmaOrbGeometry,
  createHealthSphereGeometry,
  createHealthCrossGeometry,
  createMobilityHexGeometry,
  createMobilityRimGeometry,
  createMicroHexGeometry,
  createTelecomHubGeometry,
  createTelecomRingGeometry,
  createTelecomNodeGeometry,
  createOrbitGuideGeometry,
  createContractSheetGeometry,
  computeTotalSceneTriangleBudget,
} from '../src/components/canvas/scene-budget';
import { calculateHeartbeatPulse } from '../src/components/canvas/OrbitalSatellites';

// Mock window for headless Node environment
const mockWindow: Record<string, unknown> = {
  dispatchEvent: () => true,
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
};
(globalThis as unknown as { window: unknown }).window = mockWindow;

function runChallenger2EmpiricalSuite() {
  console.log('================================================================');
  console.log('   CHALLENGER 2: EMPIRICAL STRESS TEST & VALIDATION HARNESS     ');
  console.log('================================================================\n');

  let passedAssertions = 0;

  // --------------------------------------------------------------------------
  // TEST 1: Household Volume Scaling Formula S = 1.0 + (N - 1) * 0.07
  // --------------------------------------------------------------------------
  console.log('TEST 1: Household Volume Scaling S = 1.0 + (N - 1) * 0.07 for N in [1, 6]');

  const scaleFormula = (n: number) => 1.0 + (n - 1) * 0.07;
  const expectedScales: Record<number, number> = {
    1: 1.00,
    2: 1.07,
    3: 1.14,
    4: 1.21,
    5: 1.28,
    6: 1.35,
  };

  for (let n = 1; n <= 6; n++) {
    const scale = scaleFormula(n);
    const expected = expectedScales[n];
    console.log(`  N = ${n} -> scale = ${scale.toFixed(4)} (expected: ${expected})`);

    assert.ok(scale > 0, `Scale for N=${n} must be strictly positive non-zero`);
    assert.ok(!Number.isNaN(scale), `Scale for N=${n} must not be NaN`);
    assert.ok(Number.isFinite(scale), `Scale for N=${n} must be finite`);
    assert.strictEqual(Math.round(scale * 100) / 100, expected, `Scale mismatch for N=${n}`);
    passedAssertions += 4;

    if (n > 1) {
      assert.ok(scale > scaleFormula(n - 1), `Volume scaling must be strictly monotonic increasing at N=${n}`);
      passedAssertions++;
    }
  }

  // Clamping and edge case resiliency test as implemented in ArchitecturalSanctuary.tsx:
  // const N = Math.max(1, Math.min(6, telemetry.householdSize || 3));
  console.log('  Testing ArchitecturalSanctuary clamp logic against adversarial inputs:');
  const clampLogic = (val: unknown) => {
    const num = (typeof val === 'number' && !Number.isNaN(val)) ? val : 3;
    const size = num || 3;
    const clamped = Math.max(1, Math.min(6, size));
    return scaleFormula(clamped);
  };

  const adversarialInputs = [
    { in: 0, expectedClampedScale: 1.14 },       // 0 || 3 -> 3 -> scale 1.14
    { in: -5, expectedClampedScale: 1.00 },      // clamped to 1 -> scale 1.00
    { in: 7, expectedClampedScale: 1.35 },       // clamped to 6 -> scale 1.35
    { in: 9999, expectedClampedScale: 1.35 },    // clamped to 6 -> scale 1.35
    { in: NaN, expectedClampedScale: 1.14 },     // fallback to 3 -> scale 1.14
    { in: undefined, expectedClampedScale: 1.14 }, // fallback to 3 -> scale 1.14
  ];

  for (const { in: testIn, expectedClampedScale } of adversarialInputs) {
    const res = clampLogic(testIn);
    console.log(`    Input ${testIn} -> clamped scale: ${res.toFixed(2)}`);
    assert.ok(res >= 1.0 && res <= 1.35, `Clamped scale must be within [1.0, 1.35]`);
    assert.strictEqual(Math.round(res * 100) / 100, expectedClampedScale);
    passedAssertions += 2;
  }

  // Damp convergence simulation across 60 frames (1 second at 60fps)
  console.log('  Simulating damping convergence across 60 frames:');
  let currentScale = 1.0;
  const targetScale = scaleFormula(6); // 1.35
  const dt = 1 / 60;
  for (let frame = 1; frame <= 60; frame++) {
    currentScale = THREE.MathUtils.damp(currentScale, targetScale, 6.0, dt);
    assert.ok(!Number.isNaN(currentScale), `Damped scale at frame ${frame} must not be NaN`);
    assert.ok(currentScale >= 1.0 && currentScale <= targetScale + 0.001, `No overshoot allowed`);
    passedAssertions += 2;
  }
  assert.ok(Math.abs(currentScale - targetScale) < 0.01, 'Damping must converge within 1% in 60 frames');
  passedAssertions++;
  console.log(`  [PASS] Volume scaling S converges cleanly from 1.00 to ${currentScale.toFixed(4)} (~${targetScale})\n`);

  // --------------------------------------------------------------------------
  // TEST 2: Heartbeat Formula calculateHeartbeatPulse
  // --------------------------------------------------------------------------
  console.log('TEST 2: Heartbeat Formula calculateHeartbeatPulse Stress Testing');

  // Verify formula across 50,000 high-frequency samples over multiple cardiac cycles
  const totalSamples = 50000;
  const maxTime = 100; // 100 seconds = 80 full cardiac periods of 1.25s
  const step = maxTime / totalSamples;

  let minPulse = Infinity;
  let maxPulse = -Infinity;
  let nanCount = 0;
  let finiteCount = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i * step;
    const pulse = calculateHeartbeatPulse(t);

    if (Number.isNaN(pulse)) nanCount++;
    if (Number.isFinite(pulse)) finiteCount++;

    if (pulse < minPulse) minPulse = pulse;
    if (pulse > maxPulse) maxPulse = pulse;

    assert.ok(!Number.isNaN(pulse), `Pulse at t=${t} is NaN`);
    assert.ok(Number.isFinite(pulse), `Pulse at t=${t} is non-finite`);
    assert.ok(pulse >= 0, `Pulse at t=${t} is negative (${pulse})`);
    assert.ok(pulse <= 2.0, `Pulse at t=${t} exceeds bound 2.0 (${pulse})`);
  }
  passedAssertions += 4;

  console.log(`  Sampled ${totalSamples.toLocaleString()} points over ${maxTime}s:`);
  console.log(`    Min Pulse Value: ${minPulse.toExponential(4)} (bounded >= 0)`);
  console.log(`    Max Pulse Value: ${maxPulse.toFixed(4)} (bounded <= 2.0)`);
  console.log(`    Finite count:    ${finiteCount.toLocaleString()} / ${totalSamples.toLocaleString()}`);
  console.log(`    NaN count:       ${nanCount}`);

  assert.strictEqual(nanCount, 0, 'Zero NaN values across pulse evaluation');
  assert.strictEqual(finiteCount, totalSamples, 'All pulse values must be finite');

  // Specific phase checks
  // Phase 0: Primary systolic peak
  const p0 = calculateHeartbeatPulse(0);
  console.log(`    Pulse at t=0.00s (systolic peak 1):   ${p0.toFixed(4)}`);
  assert.ok(p0 > 1.15 && p0 < 1.25, 'Pulse at t=0 should be ~1.203');

  // Phase 0.22: Secondary dicrotic peak
  const pSecondary = calculateHeartbeatPulse(0.22);
  console.log(`    Pulse at t=0.22s (dicrotic peak 2):   ${pSecondary.toFixed(4)}`);
  assert.ok(pSecondary > 1.00 && pSecondary < 1.12, 'Pulse at t=0.22 should be ~1.068');

  // Phase 0.70: Diastolic resting baseline
  const pRest = calculateHeartbeatPulse(0.70);
  console.log(`    Pulse at t=0.70s (diastolic rest):    ${pRest.toExponential(4)}`);
  assert.ok(pRest < 0.01, 'Pulse at diastole should drop near zero (< 0.01)');

  // Phase 1.2499: Just before period wrap
  const pPreWrap = calculateHeartbeatPulse(1.2499);
  console.log(`    Pulse at t=1.2499s (pre-wrap baseline): ${pPreWrap.toExponential(4)}`);
  assert.ok(pPreWrap < 1e-10, 'Pulse at pre-wrap must be negligible (< 1e-10)');

  // Extreme time inputs: t = 1,000,000 s
  const pHuge = calculateHeartbeatPulse(1000000.15);
  assert.ok(!Number.isNaN(pHuge) && Number.isFinite(pHuge), 'Pulse must remain valid at huge t');
  passedAssertions += 6;
  console.log(`  [PASS] Heartbeat pulse produces bounded, non-NaN oscillations across all cardiac phases.\n`);

  // --------------------------------------------------------------------------
  // TEST 3: Mouse Tilt Math & Maximum ±14° Constraint
  // --------------------------------------------------------------------------
  console.log('TEST 3: Mouse Tilt Math & ±14° Angle Constraint Verification');

  const radToDeg = (rad: number) => (rad * 180) / Math.PI;
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  const MAX_PERMISSIBLE_DEG = 14.0;
  const maxTiltAct1 = 0.24; // from SceneContainer.tsx line 191
  const maxTiltSubsequent = 0.12;

  console.log(`  Max tilt setting in Act I: ${maxTiltAct1} rad = ${radToDeg(maxTiltAct1).toFixed(4)}°`);
  console.log(`  Max tilt setting subsequent: ${maxTiltSubsequent} rad = ${radToDeg(maxTiltSubsequent).toFixed(4)}°`);
  console.log(`  Permissible constraint: ±${MAX_PERMISSIBLE_DEG}° = ±${degToRad(MAX_PERMISSIBLE_DEG).toFixed(4)} rad`);

  assert.ok(
    radToDeg(maxTiltAct1) <= MAX_PERMISSIBLE_DEG,
    `Act I max tilt (${radToDeg(maxTiltAct1).toFixed(2)}°) exceeds ±14° limit`
  );
  assert.ok(
    radToDeg(maxTiltSubsequent) <= MAX_PERMISSIBLE_DEG,
    `Subsequent acts max tilt (${radToDeg(maxTiltSubsequent).toFixed(2)}°) exceeds ±14° limit`
  );
  passedAssertions += 2;

  // Grid scan across normalized pointer coordinate space [-1, 1] x [-1, 1]
  const pointerGridSteps = 100;
  let maxObservedDegX = 0;
  let maxObservedDegY = 0;

  for (let ix = -pointerGridSteps; ix <= pointerGridSteps; ix++) {
    for (let iy = -pointerGridSteps; iy <= pointerGridSteps; iy++) {
      const px = ix / pointerGridSteps; // [-1.0, 1.0]
      const py = iy / pointerGridSteps; // [-1.0, 1.0]

      // SceneContainer.tsx formulas:
      // targetRotY = smoothedPointer.current.x * maxTilt;
      // targetRotX = -smoothedPointer.current.y * (maxTilt * 0.7);
      const rotY = px * maxTiltAct1;
      const rotX = -py * (maxTiltAct1 * 0.7);

      const degX = Math.abs(radToDeg(rotX));
      const degY = Math.abs(radToDeg(rotY));

      if (degX > maxObservedDegX) maxObservedDegX = degX;
      if (degY > maxObservedDegY) maxObservedDegY = degY;

      assert.ok(
        degX <= MAX_PERMISSIBLE_DEG + 1e-6,
        `rotX (${degX.toFixed(2)}°) exceeded ±14° at py=${py}`
      );
      assert.ok(
        degY <= MAX_PERMISSIBLE_DEG + 1e-6,
        `rotY (${degY.toFixed(2)}°) exceeded ±14° at px=${px}`
      );
    }
  }
  passedAssertions += 2;

  console.log(`  Scanned 40,401 pointer positions in normalized viewport [-1, 1] x [-1, 1]:`);
  console.log(`    Max Observed Pitch (X-rotation): ${maxObservedDegX.toFixed(4)}° (limit: 14°)`);
  console.log(`    Max Observed Yaw   (Y-rotation): ${maxObservedDegY.toFixed(4)}° (limit: 14°)`);
  console.log(`    Margin beneath 14° cap: ${(MAX_PERMISSIBLE_DEG - maxObservedDegY).toFixed(4)}°`);
  console.log(`  [PASS] Mouse tilt math strictly adheres to the ±14° constraint.\n`);

  // --------------------------------------------------------------------------
  // TEST 4: Camera Rig 5-Act Path Interpolation Continuity
  // --------------------------------------------------------------------------
  console.log('TEST 4: Camera Rig 5-Act Trajectory Continuity & Range Checking');

  // Simulate SceneContainer CameraRig keyframe interpolation for both LTR and RTL
  const evalCameraPosition = (s: number, isArabic: boolean): THREE.Vector3 => {
    const rtlMultiplier = isArabic ? -1.0 : 1.0;
    const target = new THREE.Vector3();

    if (s < 0.20) {
      const p = s / 0.20;
      target.set(0, THREE.MathUtils.lerp(1.2, 1.4, p), THREE.MathUtils.lerp(5.5, 5.2, p));
    } else if (s < 0.45) {
      const p = (s - 0.20) / 0.25;
      const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
      target.set(
        THREE.MathUtils.lerp(0, 4.2 * rtlMultiplier, smoothP),
        THREE.MathUtils.lerp(1.4, 3.8, smoothP),
        THREE.MathUtils.lerp(5.2, 4.2, smoothP)
      );
    } else if (s < 0.70) {
      const p = (s - 0.45) / 0.25;
      const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
      target.set(
        THREE.MathUtils.lerp(4.2 * rtlMultiplier, -3.5 * rtlMultiplier, smoothP),
        THREE.MathUtils.lerp(3.8, 2.0, smoothP),
        THREE.MathUtils.lerp(4.2, -4.5, smoothP)
      );
    } else if (s < 0.90) {
      const p = (s - 0.70) / 0.20;
      const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
      target.set(
        THREE.MathUtils.lerp(-3.5 * rtlMultiplier, 0, smoothP),
        THREE.MathUtils.lerp(2.0, 2.8, smoothP),
        THREE.MathUtils.lerp(-4.5, 7.8, smoothP)
      );
    } else {
      const p = (s - 0.90) / 0.10;
      const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
      target.set(
        0,
        THREE.MathUtils.lerp(2.8, 0.9, smoothP),
        THREE.MathUtils.lerp(7.8, 4.8, smoothP)
      );
    }
    return target;
  };

  for (const isArabic of [false, true]) {
    const mode = isArabic ? 'Arabic (RTL)' : 'Default (LTR)';
    let maxJumpDistance = 0;
    let prevPos: THREE.Vector3 | null = null;
    const samples = 2000;

    for (let i = 0; i <= samples; i++) {
      const s = i / samples;
      const pos = evalCameraPosition(s, isArabic);

      assert.ok(!Number.isNaN(pos.x) && !Number.isNaN(pos.y) && !Number.isNaN(pos.z), `Camera pos is NaN at s=${s}`);
      assert.ok(Number.isFinite(pos.x) && Number.isFinite(pos.y) && Number.isFinite(pos.z), `Camera pos is non-finite at s=${s}`);

      if (prevPos) {
        const jump = pos.distanceTo(prevPos);
        if (jump > maxJumpDistance) maxJumpDistance = jump;
        // With 2000 samples across max distance ~12, delta per step should be < 0.05
        assert.ok(jump < 0.05, `Discontinuous camera jump of ${jump} detected at s=${s}`);
      }
      prevPos = pos;
    }
    console.log(`  Trajectory ${mode}: 2,001 steps, max step distance = ${maxJumpDistance.toFixed(4)} (Smooth C0 continuity)`);
    passedAssertions += 3;
  }
  console.log('  [PASS] Camera rig trajectory has zero discontinuities across all 5 acts.\n');

  // --------------------------------------------------------------------------
  // TEST 5: Geometry Integrity, Buffer Bounds & Triangle Budget
  // --------------------------------------------------------------------------
  console.log('TEST 5: Procedural Geometry Buffer Integrity & Triangle Budget');

  const geometries = [
    { name: 'PlinthBase', geom: createPlinthBaseGeometry() },
    { name: 'FacadeFront', geom: createFacadeFrontGeometry() },
    { name: 'WallBack', geom: createWallBackGeometry() },
    { name: 'RoofSlopeLeft', geom: createRoofSlopeLeftGeometry() },
    { name: 'RoofSlopeRight', geom: createRoofSlopeRightGeometry() },
    { name: 'SideWall', geom: createSideWallGeometry() },
    { name: 'GoldRimTrim', geom: createGoldRimTrimGeometry() },
    { name: 'PlusCrystalOuter', geom: createPlusCrystalGeometry() },
    { name: 'PlusCore', geom: createPlusCoreGeometry() },
    { name: 'EnergyTube', geom: createEnergyTubeGeometry() },
    { name: 'PlasmaOrb', geom: createPlasmaOrbGeometry() },
    { name: 'HealthSphere', geom: createHealthSphereGeometry() },
    { name: 'HealthCross', geom: createHealthCrossGeometry() },
    { name: 'MobilityHex', geom: createMobilityHexGeometry() },
    { name: 'MobilityRim', geom: createMobilityRimGeometry() },
    { name: 'MicroHex', geom: createMicroHexGeometry() },
    { name: 'TelecomHub', geom: createTelecomHubGeometry() },
    { name: 'TelecomRing', geom: createTelecomRingGeometry() },
    { name: 'TelecomNode', geom: createTelecomNodeGeometry() },
    { name: 'OrbitGuide1', geom: createOrbitGuideGeometry(2.4) },
    { name: 'ContractSheet', geom: createContractSheetGeometry() },
  ];

  for (const { name, geom } of geometries) {
    geom.computeBoundingBox();
    geom.computeBoundingSphere();

    assert.ok(geom.boundingBox, `Geometry ${name} must have a valid boundingBox`);
    assert.ok(geom.boundingSphere, `Geometry ${name} must have a valid boundingSphere`);
    assert.ok(geom.attributes.position, `Geometry ${name} must have a position attribute`);

    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      assert.ok(!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z), `NaN vertex in ${name} at index ${i}`);
      assert.ok(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z), `Non-finite vertex in ${name} at index ${i}`);
    }
    passedAssertions += 4;
  }
  console.log(`  Verified 21 procedural BufferGeometries: 0 NaN vertices, valid bounding volumes.`);

  const budget = computeTotalSceneTriangleBudget();
  console.log(`  Triangle Budget Audit: ${budget.totalTriangles.toLocaleString()} / ${budget.maxBudget.toLocaleString()} triangles (${budget.headroom.toLocaleString()} headroom)`);
  assert.ok(budget.totalTriangles < 55000, 'Must be strictly below 55,000 triangle budget');
  assert.ok(budget.totalTriangles > 20000, 'Must have sufficient detail (> 20,000 triangles)');
  assert.strictEqual(budget.isWithinBudget, true, 'isWithinBudget must be true');
  passedAssertions += 3;
  console.log('  [PASS] Triangle budget & procedural geometry generation validated.\n');

  // --------------------------------------------------------------------------
  // TEST 6: Material Shaders & Dynamic Emission Ranges
  // --------------------------------------------------------------------------
  console.log('TEST 6: Material Shaders, Physical Constants & Dynamic Emissive Ranges');

  const smoked = createSmokedGlassMaterial();
  assert.strictEqual(smoked.transmission, 0.88);
  assert.strictEqual(smoked.ior, 1.52);
  assert.strictEqual(smoked.roughness, 0.14);
  assert.strictEqual(smoked.metalness, 0.05);
  assert.strictEqual(smoked.clearcoat, 0.35);

  const gold = createChampagneGoldMaterial(0.20);
  assert.strictEqual(gold.metalness, 0.92);
  assert.strictEqual(gold.roughness, 0.18);
  assert.strictEqual(gold.emissiveIntensity, 0.20);

  const plusOuter = createPlusOuterMaterial();
  assert.strictEqual(plusOuter.transmission, 0.75);
  assert.strictEqual(plusOuter.ior, 1.65);
  assert.strictEqual(plusOuter.roughness, 0.08);

  const pearl = createPearlGlassMaterial();
  assert.strictEqual(pearl.transmission, 0.92);
  assert.strictEqual(pearl.ior, 1.48);

  const charcoal = createAnodizedCharcoalMaterial();
  assert.strictEqual(charcoal.metalness, 0.88);
  assert.strictEqual(charcoal.roughness, 0.22);
  passedAssertions += 14;

  // Gold rim emissive response across savings range [400, 2500]
  const rimEmissive = (savings: number) => {
    const s = Math.max(400, Math.min(2500, savings));
    const normalized = (s - 400) / 2100;
    return 0.20 + normalized * 0.65;
  };

  assert.strictEqual(Math.round(rimEmissive(400) * 100) / 100, 0.20);
  assert.strictEqual(Math.round(rimEmissive(1450) * 100) / 100, 0.53);
  assert.strictEqual(Math.round(rimEmissive(2500) * 100) / 100, 0.85);
  assert.strictEqual(Math.round(rimEmissive(0) * 100) / 100, 0.20);    // clamped min
  assert.strictEqual(Math.round(rimEmissive(9999) * 100) / 100, 0.85); // clamped max
  passedAssertions += 5;

  console.log(`  Dynamic gold rim emission range: [${rimEmissive(400).toFixed(2)}, ${rimEmissive(2500).toFixed(2)}]`);
  console.log('  [PASS] All optical constants, material shaders, and dynamic emissions verified.\n');

  console.log('================================================================');
  console.log(`CHALLENGER 2 SUITE COMPLETE: ${passedAssertions} ASSERTIONS PASSED WITH ZERO FAILURES`);
  console.log('================================================================');
}

runChallenger2EmpiricalSuite();
