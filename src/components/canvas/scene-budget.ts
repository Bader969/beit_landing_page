import * as THREE from 'three';

/**
 * Procedural Geometry Builders and Triangle Budget Accounting
 * Beit Plus 3D Cinematic Experience - Milestone 2 (M2)
 *
 * All geometries are 100% procedural. No external 3D models or textures.
 * Performance Envelope: Strictly < 55,000 triangles total (Target: ~25,000 - 35,000 tris).
 */

// --- OPTICAL CONSTANTS & BRAND PALETTE ---
export const BRAND_COLORS = {
  midnightNavy: '#0F2D4A',
  deepTeal: '#0F8A83',
  champagneGold: '#C7A55A',
  offWhite: '#FAFAF7',
  charcoal: '#2D3748',
  obsidianDeep: '#071524',
  electricCyan: '#1DF8E0',
  attenuationNavy: '#061524',
  attenuationTeal: '#064743',
};

// --- MATERIAL FACTORIES ---
export function createSmokedGlassMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(BRAND_COLORS.midnightNavy),
    transmission: 0.88,
    opacity: 1.0,
    transparent: true,
    ior: 1.52,
    roughness: 0.14,
    metalness: 0.05,
    clearcoat: 0.35,
    clearcoatRoughness: 0.10,
    thickness: 1.20,
    attenuationColor: new THREE.Color(BRAND_COLORS.attenuationNavy),
    attenuationDistance: 0.75,
    specularColor: new THREE.Color(BRAND_COLORS.champagneGold),
    specularIntensity: 0.80,
    depthWrite: false,
  });
}

export function createChampagneGoldMaterial(emissiveIntensity = 0.20): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(BRAND_COLORS.champagneGold),
    metalness: 0.92,
    roughness: 0.18,
    emissive: new THREE.Color(BRAND_COLORS.champagneGold),
    emissiveIntensity,
  });
}

export function createPlusOuterMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(BRAND_COLORS.deepTeal),
    transmission: 0.75,
    ior: 1.65,
    roughness: 0.08,
    metalness: 0.10,
    thickness: 0.80,
    emissive: new THREE.Color(BRAND_COLORS.deepTeal),
    emissiveIntensity: 1.50,
    attenuationColor: new THREE.Color(BRAND_COLORS.attenuationTeal),
    attenuationDistance: 0.40,
    transparent: true,
  });
}

export function createPlusCoreMaterial(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(BRAND_COLORS.electricCyan),
  });
}

export function createPearlGlassMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(BRAND_COLORS.offWhite),
    transmission: 0.92,
    roughness: 0.12,
    ior: 1.48,
    clearcoat: 0.80,
    clearcoatRoughness: 0.10,
    transparent: true,
    opacity: 0.95,
  });
}

export function createAnodizedCharcoalMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(BRAND_COLORS.charcoal),
    metalness: 0.88,
    roughness: 0.22,
  });
}

// --- PROCEDURAL GEOMETRY GENERATORS ---

/**
 * 1. Plinth Base: Obsidian Navy foundation with beveled corners
 */
export function createPlinthBaseGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const w = 1.4;
  const d = 1.2;
  const r = 0.12;

  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.absarc(w - r, -d + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(w, d - r);
  shape.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-w + r, d);
  shape.absarc(-w + r, d - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w, -d + r);
  shape.absarc(-w + r, -d + r, r, Math.PI, Math.PI * 1.5, false);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 4,
    curveSegments: 16,
  });
  geom.rotateX(Math.PI / 2);
  geom.center();
  return geom;
}

/**
 * 2. Front Facade: Gabled smoked glass wall with roof notch cradle & mullions
 */
export function createFacadeFrontGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.2, 0.0);
  shape.lineTo(1.2, 0.0);
  shape.lineTo(1.2, 1.8);
  shape.lineTo(0.35, 2.4);  // right roof slope to notch
  shape.lineTo(0.0, 1.65);  // center notch valley
  shape.lineTo(-0.35, 2.4); // notch to left roof slope
  shape.lineTo(-1.2, 1.8);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 5,
    curveSegments: 24,
  });
  geom.center();
  return geom;
}

/**
 * 3. Back Wall: Full gabled smoked glass wall with mullions
 */
export function createWallBackGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.2, 0.0);
  shape.lineTo(1.2, 0.0);
  shape.lineTo(1.2, 1.8);
  shape.lineTo(0.0, 2.85); // apex peak
  shape.lineTo(-1.2, 1.8);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 5,
    curveSegments: 24,
  });
  geom.center();
  return geom;
}

/**
 * 4. Left Roof Slope: Pitched roof slab with bevel
 */
export function createRoofSlopeLeftGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BoxGeometry(1.65, 0.10, 2.06, 16, 6, 20);
  return geom;
}

/**
 * 5. Right Roof Slope: Pitched roof slab with bevel
 */
export function createRoofSlopeRightGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BoxGeometry(1.65, 0.10, 2.06, 16, 6, 20);
  return geom;
}

/**
 * Side walls (Left & Right)
 */
export function createSideWallGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(0.10, 1.76, 1.86, 6, 16, 16);
}

/**
 * Gold edge rim frames
 */
export function createGoldRimTrimGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(0.04, 0.04, 2.08, 4, 4, 24);
}

/**
 * 6. Floating Greek Cross (Bioluminescent Plus) - Outer Hull
 */
export function createPlusCrystalGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const arm = 0.44;
  const th = 0.13; // half-thickness

  shape.moveTo(-th, arm);
  shape.lineTo(th, arm);
  shape.lineTo(th, th);
  shape.lineTo(arm, th);
  shape.lineTo(arm, -th);
  shape.lineTo(th, -th);
  shape.lineTo(th, -arm);
  shape.lineTo(-th, -arm);
  shape.lineTo(-th, -th);
  shape.lineTo(-arm, -th);
  shape.lineTo(-arm, th);
  shape.lineTo(-th, th);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.26,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 5,
    curveSegments: 16,
  });
  geom.center();
  return geom;
}

/**
 * Floating Greek Cross - Inner Core
 */
export function createPlusCoreGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const arm = 0.28;
  const th = 0.08;

  shape.moveTo(-th, arm);
  shape.lineTo(th, arm);
  shape.lineTo(th, th);
  shape.lineTo(arm, th);
  shape.lineTo(arm, -th);
  shape.lineTo(th, -th);
  shape.lineTo(th, -arm);
  shape.lineTo(-th, -arm);
  shape.lineTo(-th, -th);
  shape.lineTo(-arm, -th);
  shape.lineTo(-arm, th);
  shape.lineTo(-th, th);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 4,
    curveSegments: 12,
  });
  geom.center();
  return geom;
}

/**
 * 7. Orbital Satellite 1: Energy Filament (CatmullRom Spline Curve & Tube)
 */
export function createEnergySpline(): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  const radius = 2.4;
  const pointCount = 12;

  for (let i = 0; i < pointCount; i++) {
    const phi = (i / pointCount) * Math.PI * 2;
    const x = radius * Math.cos(phi);
    const y = 0.35 * Math.sin(3 * phi);
    const z = radius * Math.sin(phi);
    points.push(new THREE.Vector3(x, y, z));
  }

  return new THREE.CatmullRomCurve3(points, true);
}

export function createEnergyTubeGeometry(): THREE.BufferGeometry {
  const curve = createEnergySpline();
  return new THREE.TubeGeometry(curve, 96, 0.025, 8, true);
}

export function createPlasmaOrbGeometry(): THREE.BufferGeometry {
  return new THREE.SphereGeometry(0.13, 20, 20);
}

/**
 * 8. Orbital Satellite 2: Health Cocoon (Pearl Glass Sphere + Inner Cross + Guide Ring)
 */
export function createHealthSphereGeometry(): THREE.BufferGeometry {
  return new THREE.SphereGeometry(0.32, 28, 28);
}

export function createHealthCrossGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const arm = 0.16;
  const th = 0.045;

  shape.moveTo(-th, arm);
  shape.lineTo(th, arm);
  shape.lineTo(th, th);
  shape.lineTo(arm, th);
  shape.lineTo(arm, -th);
  shape.lineTo(th, -th);
  shape.lineTo(th, -arm);
  shape.lineTo(-th, -arm);
  shape.lineTo(-th, -th);
  shape.lineTo(-arm, -th);
  shape.lineTo(-arm, th);
  shape.lineTo(-th, th);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geom.center();
  return geom;
}

/**
 * 9. Orbital Satellite 3: Mobility Hex-Plate (Hexagonal Prism + Gold Rim + Micro Hexes)
 */
export function createMobilityHexGeometry(): THREE.BufferGeometry {
  // Cylinder with 6 radial segments forms a regular hexagon
  return new THREE.CylinderGeometry(0.42, 0.42, 0.08, 6, 2, false);
}

export function createMobilityRimGeometry(): THREE.BufferGeometry {
  return new THREE.TorusGeometry(0.44, 0.024, 6, 6);
}

export function createMicroHexGeometry(): THREE.BufferGeometry {
  return new THREE.CylinderGeometry(0.12, 0.12, 0.04, 6, 1, false);
}

/**
 * 10. Orbital Satellite 4: Telecom Constellation Web
 */
export function createTelecomHubGeometry(): THREE.BufferGeometry {
  return new THREE.SphereGeometry(0.18, 18, 18);
}

export function createTelecomRingGeometry(): THREE.BufferGeometry {
  return new THREE.TorusGeometry(0.24, 0.014, 6, 32);
}

export function createTelecomNodeGeometry(): THREE.BufferGeometry {
  return new THREE.IcosahedronGeometry(0.055, 2);
}

/**
 * 11. Orbital Guide Rings
 */
export function createOrbitGuideGeometry(radius: number): THREE.BufferGeometry {
  return new THREE.TorusGeometry(radius, 0.007, 8, 64);
}

/**
 * 12. Floating Contract Paper Sheets (Act I -> Act IV)
 */
export function createContractSheetGeometry(): THREE.BufferGeometry {
  return new THREE.PlaneGeometry(0.38, 0.52, 2, 2);
}

/**
 * 13. 3D Brandmark Typography Mount Plaque & Champagne Gold Bevel Rim (Act III)
 */
export function createTypographyPlaqueGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(2.4, 0.52, 0.04);
}

export function createTypographyBevelRimGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(2.46, 0.58, 0.02);
}

/**
 * 14. Golden Light Streams Ribbons (Act IV Sanctuary of Flow)
 */
export function createGoldenStreamRibbonGeometry(): THREE.BufferGeometry {
  return new THREE.PlaneGeometry(0.12, 1.8, 4, 16);
}

// --- TRIANGLE BUDGET VERIFICATION & ACCOUNTING ---

export interface GeometryBudgetEntry {
  name: string;
  count: number;
  trianglesPerInstance: number;
  totalTriangles: number;
}

export interface BudgetReport {
  entries: GeometryBudgetEntry[];
  totalTriangles: number;
  maxBudget: number;
  isWithinBudget: boolean;
  headroom: number;
}

export function countBufferGeometryTriangles(geometry: THREE.BufferGeometry): number {
  if (geometry.index) {
    return geometry.index.count / 3;
  }
  const pos = geometry.attributes.position;
  return pos ? pos.count / 3 : 0;
}

export function computeTotalSceneTriangleBudget(): BudgetReport {
  const plinth = createPlinthBaseGeometry();
  const facade = createFacadeFrontGeometry();
  const wallBack = createWallBackGeometry();
  const roofLeft = createRoofSlopeLeftGeometry();
  const roofRight = createRoofSlopeRightGeometry();
  const sideWall = createSideWallGeometry();
  const goldTrim = createGoldRimTrimGeometry();

  const plusOuter = createPlusCrystalGeometry();
  const plusCore = createPlusCoreGeometry();

  const energyTube = createEnergyTubeGeometry();
  const plasmaOrb = createPlasmaOrbGeometry();

  const healthSphere = createHealthSphereGeometry();
  const healthCross = createHealthCrossGeometry();
  const orbitGuide1 = createOrbitGuideGeometry(2.4);
  const orbitGuide2 = createOrbitGuideGeometry(3.1);
  const orbitGuide3 = createOrbitGuideGeometry(3.8);
  const orbitGuide4 = createOrbitGuideGeometry(4.5);

  const mobilityHex = createMobilityHexGeometry();
  const mobilityRim = createMobilityRimGeometry();
  const microHex = createMicroHexGeometry();

  const telecomHub = createTelecomHubGeometry();
  const telecomRing = createTelecomRingGeometry();
  const telecomNode = createTelecomNodeGeometry();

  const sheet = createContractSheetGeometry();
  const typoPlaque = createTypographyPlaqueGeometry();
  const typoRim = createTypographyBevelRimGeometry();
  const goldenRibbon = createGoldenStreamRibbonGeometry();

  const rawEntries = [
    { name: 'PlinthBase', geom: plinth, instances: 1 },
    { name: 'FacadeFront', geom: facade, instances: 1 },
    { name: 'WallBack', geom: wallBack, instances: 1 },
    { name: 'RoofSlopeLeft', geom: roofLeft, instances: 1 },
    { name: 'RoofSlopeRight', geom: roofRight, instances: 1 },
    { name: 'SideWalls (Left & Right)', geom: sideWall, instances: 2 },
    { name: 'ChampagneGoldTrimRims', geom: goldTrim, instances: 6 },
    { name: 'BioluminescentPlusOuter', geom: plusOuter, instances: 1 },
    { name: 'BioluminescentPlusCore', geom: plusCore, instances: 1 },
    { name: 'Pillar1: EnergyFilament Tube', geom: energyTube, instances: 1 },
    { name: 'Pillar1: PlasmaOrb', geom: plasmaOrb, instances: 1 },
    { name: 'Pillar1: OrbitGuideRing', geom: orbitGuide1, instances: 1 },
    { name: 'Pillar2: HealthCocoon Sphere', geom: healthSphere, instances: 1 },
    { name: 'Pillar2: Health MedicalCross', geom: healthCross, instances: 1 },
    { name: 'Pillar2: OrbitGuideRing', geom: orbitGuide2, instances: 1 },
    { name: 'Pillar3: MobilityHexPlate', geom: mobilityHex, instances: 1 },
    { name: 'Pillar3: MobilityGoldRim', geom: mobilityRim, instances: 1 },
    { name: 'Pillar3: MicroHexSatellites', geom: microHex, instances: 3 },
    { name: 'Pillar3: OrbitGuideRing', geom: orbitGuide3, instances: 1 },
    { name: 'Pillar4: TelecomHubSphere', geom: telecomHub, instances: 1 },
    { name: 'Pillar4: TelecomGoldRing', geom: telecomRing, instances: 1 },
    { name: 'Pillar4: TelecomMicroNodes', geom: telecomNode, instances: 12 },
    { name: 'Pillar4: OrbitGuideRing', geom: orbitGuide4, instances: 1 },
    { name: 'BureaucraticContractSheets', geom: sheet, instances: 24 },
    { name: 'TypographyPlaque3D', geom: typoPlaque, instances: 1 },
    { name: 'TypographyBevelRim3D', geom: typoRim, instances: 1 },
    { name: 'GoldenLightStreamsRibbons', geom: goldenRibbon, instances: 6 },
  ];

  let totalTriangles = 0;
  const entries: GeometryBudgetEntry[] = rawEntries.map((item) => {
    const tris = Math.round(countBufferGeometryTriangles(item.geom));
    const itemTotal = tris * item.instances;
    totalTriangles += itemTotal;
    return {
      name: item.name,
      count: item.instances,
      trianglesPerInstance: tris,
      totalTriangles: itemTotal,
    };
  });

  const maxBudget = 55000;

  return {
    entries,
    totalTriangles,
    maxBudget,
    isWithinBudget: totalTriangles < maxBudget,
    headroom: maxBudget - totalTriangles,
  };
}
