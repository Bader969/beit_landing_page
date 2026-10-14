import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Creates a procedural 512x256 studio reflection map using HTML5 Canvas.
 * Emulates high-end studio lighting strips in Midnight Navy (#0F2D4A),
 * Deep Teal (#0F8A83), and Champagne Gold (#C7A55A) with zero network downloads.
 */
export function createProceduralStudioTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background gradient: Midnight Navy to Obsidian Deep
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
  bgGrad.addColorStop(0, '#061320');
  bgGrad.addColorStop(0.35, '#0F2D4A');
  bgGrad.addColorStop(0.65, '#0B2238');
  bgGrad.addColorStop(1, '#071524');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 256);

  // Soft Champagne Gold studio bounce strip
  const goldGrad = ctx.createLinearGradient(0, 140, 0, 210);
  goldGrad.addColorStop(0, 'rgba(199, 165, 90, 0.0)');
  goldGrad.addColorStop(0.5, 'rgba(199, 165, 90, 0.45)');
  goldGrad.addColorStop(1, 'rgba(199, 165, 90, 0.0)');
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 140, 512, 70);

  // High-intensity white key light strip (simulating overhead diffuser)
  const keyGrad = ctx.createLinearGradient(120, 20, 392, 20);
  keyGrad.addColorStop(0, 'rgba(250, 250, 247, 0.0)');
  keyGrad.addColorStop(0.3, 'rgba(250, 250, 247, 0.85)');
  keyGrad.addColorStop(0.7, 'rgba(250, 250, 247, 0.85)');
  keyGrad.addColorStop(1, 'rgba(250, 250, 247, 0.0)');
  ctx.fillStyle = keyGrad;
  ctx.fillRect(100, 20, 312, 45);

  // Deep Teal rim accent strip
  const tealGrad = ctx.createLinearGradient(0, 80, 0, 130);
  tealGrad.addColorStop(0, 'rgba(15, 138, 131, 0.0)');
  tealGrad.addColorStop(0.5, 'rgba(15, 138, 131, 0.55)');
  tealGrad.addColorStop(1, 'rgba(15, 138, 131, 0.0)');
  ctx.fillStyle = tealGrad;
  ctx.fillRect(340, 80, 160, 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  return texture;
}

export const StudioEnvironment: React.FC = () => {
  const envTexture = useMemo(() => createProceduralStudioTexture(), []);

  return envTexture ? (
    <primitive object={envTexture} attach="background" />
  ) : null;
};
