import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TelemetryState } from '../../types/telemetry';
import { BRAND_COLORS, createGoldenStreamRibbonGeometry } from './scene-budget';

interface GoldenLightStreamsProps {
  telemetry: TelemetryState;
}

/**
 * Pure mathematical calculation of golden light stream intensity across scroll progress.
 * Ramps up in Act IV (0.70 - 0.90) and fades cleanly outside.
 */
export function calculateGoldenLightStreamIntensity(scrollProgress: number): number {
  if (scrollProgress < 0.70 || scrollProgress > 0.93) {
    return 0.0;
  }
  if (scrollProgress >= 0.70 && scrollProgress <= 0.82) {
    return (scrollProgress - 0.70) / 0.12;
  }
  return Math.max(0.0, 1.0 - (scrollProgress - 0.82) / 0.11);
}

export const GoldenLightStreams: React.FC<GoldenLightStreamsProps> = ({ telemetry }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ribbonGeom = useMemo(() => createGoldenStreamRibbonGeometry(), []);

  // Material for the golden light ribbons
  const ribbonMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(BRAND_COLORS.champagneGold),
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  // Particles moving along golden streams
  const PARTICLE_COUNT = 400;
  const { particleGeom, particleInitialData } = useMemo(() => {
    const coords = new Float32Array(PARTICLE_COUNT * 3);
    const initialData: { progress: number; speed: number; radius: number; angle: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = Math.random();
      const speed = 0.25 + Math.random() * 0.45;
      const radius = 0.15 + Math.random() * 0.45;
      const angle = Math.random() * Math.PI * 2;
      initialData.push({ progress: p, speed, radius, angle });

      coords[i * 3 + 0] = Math.cos(angle) * radius;
      coords[i * 3 + 1] = 1.45 - p * 1.25;
      coords[i * 3 + 2] = 0.85 + p * 2.8;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(coords, 3));
    return { particleGeom: geom, particleInitialData: initialData };
  }, []);

  const particleMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(BRAND_COLORS.champagneGold),
        size: 0.065,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const timeAcc = useRef(0);
  const currentIntensity = useRef(0.0);

  useFrame((_, delta) => {
    timeAcc.current += delta;
    const t = timeAcc.current;
    const targetIntensity = calculateGoldenLightStreamIntensity(telemetry.scrollProgress);

    currentIntensity.current = THREE.MathUtils.damp(
      currentIntensity.current,
      targetIntensity,
      5.0,
      delta
    );
    const intensity = currentIntensity.current;

    // Apply opacity
    ribbonMat.opacity = intensity * 0.75;
    particleMat.opacity = intensity * 0.90;

    if (groupRef.current) {
      groupRef.current.visible = intensity > 0.005;

      // Animate ribbons undulating
      const children = groupRef.current.children;
      for (let i = 0; i < 6 && i < children.length; i++) {
        const ribbon = children[i] as THREE.Mesh;
        ribbon.rotation.z = Math.sin(t * 1.8 + i) * 0.15;
        ribbon.scale.set(1.0, 1.0 + Math.sin(t * 2.2 + i * 0.8) * 0.18, 1.0);
      }
    }

    // Update particle positions along forward spline
    const posAttr = particleGeom.getAttribute('position') as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const data = particleInitialData[i];
      data.progress = (data.progress + delta * data.speed) % 1.0;
      const p = data.progress;

      // Curve path from Plus notch [0, 1.45, 0.85] toward front [0, 0.2, 3.5]
      const spread = (1.0 - p) * 0.35 + p * 0.85;
      const x = Math.cos(data.angle + t * 0.5) * data.radius * spread;
      const y = THREE.MathUtils.lerp(1.45, 0.25, p) + Math.sin(p * Math.PI) * 0.25;
      const z = THREE.MathUtils.lerp(0.85, 3.6, p);

      array[i * 3 + 0] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }
    posAttr.needsUpdate = true;
  });

  // 6 radial stream ribbons originating at Plus notch [0, 1.45, 0.85]
  const ribbons = useMemo(() => {
    return [0, 1, 2, 3, 4, 5].map((idx) => {
      const angle = (idx / 6) * Math.PI * 2;
      return {
        key: `stream-ribbon-${idx}`,
        position: [
          Math.cos(angle) * 0.22,
          1.45 - 0.45,
          0.85 + 0.85,
        ] as [number, number, number],
        rotation: [Math.PI * 0.35, 0, angle] as [number, number, number],
      };
    });
  }, []);

  return (
    <group ref={groupRef} name="GoldenLightStreamsRoot">
      {/* 6 Curved Stream Ribbons */}
      {ribbons.map((r) => (
        <mesh
          key={r.key}
          geometry={ribbonGeom}
          material={ribbonMat}
          position={r.position}
          rotation={r.rotation}
        />
      ))}

      {/* 400+ Flowing Golden Particle Quad Points */}
      <points geometry={particleGeom} material={particleMat} />
    </group>
  );
};
