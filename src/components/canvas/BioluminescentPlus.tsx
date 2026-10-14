import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { antigravityController } from '../../store/antigravity-controller';
import { TelemetryState } from '../../types/telemetry';
import {
  BRAND_COLORS,
  createPlusOuterMaterial,
  createPlusCoreMaterial,
  createPlusCrystalGeometry,
  createPlusCoreGeometry,
} from './scene-budget';

interface BioluminescentPlusProps {
  telemetry: TelemetryState;
}

/**
 * BioluminescentPlus:
 * Floating Plus crystal nestled in the roof notch at [0, 1.45, 0.85].
 * Rendered in glowing Deep Teal (#0F8A83) with volumetric subsurface emission,
 * high-luminance electric cyan core, and embedded point light.
 *
 * Kinetic behavior:
 * - Levitation: y(t) = 1.45 + sin(t * 1.85) * 0.07
 * - Gyroscopic rotation: slow continuous Y-rotation and subtle X/Z tilt
 * - Savings pulse: pulse speed scales with savingsValue
 * - Interactive: hover highlights, click toggles consultation drawer
 */
/**
 * Pure calculation of Plus crystal levitation and subsurface emission.
 * In Act V (0.90 to 1.00), applies the 2-second breathing cycle (T = 2.0s => omega = Math.PI rad/s).
 */
export function calculatePlusBreathingCycle(t: number, s: number): { levitation: number; emission: number } {
  if (s >= 0.90) {
    // Act V 2-second breathing cycle: T = 2.0s => omega = Math.PI rad/s
    return {
      levitation: 0.05 * Math.sin(Math.PI * t),
      emission: 1.2 + 0.35 * Math.sin(Math.PI * t),
    };
  }
  return {
    levitation: Math.sin(t * 1.85) * 0.07,
    emission: 1.4 + (0.5 + 0.5 * Math.sin(t * 3.2)) * 1.2,
  };
}

export const BioluminescentPlus: React.FC<BioluminescentPlusProps> = ({ telemetry }) => {
  const crystalGroupRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Materials & Geometries
  const outerMat = useMemo(() => createPlusOuterMaterial(), []);
  const coreMat = useMemo(() => createPlusCoreMaterial(), []);
  const outerGeom = useMemo(() => createPlusCrystalGeometry(), []);
  const coreGeom = useMemo(() => createPlusCoreGeometry(), []);

  // Internal time accumulator for smooth kinetics
  const timeAcc = useRef(0);

  useFrame((_, delta) => {
    // Pulse frequency scales with savingsValue (1.2 Hz base to 2.4 Hz max)
    const savings = Math.max(400, Math.min(2500, telemetry.savingsValue || 1120));
    const speedMultiplier = 1.0 + ((savings - 400) / 2100) * 0.8;
    timeAcc.current += delta * speedMultiplier;
    const t = timeAcc.current;
    const s = telemetry.scrollProgress;

    const { levitation, emission } = calculatePlusBreathingCycle(t, s);

    if (crystalGroupRef.current) {
      // 1. Levitation oscillation
      const baseY = 1.45;
      crystalGroupRef.current.position.y = baseY + levitation;

      // 2. Gyroscopic rotation
      crystalGroupRef.current.rotation.y = t * 0.35;
      crystalGroupRef.current.rotation.x = Math.sin(t * 0.95) * 0.06;
      crystalGroupRef.current.rotation.z = Math.cos(t * 0.82) * 0.05;

      // 3. Hover target scaling
      const isHovered =
        telemetry.hoverTarget === 'house' ||
        antigravityController.hoverTarget === 'house';
      const targetScale = isHovered ? 1.15 : 1.0;
      crystalGroupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    // 4. Subsurface emission & Point light pulse modulation
    outerMat.emissiveIntensity = emission;

    if (pointLightRef.current) {
      pointLightRef.current.intensity = emission * 2.2;
    }
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
      ref={crystalGroupRef}
      name="BioluminescentPlusGroup"
      position={[0, 1.45, 0.85]}
      onPointerOver={handlePointerOver as unknown as (e: unknown) => void}
      onPointerOut={handlePointerOut}
      onClick={handleClick as unknown as (e: unknown) => void}
    >
      {/* Outer Smoked Crystal Hull */}
      <mesh
        name="OuterCrystalHull"
        geometry={outerGeom}
        material={outerMat}
        castShadow
      />

      {/* Inner Concentric Emissive Core */}
      <mesh
        name="InnerEmissiveCore"
        geometry={coreGeom}
        material={coreMat}
      />

      {/* Embedded Volumetric Point Light */}
      <pointLight
        ref={pointLightRef}
        name="PlusPointLight"
        color={BRAND_COLORS.deepTeal}
        intensity={3.8}
        distance={6.0}
        decay={2.0}
      />
    </group>
  );
};
