#!/usr/bin/env node
/**
 * Master Verification Suite Runner (Node.js ESM Entry Point)
 * Beit Plus 3D Multilingual Multi-Utility Broker Platform
 * Milestone 4 (M4) / Requirement R4
 *
 * Can be run directly via:
 *   node scripts/verify-experience.mjs
 * Or via npm:
 *   npm run verify
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsScript = path.join(__dirname, 'verify-experience.ts');

if (!process.env.__VERIFY_EXPERIENCE_RUNNER__) {
  // Delegate to tsx loader to support TypeScript imports and JSX
  const result = spawnSync(
    process.execPath,
    ['--import', 'tsx', tsScript, ...process.argv.slice(2)],
    {
      stdio: 'inherit',
      env: { ...process.env, __VERIFY_EXPERIENCE_RUNNER__: '1' },
      cwd: path.resolve(__dirname, '..'),
    }
  );

  if (result.error) {
    console.error('Failed to execute verification suite:', result.error);
    process.exit(1);
  }

  process.exit(result.status ?? 0);
} else {
  // If already running under tsx runner, load the script directly
  await import('./verify-experience.ts');
}
