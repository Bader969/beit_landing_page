import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { antigravityController } from '../../store/antigravity-controller';
import { TelemetryState } from '../../types/telemetry';
import {
  BRAND_COLORS,
  createSmokedGlassMaterial,
  createChampagneGoldMaterial,
  createPlinthBaseGeometry,
  createFacadeFrontGeometry,
  createWallBackGeometry,
  createRoofSlopeLeftGeometry,
  createRoofSlopeRightGeometry,
  createSideWallGeometry,
  createGoldRimTrimGeometry,
} from './scene-budget';

interface ArchitecturalSanctuaryProps {
  telemetry: TelemetryState;
}

/**
 * ArchitecturalSanctuary:
 * Procedural 3D house monolith in Midnight Navy (#0F2D4A) with smoked dielectric frosted glass,
 * Champagne Gold (#C7A55A) specular bevel rims, and modular deconstructible sub-meshes:
 * - RoofSlopeLeft
 * - RoofSlopeRight
 * - FacadeFront
 * - WallBack
 * - PlinthBase
 *
 * Responds to:
 * - Household size (volume scale S = 1.0 + (N - 1) * 0.07)
 * - Savings value (gold rim emissive intensity)
 * - Scrollytelling Act II deconstruction offsets
 * - Pointer hover and click events
 */
export function calculateSanctuaryDeconstruction(s: number): number {
  if (s >= 0.20 && s < 0.45) {
    return (s - 0.20) / 0.25;
  }
  if (s >= 0.45 && s < 0.70) {
    return 1.0 - ((s - 0.45) / 0.25) * 0.4;
  }
  if (s >= 0.70 && s < 0.90) {
    return Math.max(0, 0.6 - ((s - 0.70) / 0.20) * 0.6);
  }
  return 0.0;
}

export function calculateBreathingCycle(t: number, s: number): number {
  if (s >= 0.90) {
    // 2-second breathing cycle: T = 2.0s => omega = Math.PI rad/s
    return 0.05 * Math.sin(Math.PI * t);
  }
  return 0.0;
}

export const ArchitecturalSanctuary: React.FC<ArchitecturalSanctuaryProps> = ({ telemetry }) => {
  const groupRef = useRef<THREE.Group>(null);
  const roofSlopeLeftRef = useRef<THREE.Group>(null);
  const roofSlopeRightRef = useRef<THREE.Group>(null);
  const facadeFrontRef = useRef<THREE.Group>(null);
  const wallBackRef = useRef<THREE.Group>(null);
  const plinthBaseRef = useRef<THREE.Group>(null);
  const sideWallLeftRef = useRef<THREE.Mesh>(null);
  const sideWallRightRef = useRef<THREE.Mesh>(null);

  // Materials
  const smokedGlassMat = useMemo(() => createSmokedGlassMaterial(), []);
  const goldRimMat = useMemo(() => createChampagneGoldMaterial(0.20), []);
  const plinthMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(BRAND_COLORS.obsidianDeep),
        metalness: 0.70,
        roughness: 0.35,
      }),
    []
  );

  // Geometries
  const plinthGeom = useMemo(() => createPlinthBaseGeometry(), []);
  const facadeGeom = useMemo(() => createFacadeFrontGeometry(), []);
  const wallBackGeom = useMemo(() => createWallBackGeometry(), []);
  const roofLeftGeom = useMemo(() => createRoofSlopeLeftGeometry(), []);
  const roofRightGeom = useMemo(() => createRoofSlopeRightGeometry(), []);
  const sideWallGeom = useMemo(() => createSideWallGeometry(), []);
  const goldTrimGeom = useMemo(() => createGoldRimTrimGeometry(), []);

  // Scratch registers for per-frame interpolation without garbage collection
  const targetScale = useRef(1.0);
  const currentScale = useRef(1.0);
  const deconstructionFactor = useRef(0.0);
  const timeAcc = useRef(0.0);

  useFrame((_, delta) => {
    timeAcc.current += delta;
    const t = timeAcc.current;
    const s = telemetry.scrollProgress;

    // 1. Reactive volume scale S = 1.0 + (N - 1) * 0.07
    const N = Math.max(1, Math.min(6, telemetry.householdSize || 3));
    targetScale.current = 1.0 + (N - 1) * 0.07;
    currentScale.current = THREE.MathUtils.damp(currentScale.current, targetScale.current, 6.0, delta);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale.current);
      // Act V 2-second breathing cycle levitation
      const breathingY = calculateBreathingCycle(t, s);
      groupRef.current.position.y = breathingY;
    }

    // 2. Dynamic Gold Rim Emissive Intensity based on savingsValue
    const savings = Math.max(400, Math.min(2500, telemetry.savingsValue || 1120));
    const normalizedSavings = (savings - 400) / 2100; // 0.0 to 1.0
    const targetEmissive = 0.20 + normalizedSavings * 0.65; // 0.20 to 0.85
    goldRimMat.emissiveIntensity = THREE.MathUtils.lerp(
      goldRimMat.emissiveIntensity,
      targetEmissive,
      0.1
    );

    // 3. Act II Deconstruction Calculation along blueprint normal vectors
    const targetDecon = calculateSanctuaryDeconstruction(s);

    deconstructionFactor.current = THREE.MathUtils.damp(
      deconstructionFactor.current,
      targetDecon,
      5.0,
      delta
    );
    const d = deconstructionFactor.current;

    // Apply modular deconstruction vectors
    if (roofSlopeLeftRef.current) {
      // RoofSlopeLeft: Vector translation Δ = [-0.85, 0.65, 0.0]
      roofSlopeLeftRef.current.position.set(-0.85 * d, 0.65 * d, 0);
      roofSlopeLeftRef.current.rotation.z = -0.15 * d;
    }

    if (roofSlopeRightRef.current) {
      // RoofSlopeRight: Vector translation Δ = [+0.85, 0.65, 0.0]
      roofSlopeRightRef.current.position.set(0.85 * d, 0.65 * d, 0);
      roofSlopeRightRef.current.rotation.z = 0.15 * d;
    }

    if (facadeFrontRef.current) {
      // FacadeFront: Vector translation Δ = [0.0, 0.0, +0.95]
      facadeFrontRef.current.position.set(0, 0, 0.95 * d);
    }

    if (wallBackRef.current) {
      // WallBack: Vector translation Δ = [0.0, 0.0, -0.95]
      wallBackRef.current.position.set(0, 0, -0.95 * d);
    }

    if (sideWallLeftRef.current) {
      // SideWallLeft: translation along normal -X
      sideWallLeftRef.current.position.set(-1.18 - 1.15 * d, 0.90, 0);
    }

    if (sideWallRightRef.current) {
      // SideWallRight: translation along normal +X
      sideWallRightRef.current.position.set(1.18 + 1.15 * d, 0.90, 0);
    }

    // PlinthBase remains anchored
  });

  const handlePointerOver = (e: React.PointerEvent) => {
    e.stopPropagation();
    antigravityController.setHoverTarget('house');
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (antigravityController.hoverTarget === 'house') {
      antigravityController.setHoverTarget(null);
    }
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'default';
    }
  };

  const handleClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    antigravityController.toggleConsultation();
  };

  return (
    <group
      ref={groupRef}
      name="ArchitecturalSanctuaryRoot"
      onPointerOver={handlePointerOver as unknown as (e: unknown) => void}
      onPointerOut={handlePointerOut}
      onClick={handleClick as unknown as (e: unknown) => void}
    >
      {/* 1. PLINTH BASE (Anchored foundation) */}
      <group ref={plinthBaseRef} name="PlinthBase" position={[0, -0.09, 0]}>
        <mesh geometry={plinthGeom} material={plinthMat} receiveShadow castShadow />
        {/* Perimeter Gold Trim Rim */}
        <mesh
          position={[0, 0.09, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={goldRimMat}
        >
          <torusGeometry args={[1.38, 0.016, 6, 64]} />
        </mesh>
      </group>

      {/* 2. FACADE FRONT (Gabled front with roof notch alcove) */}
      <group ref={facadeFrontRef} name="FacadeFront" position={[0, 0, 0]}>
        {/* Front Glass Pane */}
        <mesh
          position={[0, 0.98, 0.94]}
          geometry={facadeGeom}
          material={smokedGlassMat}
          castShadow
        />
        {/* Entrance Portal Bevel / Gold Arch Trim */}
        <mesh position={[0, 0.55, 1.01]} material={goldRimMat}>
          <boxGeometry args={[0.72, 1.1, 0.02]} />
        </mesh>
        <mesh position={[0, 0.55, 1.02]} material={smokedGlassMat}>
          <boxGeometry args={[0.64, 1.02, 0.02]} />
        </mesh>
        {/* Gold Sill Trim */}
        <mesh
          position={[0, 0.02, 0.99]}
          geometry={goldTrimGeom}
          material={goldRimMat}
          rotation={[0, Math.PI / 2, 0]}
        />
      </group>

      {/* 3. WALL BACK (Full gabled rear wall) */}
      <group ref={wallBackRef} name="WallBack" position={[0, 0, 0]}>
        {/* Rear Glass Pane */}
        <mesh
          position={[0, 1.10, -0.94]}
          geometry={wallBackGeom}
          material={smokedGlassMat}
          castShadow
        />
        {/* Vertical Structural Gold Louvers */}
        {[-0.6, 0.0, 0.6].map((xOffset, i) => (
          <mesh
            key={`back-louver-${i}`}
            position={[xOffset, 1.05, -0.99]}
            material={goldRimMat}
          >
            <boxGeometry args={[0.03, 1.9, 0.02]} />
          </mesh>
        ))}
        {/* Gold Sill Trim */}
        <mesh
          position={[0, 0.02, -0.99]}
          geometry={goldTrimGeom}
          material={goldRimMat}
          rotation={[0, Math.PI / 2, 0]}
        />
      </group>

      {/* 4. ROOF SLOPE LEFT */}
      <group ref={roofSlopeLeftRef} name="RoofSlopeLeft" position={[0, 0, 0]}>
        {/* Left Pitched Glass Slab */}
        <mesh
          position={[-0.62, 2.32, 0]}
          rotation={[0, 0, Math.PI * 0.228]}
          geometry={roofLeftGeom}
          material={smokedGlassMat}
          castShadow
        />
        {/* Gold Chamfer Bevel Rims */}
        <mesh
          position={[-0.62, 2.38, 1.01]}
          rotation={[0, 0, Math.PI * 0.228]}
          material={goldRimMat}
        >
          <boxGeometry args={[1.68, 0.02, 0.04]} />
        </mesh>
        <mesh
          position={[-0.62, 2.38, -1.01]}
          rotation={[0, 0, Math.PI * 0.228]}
          material={goldRimMat}
        >
          <boxGeometry args={[1.68, 0.02, 0.04]} />
        </mesh>
        {/* Left Eaves Trim */}
        <mesh
          position={[-1.24, 1.76, 0]}
          geometry={goldTrimGeom}
          material={goldRimMat}
        />
      </group>

      {/* 5. ROOF SLOPE RIGHT */}
      <group ref={roofSlopeRightRef} name="RoofSlopeRight" position={[0, 0, 0]}>
        {/* Right Pitched Glass Slab */}
        <mesh
          position={[0.62, 2.32, 0]}
          rotation={[0, 0, -Math.PI * 0.228]}
          geometry={roofRightGeom}
          material={smokedGlassMat}
          castShadow
        />
        {/* Gold Chamfer Bevel Rims */}
        <mesh
          position={[0.62, 2.38, 1.01]}
          rotation={[0, 0, -Math.PI * 0.228]}
          material={goldRimMat}
        >
          <boxGeometry args={[1.68, 0.02, 0.04]} />
        </mesh>
        <mesh
          position={[0.62, 2.38, -1.01]}
          rotation={[0, 0, -Math.PI * 0.228]}
          material={goldRimMat}
        >
          <boxGeometry args={[1.68, 0.02, 0.04]} />
        </mesh>
        {/* Right Eaves Trim */}
        <mesh
          position={[1.24, 1.76, 0]}
          geometry={goldTrimGeom}
          material={goldRimMat}
        />
      </group>

      {/* SIDE WALLS (Left & Right Flanks) */}
      <group name="SideWalls">
        <mesh
          ref={sideWallLeftRef}
          position={[-1.18, 0.90, 0]}
          geometry={sideWallGeom}
          material={smokedGlassMat}
          castShadow
        />
        <mesh
          ref={sideWallRightRef}
          position={[1.18, 0.90, 0]}
          geometry={sideWallGeom}
          material={smokedGlassMat}
          castShadow
        />
      </group>
    </group>
  );
};
