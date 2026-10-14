import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TelemetryState } from '../../types/telemetry';
import { createContractSheetGeometry } from './scene-budget';

interface BureaucraticNoiseProps {
  telemetry: TelemetryState;
}

interface SheetState {
  initialPos: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  phase: number;
}

/**
 * Evaluates contract sheet absorption convergence toward glowing Plus crystal in Act IV (0.70 to 0.90).
 */
export function calculateContractConvergence(scrollProgress: number): number {
  if (scrollProgress >= 0.70 && scrollProgress < 0.90) {
    return (scrollProgress - 0.70) / 0.20;
  }
  if (scrollProgress >= 0.90) {
    return 1.0;
  }
  return 0.0;
}

/**
 * Evaluates 3-frequency harmonic tumbling rotation for bureaucratic contract sheets.
 */
export function calculateHarmonicTumble(
  t: number,
  phase: number
): [number, number, number] {
  const DEG_TO_RAD = Math.PI / 180;
  const rx = Math.sin(0.4 * t + phase) * (18 * DEG_TO_RAD);
  const ry = Math.cos(0.3 * t + phase) * (22 * DEG_TO_RAD);
  const rz = Math.sin(0.5 * t + phase) * (12 * DEG_TO_RAD);
  return [rx, ry, rz];
}

/**
 * BureaucraticNoise:
 * 24 floating contract sheets drifting in the outer periphery.
 * In Act I: subtle chaotic drifting emulating bureaucratic noise.
 * In Act IV: convergence toward the central Plus crystal [0, 1.45, 0.85]
 * and conversion into golden particle streams (#C7A55A).
 */
export const BureaucraticNoise: React.FC<BureaucraticNoiseProps> = ({ telemetry }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sheetGeom = useMemo(() => createContractSheetGeometry(), []);

  const sheetMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8C9BAE'),
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      }),
    []
  );

  const sheets = useMemo<SheetState[]>(() => {
    const list: SheetState[] = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.6 + ((i * 17) % 7) * 0.25;
      const x = radius * Math.cos(angle);
      const y = -0.5 + ((i * 13) % 11) * 0.35;
      const z = radius * Math.sin(angle);

      list.push({
        initialPos: new THREE.Vector3(x, y, z),
        rotationSpeed: new THREE.Vector3(
          0.18 + ((i * 3) % 5) * 0.08,
          0.14 + ((i * 7) % 5) * 0.08,
          0.08 + ((i * 11) % 5) * 0.08
        ),
        phase: i * 0.45,
      });
    }
    return list;
  }, []);

  const timeAcc = useRef(0);

  useFrame((_, delta) => {
    timeAcc.current += delta;
    const t = timeAcc.current;
    const s = telemetry.scrollProgress;

    // Act IV convergence factor
    const convergeFactor = calculateContractConvergence(s);

    if (groupRef.current) {
      const targetPos = new THREE.Vector3(0, 1.45, 0.85); // Plus notch
      const children = groupRef.current.children;

      for (let i = 0; i < children.length && i < sheets.length; i++) {
        const mesh = children[i] as THREE.Mesh;
        const sheet = sheets[i];

        // Normal floating drift
        const driftY = Math.sin(t * 1.2 + sheet.phase) * 0.18;
        const driftX = Math.cos(t * 0.9 + sheet.phase) * 0.12;

        const currentPos = sheet.initialPos.clone();
        currentPos.x += driftX;
        currentPos.y += driftY;

        // Converge toward target notch in Act IV
        mesh.position.lerpVectors(currentPos, targetPos, convergeFactor);

        // 3-frequency harmonic tumbling combined with slow tumble speed
        const [hrx, hry, hrz] = calculateHarmonicTumble(t, sheet.phase);
        mesh.rotation.x = hrx + t * sheet.rotationSpeed.x;
        mesh.rotation.y = hry + t * sheet.rotationSpeed.y;
        mesh.rotation.z = hrz + t * sheet.rotationSpeed.z;

        // Dissolve scale and opacity in Act IV
        const scaleVal = Math.max(0.01, 1.0 - convergeFactor * 0.95);
        mesh.scale.setScalar(scaleVal);
      }

      // Material opacity fades as sheets are absorbed
      sheetMat.opacity = Math.max(0.05, 0.65 * (1.0 - convergeFactor));
    }
  });

  return (
    <group ref={groupRef} name="BureaucraticNoiseGroup">
      {sheets.map((_, idx) => (
        <mesh
          key={`contract-sheet-${idx}`}
          geometry={sheetGeom}
          material={sheetMat}
        />
      ))}
    </group>
  );
};
