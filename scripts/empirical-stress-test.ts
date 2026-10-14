import assert from 'node:assert';
import { translations } from '../src/i18n/translations';
import { AntigravityControllerEngine, SAVINGS_BY_HOUSEHOLD } from '../src/store/antigravity-controller';

// Mock window for headless Node environment
const mockWindow: Record<string, unknown> = {
  dispatchEvent: () => true,
};
(globalThis as unknown as { window: unknown }).window = mockWindow;

function runEmpiricalTests() {
  console.log('=== EMPIRICAL CHALLENGER 2: DEEP STRESS TEST SUITE ===\n');

  // ---------------------------------------------------------
  // TEST 1: i18n Deep Key Parity & Leaf Node Completeness
  // ---------------------------------------------------------
  console.log('--- TEST 1: i18n Deep Key Parity across DE, AR, EN, TR ---');
  const requiredLangs = ['de', 'ar', 'en', 'tr'] as const;

  function collectLeafPaths(obj: Record<string, unknown>, prefix = ''): { path: string; value: unknown }[] {
    let result: { path: string; value: unknown }[] = [];
    for (const [key, val] of Object.entries(obj)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        result = result.concat(collectLeafPaths(val as Record<string, unknown>, currentPath));
      } else {
        result.push({ path: currentPath, value: val });
      }
    }
    return result;
  }

  const langLeaves: Record<string, { path: string; value: unknown }[]> = {};
  for (const lang of requiredLangs) {
    assert.ok(translations[lang], `translations.${lang} must exist`);
    langLeaves[lang] = collectLeafPaths(translations[lang] as unknown as Record<string, unknown>);
    console.log(`[i18n] Language ${lang.toUpperCase()} total leaf keys: ${langLeaves[lang].length}`);
  }

  const referenceLeaves = langLeaves['de'];
  const refPathSet = new Set(referenceLeaves.map((l) => l.path));

  let parityErrors = 0;

  for (const lang of ['ar', 'en', 'tr'] as const) {
    const currentPathSet = new Set(langLeaves[lang].map((l) => l.path));

    // Missing keys
    const missing = [...refPathSet].filter((p) => !currentPathSet.has(p));
    if (missing.length > 0) {
      console.error(`[FAIL] ${lang.toUpperCase()} missing keys compared to DE:`, missing);
      parityErrors++;
    }

    // Extra keys
    const extra = [...currentPathSet].filter((p) => !refPathSet.has(p));
    if (extra.length > 0) {
      console.error(`[FAIL] ${lang.toUpperCase()} has extra keys not in DE:`, extra);
      parityErrors++;
    }

    assert.strictEqual(
      langLeaves[lang].length,
      referenceLeaves.length,
      `Leaf key count mismatch: ${lang} (${langLeaves[lang].length}) vs de (${referenceLeaves.length})`
    );
  }

  // Validate every leaf value across all languages
  let emptyValueErrors = 0;
  for (const lang of requiredLangs) {
    for (const item of langLeaves[lang]) {
      if (typeof item.value !== 'string') {
        console.error(`[FAIL] Non-string leaf at ${lang}.${item.path}: type ${typeof item.value}`);
        emptyValueErrors++;
      } else if (item.value.trim().length === 0) {
        console.error(`[FAIL] Empty or whitespace-only leaf at ${lang}.${item.path}`);
        emptyValueErrors++;
      }
    }
  }

  assert.strictEqual(parityErrors, 0, 'All languages must have identical key sets');
  assert.strictEqual(emptyValueErrors, 0, 'No leaf values can be non-string or empty');
  console.log(`[PASS] 100% key parity verified across all 4 languages (${referenceLeaves.length} keys per language).\n`);

  // ---------------------------------------------------------
  // TEST 2: Savings Calculations (1 to 6 persons & edge cases)
  // ---------------------------------------------------------
  console.log('--- TEST 2: Savings Calculations (Household 1 to 6 persons) ---');
  const controller = AntigravityControllerEngine.getInstance();

  const expectedSavings: Record<number, number> = {
    1: 420,
    2: 760,
    3: 1120,
    4: 1480,
    5: 1650,
    6: 1800,
  };

  for (let persons = 1; persons <= 6; persons++) {
    controller.setHouseholdSize(persons);

    const state = controller.getState();
    const currentSize = state.householdSize;
    const savings = state.savingsValue;

    console.log(`Testing household size = ${persons}:`);
    console.log(`  State householdSize: ${currentSize}`);
    console.log(`  State savingsValue: ${savings} €`);

    assert.strictEqual(currentSize, persons, `householdSize should be ${persons}`);
    assert.strictEqual(typeof savings, 'number', `savingsValue must be number`);
    assert.ok(!Number.isNaN(savings), `savingsValue must NOT be NaN for size ${persons}`);
    assert.ok(Number.isFinite(savings), `savingsValue must be finite for size ${persons}`);
    assert.strictEqual(savings, expectedSavings[persons], `savingsValue for ${persons} must be ${expectedSavings[persons]}`);

    // Test UI breakdowns in ActSections
    const energySavings = Math.round(savings * 0.40);
    const healthSavings = Math.round(savings * 0.30);
    const mobilitySavings = Math.round(savings * 0.20);
    const telecomSavings = Math.round(savings * 0.10);
    const sumPillars = energySavings + healthSavings + mobilitySavings + telecomSavings;

    console.log(`  Pillars breakdown: Energy=${energySavings}€, Health=${healthSavings}€, Mobility=${mobilitySavings}€, Telecom=${telecomSavings}€ (Sum=${sumPillars}€)`);

    assert.ok(!Number.isNaN(energySavings), 'Energy savings cannot be NaN');
    assert.ok(!Number.isNaN(healthSavings), 'Health savings cannot be NaN');
    assert.ok(!Number.isNaN(mobilitySavings), 'Mobility savings cannot be NaN');
    assert.ok(!Number.isNaN(telecomSavings), 'Telecom savings cannot be NaN');
    assert.strictEqual(sumPillars, savings, `Sum of pillar savings (${sumPillars}) must match total savings (${savings})`);

    // Test locale string formatting
    const formatted = savings.toLocaleString();
    assert.ok(formatted && formatted !== 'NaN' && formatted !== 'undefined', 'Formatted string valid');
  }
  console.log('[PASS] All household sizes 1 to 6 pass savings calculation and pillar breakdown with zero NaN.\n');

  // ---------------------------------------------------------
  // TEST 3: Adversarial / Boundary inputs for setHouseholdSize
  // ---------------------------------------------------------
  console.log('--- TEST 3: Adversarial / Boundary inputs for setHouseholdSize ---');
  
  // Boundary below 1
  controller.setHouseholdSize(0);
  console.log(`  setHouseholdSize(0) -> clamped size: ${controller.householdSize}, savings: ${controller.savingsValue}`);
  assert.strictEqual(controller.householdSize, 1, 'Size 0 should clamp to 1');
  assert.strictEqual(controller.savingsValue, 420);

  controller.setHouseholdSize(-10);
  console.log(`  setHouseholdSize(-10) -> clamped size: ${controller.householdSize}, savings: ${controller.savingsValue}`);
  assert.strictEqual(controller.householdSize, 1, 'Negative size should clamp to 1');

  // Boundary above 6
  controller.setHouseholdSize(7);
  console.log(`  setHouseholdSize(7) -> clamped size: ${controller.householdSize}, savings: ${controller.savingsValue}`);
  assert.strictEqual(controller.householdSize, 6, 'Size 7 should clamp to 6');
  assert.strictEqual(controller.savingsValue, 1800);

  controller.setHouseholdSize(999);
  console.log(`  setHouseholdSize(999) -> clamped size: ${controller.householdSize}, savings: ${controller.savingsValue}`);
  assert.strictEqual(controller.householdSize, 6, 'Size 999 should clamp to 6');

  // Float numbers
  controller.setHouseholdSize(3.7);
  console.log(`  setHouseholdSize(3.7) -> clamped size: ${controller.householdSize}, savings: ${controller.savingsValue}`);
  assert.strictEqual(controller.householdSize, 4, 'Size 3.7 should round to 4');
  assert.strictEqual(controller.savingsValue, 1480);

  // String parsing as done in ActSections handleHouseholdChange
  const parsedFromString = parseInt('5', 10);
  controller.setHouseholdSize(parsedFromString);
  assert.strictEqual(controller.householdSize, 5);
  assert.strictEqual(controller.savingsValue, 1650);

  console.log('[PASS] Adversarial boundary inputs clamped safely.\n');

  console.log('====================================================');
  console.log('EMPIRICAL STRESS TEST SUITE COMPLETED WITH 100% PASS');
  console.log('====================================================');
}

runEmpiricalTests();
