import React, { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TelemetryState, ActiveLanguage } from '../../types/telemetry';
import { BRAND_COLORS } from './scene-budget';
import { StudioEnvironment } from './StudioEnvironment';
import { ArchitecturalSanctuary } from './ArchitecturalSanctuary';
import { BioluminescentPlus } from './BioluminescentPlus';
import { OrbitalSatellites } from './OrbitalSatellites';
import { BureaucraticNoise } from './BureaucraticNoise';
import { TypographyMorph3D } from './TypographyMorph3D';
import { GoldenLightStreams } from './GoldenLightStreams';

interface SceneContainerProps {
  telemetry: TelemetryState;
}

export interface CameraTrajectoryState {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

/**
 * Pure calculation of 5-Act camera trajectory waypoints, lookAt targets, and FOV.
 * Fully supports RTL mirroring when activeLanguage === 'ar'.
 */
export function calculateCameraTrajectory(
  s: number,
  activeLanguage: ActiveLanguage
): CameraTrajectoryState {
  const isArabic = activeLanguage === 'ar';
  const rtl = isArabic ? -1.0 : 1.0;

  if (s < 0.20) {
    // Act I: 35mm low-angle framing looking up at sanctuary [0, -0.6 -> 0.2, 7.0 -> 6.2]
    const p = s / 0.20;
    return {
      position: [
        0,
        THREE.MathUtils.lerp(-0.6, 0.2, p),
        THREE.MathUtils.lerp(7.0, 6.2, p),
      ],
      lookAt: [0, THREE.MathUtils.lerp(0.65, 0.55, p), 0],
      fov: 38,
    };
  }

  if (s < 0.45) {
    // Act II: 45° luxury isometric dolly rotation
    const p = (s - 0.20) / 0.25;
    const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
    return {
      position: [
        THREE.MathUtils.lerp(0, 4.5 * rtl, smoothP),
        THREE.MathUtils.lerp(0.2, 3.8, smoothP),
        THREE.MathUtils.lerp(6.2, 4.5, smoothP),
      ],
      lookAt: [0, 0.45, 0],
      fov: THREE.MathUtils.lerp(38, 42, smoothP),
    };
  }

  if (s < 0.70) {
    // Act III: 180° cinematic orbit around sanctuary
    const p = (s - 0.45) / 0.25;
    const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
    return {
      position: [
        THREE.MathUtils.lerp(4.5 * rtl, -4.2 * rtl, smoothP),
        THREE.MathUtils.lerp(3.8, 2.2, smoothP),
        THREE.MathUtils.lerp(4.5, -4.8, smoothP),
      ],
      lookAt: [0, 0.45, 0],
      fov: THREE.MathUtils.lerp(42, 44, smoothP),
    };
  }

  if (s < 0.90) {
    // Act IV: Panoramic wide-angle pull-back
    const p = (s - 0.70) / 0.20;
    const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
    return {
      position: [
        THREE.MathUtils.lerp(-4.2 * rtl, 0, smoothP),
        THREE.MathUtils.lerp(2.2, 3.4, smoothP),
        THREE.MathUtils.lerp(-4.8, 9.8, smoothP),
      ],
      lookAt: [0, 0.35, 0],
      fov: THREE.MathUtils.lerp(44, 48, smoothP),
    };
  }

  // Act V: Direct Teleport & Intimate resting hero anchor state
  const p = (s - 0.90) / 0.10;
  const smoothP = THREE.MathUtils.smoothstep(p, 0, 1);
  return {
    position: [
      0,
      THREE.MathUtils.lerp(3.4, 1.0, smoothP),
      THREE.MathUtils.lerp(9.8, 5.2, smoothP),
    ],
    lookAt: [0, 0.45, 0],
    fov: THREE.MathUtils.lerp(48, 38, smoothP),
  };
}

/**
 * CameraRig:
 * Handles 5-Act camera path interpolation, 180° orbit, and mouse inertia damping.
 */
const CameraRig: React.FC<{ telemetry: TelemetryState }> = ({ telemetry }) => {
  const { camera } = useThree();

  // Mouse normalized coordinates [-1, 1]
  const pointerPos = useRef({ x: 0, y: 0 });
  const smoothedPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      pointerPos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerPos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Pre-allocated vectors for zero-garbage collection in useFrame
  const targetCamPos = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3(0, 0.45, 0));

  useFrame((_, delta) => {
    // 1. Smooth mouse damping
    smoothedPointer.current.x = THREE.MathUtils.damp(
      smoothedPointer.current.x,
      pointerPos.current.x,
      4.0,
      delta
    );
    smoothedPointer.current.y = THREE.MathUtils.damp(
      smoothedPointer.current.y,
      pointerPos.current.y,
      4.0,
      delta
    );

    const s = telemetry.scrollProgress;
    const trajectory = calculateCameraTrajectory(s, telemetry.activeLanguage);

    targetCamPos.current.set(
      trajectory.position[0],
      trajectory.position[1],
      trajectory.position[2]
    );
    lookAtTarget.current.set(
      trajectory.lookAt[0],
      trajectory.lookAt[1],
      trajectory.lookAt[2]
    );

    // Update perspective camera FOV
    const perspCam = camera as THREE.PerspectiveCamera;
    if (perspCam.isPerspectiveCamera && Math.abs(perspCam.fov - trajectory.fov) > 0.05) {
      perspCam.fov = THREE.MathUtils.damp(perspCam.fov, trajectory.fov, 4.0, delta);
      perspCam.updateProjectionMatrix();
    }

    // Add subtle camera inertia offset based on pointer
    const camOffsetMultiplier = s < 0.20 ? 0.45 : 0.25;
    const offsetCamX = smoothedPointer.current.x * camOffsetMultiplier;
    const offsetCamY = smoothedPointer.current.y * (camOffsetMultiplier * 0.6);

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetCamPos.current.x + offsetCamX,
      4.0,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetCamPos.current.y + offsetCamY,
      4.0,
      delta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetCamPos.current.z,
      4.0,
      delta
    );

    camera.lookAt(lookAtTarget.current);
  });

  return null;
};

/**
 * InertiaTiltRig:
 * Applies cursor inertia tilting up to ±14° (±0.2443 rad) and magnetic beacon attraction
 * toward cursor with critical damping.
 */
const InertiaTiltRig: React.FC<{ telemetry: TelemetryState; children: React.ReactNode }> = ({
  telemetry,
  children,
}) => {
  const tiltGroupRef = useRef<THREE.Group>(null);
  const pointerPos = useRef({ x: 0, y: 0 });
  const smoothedPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      pointerPos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerPos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  useFrame((_, delta) => {
    if (!tiltGroupRef.current) return;

    smoothedPointer.current.x = THREE.MathUtils.damp(
      smoothedPointer.current.x,
      pointerPos.current.x,
      5.0,
      delta
    );
    smoothedPointer.current.y = THREE.MathUtils.damp(
      smoothedPointer.current.y,
      pointerPos.current.y,
      5.0,
      delta
    );

    // Act I allows full ±14° (0.2443 rad) tilt; subsequent acts maintain gentle tilt
    const MAX_TILT_RAD = 14 * (Math.PI / 180); // 0.244346 rad
    const maxTilt = telemetry.scrollProgress < 0.20 ? MAX_TILT_RAD : MAX_TILT_RAD * 0.5;

    const targetRotY = smoothedPointer.current.x * maxTilt;
    const targetRotX = -smoothedPointer.current.y * (maxTilt * 0.7);

    tiltGroupRef.current.rotation.y = THREE.MathUtils.damp(
      tiltGroupRef.current.rotation.y,
      targetRotY,
      5.0,
      delta
    );
    tiltGroupRef.current.rotation.x = THREE.MathUtils.damp(
      tiltGroupRef.current.rotation.x,
      targetRotX,
      5.0,
      delta
    );

    // Magnetic beacon attraction toward cursor with critical damping
    const beaconMultiplierX = telemetry.scrollProgress < 0.20 ? 0.28 : 0.12;
    const beaconMultiplierY = telemetry.scrollProgress < 0.20 ? -0.18 : -0.08;
    const targetPosX = smoothedPointer.current.x * beaconMultiplierX;
    const targetPosY = smoothedPointer.current.y * beaconMultiplierY;

    tiltGroupRef.current.position.x = THREE.MathUtils.damp(
      tiltGroupRef.current.position.x,
      targetPosX,
      5.0,
      delta
    );
    tiltGroupRef.current.position.y = THREE.MathUtils.damp(
      tiltGroupRef.current.position.y,
      targetPosY,
      5.0,
      delta
    );
  });

  return <group ref={tiltGroupRef}>{children}</group>;
};

/**
 * PerformanceMonitorHelper:
 * Tracks triangles and draw calls from WebGLRenderer info.
 */
const PerformanceMonitorHelper: React.FC = () => {
  const { gl } = useThree();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __BEIT_3D_RENDERER_INFO__?: unknown }).__BEIT_3D_RENDERER_INFO__ = () => ({
        triangles: gl.info.render.triangles,
        points: gl.info.render.points,
        lines: gl.info.render.lines,
        calls: gl.info.render.calls,
        frame: gl.info.render.frame,
      });
    }
  }, [gl]);

  return null;
};

/**
 * SceneContainer:
 * Root WebGL Canvas mounting the procedural 3D Architectural Sanctuary,
 * Bioluminescent Plus crystal, 4 concentric orbital satellites,
 * 3D Typography morphing, and golden light streams.
 */
export const SceneContainer: React.FC<SceneContainerProps> = ({ telemetry }) => {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      <Canvas
        dpr={[1, typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 2]}
        camera={{ position: [0, 1.2, 5.5], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full pointer-events-auto"
      >
        <Suspense fallback={null}>
          {/* Procedural Reflection Studio Environment (Zero External Textures) */}
          <StudioEnvironment />

          {/* Lighting Rig */}
          {/* Key Light: High-clarity off-white directional light */}
          <directionalLight
            name="KeyDirectionalLight"
            position={[5, 8, 6]}
            intensity={2.2}
            color={BRAND_COLORS.offWhite}
            castShadow
          />

          {/* Gold Rim Bounce Light */}
          <directionalLight
            name="GoldRimLight"
            position={[-4, 3, -4]}
            intensity={3.0}
            color={BRAND_COLORS.champagneGold}
          />

          {/* Navy Ambient Fill Light */}
          <ambientLight
            name="NavyAmbientFill"
            intensity={0.9}
            color="#0A1628"
          />

          {/* Camera Controller & Path Interpolation */}
          <CameraRig telemetry={telemetry} />

          {/* Performance & Diagnostic Info */}
          <PerformanceMonitorHelper />

          {/* Interactive Mouse Inertia Tilt Rig */}
          <InertiaTiltRig telemetry={telemetry}>
            {/* House Monolith Chassis & Modular Sub-Meshes */}
            <ArchitecturalSanctuary telemetry={telemetry} />

            {/* Bioluminescent Greek Cross Crystal */}
            <BioluminescentPlus telemetry={telemetry} />

            {/* 4 Concentric Orbital Satellites */}
            <OrbitalSatellites telemetry={telemetry} />

            {/* Bureaucratic Contract Noise */}
            <BureaucraticNoise telemetry={telemetry} />

            {/* 3D Brandmark Typography Morph (Latin <-> Arabic Calligraphy) */}
            <TypographyMorph3D telemetry={telemetry} />

            {/* Act IV Golden Light Streams (Absorbed Contracts -> CRM Portal) */}
            <GoldenLightStreams telemetry={telemetry} />
          </InertiaTiltRig>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneContainer;
