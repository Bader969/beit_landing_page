import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ActiveLanguage, TelemetryState } from '../../types/telemetry';
import {
  createChampagneGoldMaterial,
  createSmokedGlassMaterial,
  createTypographyPlaqueGeometry,
  createTypographyBevelRimGeometry,
} from './scene-budget';

interface TypographyMorph3DProps {
  telemetry: TelemetryState;
}

export interface TypographyMorphState {
  latinOpacity: number;
  latinRotationY: number;
  latinScale: number;
  arabicOpacity: number;
  arabicRotationY: number;
  arabicScale: number;
  activeLanguage: ActiveLanguage;
}

/**
 * Pure mathematical helper for 3D typography morph state.
 * Evaluates interpolation between Latin ("BEIT PLUS") and Arabic ("بيت بلس مستشارك المنزلي في ألمانيا").
 */
export function calculateTypographyMorphState(
  lang: ActiveLanguage,
  morphFactor: number // 0.0 (Pure Latin) to 1.0 (Pure Arabic)
): TypographyMorphState {
  const t = Math.max(0, Math.min(1, morphFactor));
  const latinOpacity = Math.max(0, Math.min(1, 1.0 - t));
  const arabicOpacity = Math.max(0, Math.min(1, t));
  const latinRotationY = (t * Math.PI) / 2;
  const rawArabicRot = -((1.0 - t) * Math.PI) / 2;
  const arabicRotationY = Math.abs(rawArabicRot) < 1e-9 ? 0 : rawArabicRot;
  const latinScale = 1.0 - t * 0.3;
  const arabicScale = 0.7 + t * 0.3;

  return {
    latinOpacity,
    latinRotationY,
    latinScale,
    arabicOpacity,
    arabicRotationY,
    arabicScale,
    activeLanguage: lang,
  };
}

/**
 * Procedural Canvas Texture generator for crisp 3D text without external font downloads.
 */
function createProceduralTextTexture(
  text: string,
  isArabic: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle dark glass background
    ctx.fillStyle = 'rgba(11, 34, 56, 0.85)';
    ctx.beginPath();
    ctx.roundRect(16, 16, canvas.width - 32, canvas.height - 32, 48);
    ctx.fill();

    // Gold trim perimeter line
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#C7A55A';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isArabic) {
      // Arabic calligraphy typography
      ctx.direction = 'rtl';
      ctx.font = 'bold 72px "Cairo", "Noto Sans Arabic", "Tajawal", sans-serif';

      // Deep Teal glow shadow
      ctx.shadowColor = '#0F8A83';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#FAFAF7';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // Gold specular accent pass
      ctx.shadowColor = '#C7A55A';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#C7A55A';
      ctx.fillText('بيت بلس', canvas.width / 2, canvas.height / 2 - 58);

      ctx.font = '600 44px "Cairo", "Noto Sans Arabic", sans-serif';
      ctx.fillStyle = '#FAFAF7';
      ctx.fillText('مستشارك المنزلي في ألمانيا', canvas.width / 2, canvas.height / 2 + 48);
    } else {
      // Latin luxury typography
      ctx.direction = 'ltr';
      ctx.font = '900 110px "Inter", "Plus Jakarta Sans", sans-serif';

      // Gold specular gradient
      const grad = ctx.createLinearGradient(0, 100, 0, 400);
      grad.addColorStop(0, '#FAFAF7');
      grad.addColorStop(0.5, '#C7A55A');
      grad.addColorStop(1, '#A08035');

      ctx.shadowColor = '#0F8A83';
      ctx.shadowBlur = 32;
      ctx.fillStyle = grad;
      ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 25);

      // Subtitle
      ctx.font = '600 38px "Inter", sans-serif';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#C7A55A';
      ctx.fillStyle = '#0F8A83';
      ctx.fillText('DEUTSCHLANDS MULTI-UTILITY BROKER', canvas.width / 2, canvas.height / 2 + 85);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Fallback procedural basic canvas texture when running headless in node.
 */
function createHeadlessPlaceholderTexture(): THREE.Texture {
  const texture = new THREE.Texture();
  texture.needsUpdate = false;
  return texture;
}

export const TypographyMorph3D: React.FC<TypographyMorph3DProps> = ({ telemetry }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const latinGroupRef = useRef<THREE.Group>(null);
  const arabicGroupRef = useRef<THREE.Group>(null);

  // Materials & Geometries
  const smokedGlassMat = useMemo(() => createSmokedGlassMaterial(), []);
  const goldRimMat = useMemo(() => createChampagneGoldMaterial(0.35), []);
  const plaqueGeom = useMemo(() => createTypographyPlaqueGeometry(), []);
  const rimGeom = useMemo(() => createTypographyBevelRimGeometry(), []);

  // Textures
  const latinTexture = useMemo(() => {
    if (typeof document !== 'undefined') {
      return createProceduralTextTexture('BEIT PLUS', false);
    }
    return createHeadlessPlaceholderTexture();
  }, []);

  const arabicTexture = useMemo(() => {
    if (typeof document !== 'undefined') {
      return createProceduralTextTexture('بيت بلس مستشارك المنزلي في ألمانيا', true);
    }
    return createHeadlessPlaceholderTexture();
  }, []);

  const latinMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: latinTexture,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
      }),
    [latinTexture]
  );

  const arabicMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: arabicTexture,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
      }),
    [arabicTexture]
  );

  // Morph progress accumulator [0.0 = Latin, 1.0 = Arabic]
  const morphProgress = useRef(telemetry.activeLanguage === 'ar' ? 1.0 : 0.0);

  // Trigger re-render of canvas textures if language changes (ensures fonts are loaded)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      latinTexture.needsUpdate = true;
      arabicTexture.needsUpdate = true;
    }
  }, [telemetry.activeLanguage, latinTexture, arabicTexture]);

  useFrame((_, delta) => {
    const isArabic = telemetry.activeLanguage === 'ar';
    const targetMorph = isArabic ? 1.0 : 0.0;

    // Smooth critically-damped morphing transition
    morphProgress.current = THREE.MathUtils.damp(
      morphProgress.current,
      targetMorph,
      6.0,
      delta
    );

    const morphState = calculateTypographyMorphState(
      telemetry.activeLanguage,
      morphProgress.current
    );

    // Apply Latin transforms
    if (latinGroupRef.current) {
      latinMaterial.opacity = morphState.latinOpacity;
      latinGroupRef.current.rotation.y = morphState.latinRotationY;
      latinGroupRef.current.scale.setScalar(morphState.latinScale);
      latinGroupRef.current.visible = morphState.latinOpacity > 0.01;
    }

    // Apply Arabic transforms
    if (arabicGroupRef.current) {
      arabicMaterial.opacity = morphState.arabicOpacity;
      arabicGroupRef.current.rotation.y = morphState.arabicRotationY;
      arabicGroupRef.current.scale.setScalar(morphState.arabicScale);
      arabicGroupRef.current.visible = morphState.arabicOpacity > 0.01;
    }

    // Gentle floating breathing offset in Act III & V
    if (rootGroupRef.current) {
      const s = telemetry.scrollProgress;
      // In Act III (0.45 to 0.70), tilt slightly toward camera
      if (s >= 0.45 && s < 0.70) {
        rootGroupRef.current.position.y = 3.1 + Math.sin(Date.now() * 0.002) * 0.04;
      } else {
        rootGroupRef.current.position.y = 3.1;
      }
    }
  });

  return (
    <group
      ref={rootGroupRef}
      name="TypographyMorph3DRoot"
      position={[0, 3.1, 0.2]}
    >
      {/* LATIN BRANDMARK ("BEIT PLUS") */}
      <group ref={latinGroupRef} name="LatinTypographyGroup">
        {/* Smoked glass backplate */}
        <mesh geometry={plaqueGeom} material={smokedGlassMat} />
        {/* Champagne gold bevel perimeter rim */}
        <mesh geometry={rimGeom} material={goldRimMat} />
        {/* Text Plane */}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[2.34, 0.50]} />
          <primitive object={latinMaterial} attach="material" />
        </mesh>
      </group>

      {/* ARABIC CALLIGRAPHY ("بيت بلس مستشارك المنزلي في ألمانيا") */}
      <group ref={arabicGroupRef} name="ArabicTypographyGroup" visible={false}>
        {/* Smoked glass backplate */}
        <mesh geometry={plaqueGeom} material={smokedGlassMat} />
        {/* Champagne gold bevel perimeter rim */}
        <mesh geometry={rimGeom} material={goldRimMat} />
        {/* Text Plane */}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[2.34, 0.50]} />
          <primitive object={arabicMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
};
