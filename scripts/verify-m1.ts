/**
 * Automated Verification Script for Milestone 1 (M1)
 * Beit Plus 3D Scrollytelling & Telemetry Engine
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Setup mock window environment for node execution
const mockWindow: Record<string, unknown> = {
  dispatchEvent: () => true,
};
(globalThis as unknown as { window: unknown }).window = mockWindow;

async function runM1Verification() {
  console.log('--- BEIT PLUS: MILESTONE 1 VERIFICATION HARNESS ---');

  // 1. Verify distribution artifacts
  console.log('1. Checking build outputs in dist/...');
  const distDir = path.resolve(process.cwd(), 'dist');
  assert.ok(fs.existsSync(distDir), 'dist/ directory must exist');
  assert.ok(fs.existsSync(path.join(distDir, 'index.html')), 'dist/index.html must exist');
  
  const assetsDir = path.join(distDir, 'assets');
  assert.ok(fs.existsSync(assetsDir), 'dist/assets must exist');
  const assetFiles = fs.readdirSync(assetsDir);
  const jsBundle = assetFiles.find((f) => f.endsWith('.js'));
  const cssBundle = assetFiles.find((f) => f.endsWith('.css'));
  assert.ok(jsBundle, 'JavaScript bundle must be generated in dist/assets');
  assert.ok(cssBundle, 'CSS bundle must be generated in dist/assets');
  console.log(`   [PASS] JS Bundle: ${jsBundle}, CSS Bundle: ${cssBundle}`);

  // 2. Import & Verify AntigravityControllerEngine
  console.log('2. Testing AntigravityControllerEngine & Window Bindings...');
  const { AntigravityControllerEngine, SAVINGS_BY_HOUSEHOLD, computeActFromProgress } = await import(
    '../src/store/antigravity-controller.ts'
  );

  const controller = AntigravityControllerEngine.getInstance();
  assert.ok(controller, 'AntigravityControllerEngine instance must exist');

  // Verify dual window binding
  assert.strictEqual(
    (mockWindow as unknown as { AntigravityController: unknown }).AntigravityController,
    controller,
    'window.AntigravityController must bind to singleton'
  );
  assert.strictEqual(
    (mockWindow as unknown as { SplineApp: unknown }).SplineApp,
    controller,
    'window.SplineApp must bind to singleton'
  );
  console.log('   [PASS] Dual-window binding window.AntigravityController === window.SplineApp verified.');

  // Test act computation
  assert.strictEqual(computeActFromProgress(0.0), 1, '0.0 progress -> Act 1');
  assert.strictEqual(computeActFromProgress(0.15), 1, '0.15 progress -> Act 1');
  assert.strictEqual(computeActFromProgress(0.25), 2, '0.25 progress -> Act 2');
  assert.strictEqual(computeActFromProgress(0.50), 3, '0.50 progress -> Act 3');
  assert.strictEqual(computeActFromProgress(0.75), 4, '0.75 progress -> Act 4');
  assert.strictEqual(computeActFromProgress(0.95), 5, '0.95 progress -> Act 5');
  console.log('   [PASS] Scrollytelling act progression boundaries verified.');

  // Test state transitions & reactivity
  let lastReceivedState: unknown = null;
  const unsubscribe = controller.subscribe((state) => {
    lastReceivedState = state;
  });

  // Test household scaling
  controller.setHouseholdSize(4);
  assert.strictEqual(controller.householdSize, 4, 'Household size should update to 4');
  assert.strictEqual(controller.savingsValue, SAVINGS_BY_HOUSEHOLD[4], 'Savings should match household table (1480 €)');
  console.log('   [PASS] Household scaling & dynamic savings table verified.');

  // Test language switching
  controller.setActiveLanguage('ar');
  assert.strictEqual(controller.activeLanguage, 'ar', 'Active language should switch to Arabic (ar)');
  controller.setActiveLanguage('de');
  assert.strictEqual(controller.activeLanguage, 'de', 'Active language should switch to German (de)');
  console.log('   [PASS] Language switching telemetry verified.');

  // Test scroll & act progression
  controller.setScrollProgress(0.60);
  assert.strictEqual(controller.scrollProgress, 0.60, 'Scroll progress should be 0.60');
  assert.strictEqual(controller.currentAct, 3, 'Current act should be Act 3 at 0.60 progress');
  console.log('   [PASS] Scroll progress and current act reactivity verified.');

  // Test consultation drawer
  controller.openConsultation();
  assert.strictEqual(controller.isConsultationOpen, true, 'Drawer should open');
  controller.closeConsultation();
  assert.strictEqual(controller.isConsultationOpen, false, 'Drawer should close');
  console.log('   [PASS] Consultation drawer telemetry verified.');

  unsubscribe();

  // 3. Verify Translations completeness
  console.log('3. Validating 4-language i18n completeness (DE, AR, EN, TR)...');
  const { translations } = await import('../src/i18n/translations.ts');
  const requiredLangs = ['de', 'ar', 'en', 'tr'] as const;

  for (const lang of requiredLangs) {
    const t = translations[lang];
    assert.ok(t, `Translations for ${lang} must exist`);
    assert.ok(t.nav.brand, `${lang}.nav.brand must exist`);
    assert.ok(t.act1.title, `${lang}.act1.title must exist`);
    assert.ok(t.act2.pillars.energy.title, `${lang}.act2.pillars.energy.title must exist`);
    assert.ok(t.act2.pillars.health.title, `${lang}.act2.pillars.health.title must exist`);
    assert.ok(t.act2.pillars.mobility.title, `${lang}.act2.pillars.mobility.title must exist`);
    assert.ok(t.act2.pillars.telecom.title, `${lang}.act2.pillars.telecom.title must exist`);
    assert.ok(t.act3.title, `${lang}.act3.title must exist`);
    assert.ok(t.act4.title, `${lang}.act4.title must exist`);
    assert.ok(t.act5.title, `${lang}.act5.title must exist`);
    assert.ok(t.consultation.title, `${lang}.consultation.title must exist`);
    assert.ok(t.consultation.advisorName, `${lang}.consultation.advisorName must exist`);
  }
  console.log('   [PASS] All 4 languages verified across all 5 acts and consultation schemas.');

  console.log('\n>>> ALL MILESTONE 1 VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<');
}

runM1Verification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
