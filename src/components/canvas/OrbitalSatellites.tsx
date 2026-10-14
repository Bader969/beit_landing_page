import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { antigravityController } from '../../store/antigravity-controller';
import { HoverTarget, TelemetryState } from '../../types/telemetry';
import {
  BRAND_COLORS,
  createChampagneGoldMaterial,
  createPearlGlassMaterial,
  createAnodizedCharcoalMaterial,
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
} from './scene-budget';

interface OrbitalSatellitesProps {
  telemetry: TelemetryState;
}

/**
 * Dual-peak realistic heartbeat pulse formula:
 * pulse(t) = exp(-18 * (mod(t, 1.25))^2) + 0.65 * exp(-24 * (mod(t, 1.25) - 0.22)^2)
 */
export function calculateHeartbeatPulse(t: number): number {
  const period = 1.25;
  const phase = t % period;
  const p1 = Math.exp(-18 * phase * phase);
  const p2 = 0.65 * Math.exp(-24 * Math.pow(phase - 0.22, 2));
  return p1 + p2;
}

export const OrbitalSatellites: React.FC<OrbitalSatellitesProps> = ({ telemetry }) => {
  // References for the 4 satellite groups
  const energyGroupRef = useRef<THREE.Group>(null);
  const healthGroupRef = useRef<THREE.Group>(null);
  const mobilityGroupRef = useRef<THREE.Group>(null);
  const telecomGroupRef = useRef<THREE.Group>(null);

  // Sub-element references
  const plasmaOrbRef = useRef<THREE.Mesh>(null);
  const healthCocoonRef = useRef<THREE.Mesh>(null);
  const healthCrossRef = useRef<THREE.Mesh>(null);
  const mobilityShieldRef = useRef<THREE.Group>(null);
  const microHexGroupRef = useRef<THREE.Group>(null);
  const telecomWebLinesRef = useRef<THREE.LineSegments>(null);

  // 1. Geometries
  const energyTubeGeom = useMemo(() => createEnergyTubeGeometry(), []);
  const plasmaOrbGeom = useMemo(() => createPlasmaOrbGeometry(), []);
  const energyCurve = useMemo(() => createEnergySpline(), []);

  const healthSphereGeom = useMemo(() => createHealthSphereGeometry(), []);
  const healthCrossGeom = useMemo(() => createHealthCrossGeometry(), []);

  const mobilityHexGeom = useMemo(() => createMobilityHexGeometry(), []);
  const mobilityRimGeom = useMemo(() => createMobilityRimGeometry(), []);
  const microHexGeom = useMemo(() => createMicroHexGeometry(), []);

  const telecomHubGeom = useMemo(() => createTelecomHubGeometry(), []);
  const telecomRingGeom = useMemo(() => createTelecomRingGeometry(), []);
  const telecomNodeGeom = useMemo(() => createTelecomNodeGeometry(), []);

  // Guide rings
  const orbitGuide1Geom = useMemo(() => createOrbitGuideGeometry(2.4), []);
  const orbitGuide2Geom = useMemo(() => createOrbitGuideGeometry(3.1), []);
  const orbitGuide3Geom = useMemo(() => createOrbitGuideGeometry(3.8), []);
  const orbitGuide4Geom = useMemo(() => createOrbitGuideGeometry(4.5), []);

  // 2. Materials
  const energyTubeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(BRAND_COLORS.deepTeal),
        emissive: new THREE.Color(BRAND_COLORS.deepTeal),
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.6,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const plasmaOrbMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(BRAND_COLORS.electricCyan),
      }),
    []
  );

  const pearlGlassMat = useMemo(() => createPearlGlassMaterial(), []);

  const healthCrossMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(BRAND_COLORS.deepTeal),
        emissive: new THREE.Color(BRAND_COLORS.deepTeal),
        emissiveIntensity: 1.8,
      }),
    []
  );

  const charcoalMat = useMemo(() => createAnodizedCharcoalMaterial(), []);
  const goldMat = useMemo(() => createChampagneGoldMaterial(0.35), []);

  const guideRingMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(BRAND_COLORS.champagneGold),
        transparent: true,
        opacity: 0.18,
      }),
    []
  );

  const telecomLineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(BRAND_COLORS.deepTeal),
        transparent: true,
        opacity: 0.65,
      }),
    []
  );

  // Constellation 12 micro-nodes positions
  const constellationNodes = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 0.55 + 0.15 * Math.sin(i * 3);
      const x = r * Math.cos(angle);
      const y = 0.18 * Math.sin(i * 2);
      const z = r * Math.sin(angle);
      nodes.push(new THREE.Vector3(x, y, z));
    }
    return nodes;
  }, []);

  // Fiber-optic lines connecting constellation nodes
  const constellationLinesGeom = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < constellationNodes.length; i++) {
      for (let j = i + 1; j < constellationNodes.length; j++) {
        const dist = constellationNodes[i].distanceTo(constellationNodes[j]);
        if (dist < 0.62) {
          points.push(constellationNodes[i], constellationNodes[j]);
        }
      }
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [constellationNodes]);

  // Sparks points for Energy Filament
  const sparkPointsGeom = useMemo(() => {
    const coords: number[] = [];
    for (let i = 0; i < 48; i++) {
      coords.push(
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.35
      );
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
    return geom;
  }, []);

  const sparkMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(BRAND_COLORS.electricCyan),
        size: 0.04,
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  // Scratch registers for per-frame updates
  const timeAcc = useRef(0);
  const deconProgress = useRef(0);

  // Helper for hover handlers
  const handleHover = (target: HoverTarget) => {
    antigravityController.setHoverTarget(target);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = target ? 'pointer' : 'default';
    }
  };

  useFrame((_, delta) => {
    timeAcc.current += delta;
    const t = timeAcc.current;
    const s = telemetry.scrollProgress;

    // Act II Deconstruction transition factor
    let targetDecon = 0.0;
    if (s >= 0.20 && s < 0.45) {
      targetDecon = (s - 0.20) / 0.25;
    } else if (s >= 0.45 && s < 0.70) {
      targetDecon = 1.0;
    } else {
      targetDecon = 0.0;
    }
    deconProgress.current = THREE.MathUtils.damp(deconProgress.current, targetDecon, 5.0, delta);
    const d = deconProgress.current;

    const currentHover = telemetry.hoverTarget;

    // --- SATELLITE 1: ENERGY FILAMENT ---
    if (energyGroupRef.current) {
      const isHovered = currentHover === 'energy';
      const isOtherHovered = currentHover !== null && !isHovered;
      const targetScale = isHovered ? 1.24 : isOtherHovered ? 0.88 : 1.0;
      energyGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Orbital position / docking position in Act II: [-2.4, 1.4, 0.0]
      const orbitPos = new THREE.Vector3(0, 0, 0);
      const dockPos = new THREE.Vector3(-2.4, 1.4, 0.0);
      energyGroupRef.current.position.lerpVectors(orbitPos, dockPos, d);

      // Traversal of plasma orb along spline curve
      if (plasmaOrbRef.current) {
        const u = (t * 0.18) % 1.0;
        const pt = energyCurve.getPointAt(u);
        plasmaOrbRef.current.position.copy(pt);
      }
    }

    // --- SATELLITE 2: HEALTH COCOON ---
    if (healthGroupRef.current) {
      const isHovered = currentHover === 'health';
      const isOtherHovered = currentHover !== null && !isHovered;
      const targetScale = isHovered ? 1.24 : isOtherHovered ? 0.88 : 1.0;

      // Heartbeat pulse calculation
      const pulse = calculateHeartbeatPulse(t);
      const pulseScale = 1.0 + pulse * 0.22;

      healthGroupRef.current.scale.lerp(
        new THREE.Vector3(targetScale * pulseScale, targetScale * pulseScale, targetScale * pulseScale),
        0.15
      );

      // Emissive boost on pulse
      healthCrossMat.emissiveIntensity = 1.4 + pulse * 2.2;

      // Orbit movement
      const r2 = 3.1;
      const w2 = 0.42;
      const angle2 = t * w2;
      const orbitPos = new THREE.Vector3(
        r2 * Math.cos(angle2),
        0.6 * Math.sin(angle2 * 2),
        r2 * Math.sin(angle2)
      );
      // Docking position in Act II: [+2.4, 1.4, 0.0]
      const dockPos = new THREE.Vector3(2.4, 1.4, 0.0);
      healthGroupRef.current.position.lerpVectors(orbitPos, dockPos, d);
    }

    // --- SATELLITE 3: MOBILITY HEX-PLATE ---
    if (mobilityGroupRef.current) {
      const isHovered = currentHover === 'mobility';
      const isOtherHovered = currentHover !== null && !isHovered;
      const targetScale = isHovered ? 1.24 : isOtherHovered ? 0.88 : 1.0;
      mobilityGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Orbit movement
      const r3 = 3.8;
      const w3 = 0.32;
      const angle3 = t * w3 + Math.PI * 0.65;
      const orbitPos = new THREE.Vector3(
        r3 * Math.cos(angle3),
        -0.4 * Math.sin(angle3),
        r3 * Math.sin(angle3)
      );
      // Docking position in Act II: [-2.4, -1.2, 0.0]
      const dockPos = new THREE.Vector3(-2.4, -1.2, 0.0);
      mobilityGroupRef.current.position.lerpVectors(orbitPos, dockPos, d);

      // Local rotation
      if (mobilityShieldRef.current) {
        mobilityShieldRef.current.rotation.y = t * 0.75;
        mobilityShieldRef.current.rotation.x = Math.sin(t * 0.5) * 0.25;
      }

      // Micro hexes orbiting around the main shield
      if (microHexGroupRef.current) {
        microHexGroupRef.current.rotation.z = -t * 1.2;
      }
    }

    // --- SATELLITE 4: TELECOM NODE ---
    if (telecomGroupRef.current) {
      const isHovered = currentHover === 'telecom';
      const isOtherHovered = currentHover !== null && !isHovered;
      const targetScale = isHovered ? 1.24 : isOtherHovered ? 0.88 : 1.0;
      telecomGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Orbit movement
      const r4 = 4.5;
      const w4 = 0.22;
      const angle4 = t * w4 + Math.PI * 1.35;
      const orbitPos = new THREE.Vector3(
        r4 * Math.cos(angle4),
        0.8 * Math.sin(angle4 * 1.5),
        r4 * Math.sin(angle4)
      );
      // Docking position in Act II: [+2.4, -1.2, 0.0]
      const dockPos = new THREE.Vector3(2.4, -1.2, 0.0);
      telecomGroupRef.current.position.lerpVectors(orbitPos, dockPos, d);

      // Pulse opacity on fiber-optic web lines
      telecomLineMat.opacity = 0.35 + 0.45 * Math.abs(Math.sin(t * 2.5));
    }
  });

  return (
    <group name="OrbitalSatellitesRoot">
      {/* 1. ENERGY FILAMENT (Strom & Gas) */}
      <group
        ref={energyGroupRef}
        name="Orbit1_EnergyFilament"
        rotation={[Math.PI * 0.12, 0, -Math.PI * 0.08]}
      >
        {/* Orbital Guide Ring */}
        <mesh geometry={orbitGuide1Geom} material={guideRingMat} rotation={[Math.PI / 2, 0, 0]} />

        {/* Spline Tube Geometry */}
        <mesh
          geometry={energyTubeGeom}
          material={energyTubeMat}
          onPointerOver={(e) => {
            e.stopPropagation();
            handleHover('energy');
          }}
          onPointerOut={() => handleHover(null)}
        />

        {/* Orbiting Plasma Node & Sparks */}
        <mesh
          ref={plasmaOrbRef}
          geometry={plasmaOrbGeom}
          material={plasmaOrbMat}
          onPointerOver={(e) => {
            e.stopPropagation();
            handleHover('energy');
          }}
          onPointerOut={() => handleHover(null)}
        >
          <points geometry={sparkPointsGeom} material={sparkMat} />
        </mesh>
      </group>

      {/* 2. HEALTH COCOON (Krankenkasse) */}
      <group
        ref={healthGroupRef}
        name="Orbit2_HealthCocoon"
        onPointerOver={(e) => {
          e.stopPropagation();
          handleHover('health');
        }}
        onPointerOut={() => handleHover(null)}
      >
        {/* Semi-translucent Pearl Glass Sphere */}
        <mesh
          ref={healthCocoonRef}
          geometry={healthSphereGeom}
          material={pearlGlassMat}
          castShadow
        />

        {/* Inner Glowing 3D Medical Cross */}
        <mesh
          ref={healthCrossRef}
          geometry={healthCrossGeom}
          material={healthCrossMat}
        />

        {/* Gold Ring Trim on Cocoon */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={goldMat}>
          <torusGeometry args={[0.33, 0.012, 6, 32]} />
        </mesh>
      </group>

      {/* 3. MOBILITY HEX-PLATE (KFZ & Sachwerte) */}
      <group
        ref={mobilityGroupRef}
        name="Orbit3_MobilityHexPlate"
        onPointerOver={(e) => {
          e.stopPropagation();
          handleHover('mobility');
        }}
        onPointerOut={() => handleHover(null)}
      >
        <group ref={mobilityShieldRef}>
          {/* Anodized Charcoal Hexagonal Core */}
          <mesh
            geometry={mobilityHexGeom}
            material={charcoalMat}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          />

          {/* Champagne Gold Bevel Rim */}
          <mesh
            geometry={mobilityRimGeom}
            material={goldMat}
            rotation={[Math.PI / 2, 0, 0]}
          />

          {/* 3 Orbiting Micro-Hexagon Satellites */}
          <group ref={microHexGroupRef}>
            {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => {
              const dist = 0.65;
              const x = dist * Math.cos(angle);
              const y = dist * Math.sin(angle);
              return (
                <mesh
                  key={`micro-hex-${idx}`}
                  position={[x, y, 0]}
                  geometry={microHexGeom}
                  material={charcoalMat}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <mesh
                    geometry={microHexGeom}
                    material={goldMat}
                    scale={[1.1, 1.1, 1.1]}
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      </group>

      {/* 4. TELECOM & DIGITAL HOME NODE (Hausrat & DSL) */}
      <group
        ref={telecomGroupRef}
        name="Orbit4_TelecomNode"
        onPointerOver={(e) => {
          e.stopPropagation();
          handleHover('telecom');
        }}
        onPointerOut={() => handleHover(null)}
      >
        {/* Central Hub Sphere */}
        <mesh geometry={telecomHubGeom} material={pearlGlassMat} />

        {/* Equatorial Gold Ring */}
        <mesh geometry={telecomRingGeom} material={goldMat} rotation={[Math.PI / 2, 0, 0]} />

        {/* Connecting Fiber-Optic Constellation Web Lines */}
        <lineSegments
          ref={telecomWebLinesRef}
          geometry={constellationLinesGeom}
          material={telecomLineMat}
        />

        {/* 12 Micro-Nodes */}
        {constellationNodes.map((pos, idx) => (
          <mesh
            key={`telecom-node-${idx}`}
            position={[pos.x, pos.y, pos.z]}
            geometry={telecomNodeGeom}
            material={plasmaOrbMat}
          />
        ))}
      </group>

      {/* Static Concentric Guide Rings for Orbits 2, 3, 4 */}
      <group name="ConcentricOrbitGuides">
        <mesh
          geometry={orbitGuide2Geom}
          material={guideRingMat}
          rotation={[-Math.PI * 0.15, Math.PI * 0.18, 0]}
        />
        <mesh
          geometry={orbitGuide3Geom}
          material={guideRingMat}
          rotation={[Math.PI * 0.22, 0, Math.PI * 0.16]}
        />
        <mesh
          geometry={orbitGuide4Geom}
          material={guideRingMat}
          rotation={[-Math.PI * 0.06, 0, Math.PI * 0.35]}
        />
      </group>
    </group>
  );
};
