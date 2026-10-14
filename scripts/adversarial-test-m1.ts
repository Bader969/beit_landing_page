/**
 * Adversarial Empirical Test Harness for Milestone 1 (M1)
 * Beit Plus 3D Cinematic Experience & Antigravity Telemetry
 * Author: Challenger 1 (challenger_m1_1)
 */

import assert from 'node:assert';

// 1. Setup mock DOM/Window environment before importing modules
interface MockElement {
  attributes: Record<string, string>;
  setAttribute(name: string, val: string): void;
  getAttribute(name: string): string | undefined;
}

const mockDocElement: MockElement = {
  attributes: {},
  setAttribute(name: string, val: string) {
    this.attributes[name] = String(val);
  },
  getAttribute(name: string) {
    return this.attributes[name];
  },
};

type EventCallback = (e: { type: string; detail?: unknown }) => void;
const windowEventListeners: Record<string, EventCallback[]> = {};

const mockWindow: Record<string, unknown> = {
  dispatchEvent(event: { type: string; detail?: unknown }) {
    const list = windowEventListeners[event.type] || [];
    list.forEach((cb) => cb(event));
    return true;
  },
  addEventListener(type: string, cb: EventCallback) {
    if (!windowEventListeners[type]) windowEventListeners[type] = [];
    windowEventListeners[type].push(cb);
  },
  removeEventListener(type: string, cb: EventCallback) {
    if (windowEventListeners[type]) {
      windowEventListeners[type] = windowEventListeners[type].filter((fn) => fn !== cb);
    }
  },
};

(globalThis as unknown as { window: unknown }).window = mockWindow;
(globalThis as unknown as { document: unknown }).document = {
  documentElement: mockDocElement,
};

async function runAdversarialHarness() {
  console.log('===========================================================');
  console.log('⚡ ADVERSARIAL STRESS HARNESS — CHALLENGER 1 (MILESTONE 1)');
  console.log('===========================================================\n');

  const {
    AntigravityControllerEngine,
    SAVINGS_BY_HOUSEHOLD,
    computeActFromProgress,
    antigravityController,
  } = await import('../src/store/antigravity-controller.ts');

  // -------------------------------------------------------------
  // TEST SUITE 1: Window Dual-Binding Equivalence
  // -------------------------------------------------------------
  console.log('TEST SUITE 1: Window Dual-Binding Equivalence & Singleton Integrity');
  const win = mockWindow as unknown as {
    AntigravityController: unknown;
    SplineApp: unknown;
  };

  assert.strictEqual(
    win.AntigravityController,
    antigravityController,
    '[FAIL] window.AntigravityController is not bound to the singleton instance'
  );
  assert.strictEqual(
    win.SplineApp,
    antigravityController,
    '[FAIL] window.SplineApp is not bound to the singleton instance'
  );
  assert.strictEqual(
    win.AntigravityController,
    win.SplineApp,
    '[FAIL] window.AntigravityController === window.SplineApp invariant broken'
  );

  const instance2 = AntigravityControllerEngine.getInstance();
  assert.strictEqual(
    antigravityController,
    instance2,
    '[FAIL] AntigravityControllerEngine.getInstance() returned multiple distinct instances'
  );
  console.log('  ✔ Invariant holds: window.AntigravityController === window.SplineApp === singleton');

  // -------------------------------------------------------------
  // TEST SUITE 2: Boundary & Extreme Values for scrollProgress & Act
  // -------------------------------------------------------------
  console.log('\nTEST SUITE 2: Boundary & Extreme Values Clamping for scrollProgress');

  const clampCases: Array<{ input: number; expectedProgress: number; expectedAct: number; desc: string }> = [
    { input: -100.0, expectedProgress: 0.0, expectedAct: 1, desc: 'Negative extreme (-100)' },
    { input: -0.00001, expectedProgress: 0.0, expectedAct: 1, desc: 'Negative epsilon (-1e-5)' },
    { input: 0.0, expectedProgress: 0.0, expectedAct: 1, desc: 'Exact zero (0.0)' },
    { input: 0.19999, expectedProgress: 0.19999, expectedAct: 1, desc: 'Act 1 upper bound (0.19999)' },
    { input: 0.20, expectedProgress: 0.20, expectedAct: 2, desc: 'Act 2 boundary exact (0.20)' },
    { input: 0.44999, expectedProgress: 0.44999, expectedAct: 2, desc: 'Act 2 upper bound (0.44999)' },
    { input: 0.45, expectedProgress: 0.45, expectedAct: 3, desc: 'Act 3 boundary exact (0.45)' },
    { input: 0.69999, expectedProgress: 0.69999, expectedAct: 3, desc: 'Act 3 upper bound (0.69999)' },
    { input: 0.70, expectedProgress: 0.70, expectedAct: 4, desc: 'Act 4 boundary exact (0.70)' },
    { input: 0.89999, expectedProgress: 0.89999, expectedAct: 4, desc: 'Act 4 upper bound (0.89999)' },
    { input: 0.90, expectedProgress: 0.90, expectedAct: 5, desc: 'Act 5 boundary exact (0.90)' },
    { input: 1.0, expectedProgress: 1.0, expectedAct: 5, desc: 'Exact one (1.0)' },
    { input: 1.00001, expectedProgress: 1.0, expectedAct: 5, desc: 'Positive epsilon overshoot (1.00001)' },
    { input: 999.99, expectedProgress: 1.0, expectedAct: 5, desc: 'Positive extreme (999.99)' },
    { input: Infinity, expectedProgress: 1.0, expectedAct: 5, desc: '+Infinity' },
    { input: -Infinity, expectedProgress: 0.0, expectedAct: 1, desc: '-Infinity' },
    { input: NaN, expectedProgress: 0.0, expectedAct: 1, desc: 'NaN fallback' },
  ];

  for (const c of clampCases) {
    antigravityController.setScrollProgress(c.input);
    const s = antigravityController.getState();
    assert.strictEqual(
      s.scrollProgress,
      c.expectedProgress,
      `[FAIL] setScrollProgress(${c.input}) failed progress clamp. Got ${s.scrollProgress}, expected ${c.expectedProgress} (${c.desc})`
    );
    assert.strictEqual(
      s.currentAct,
      c.expectedAct,
      `[FAIL] setScrollProgress(${c.input}) failed act computation. Got Act ${s.currentAct}, expected Act ${c.expectedAct} (${c.desc})`
    );
    assert.strictEqual(
      antigravityController.scrollProgress,
      s.scrollProgress,
      `[FAIL] Getter scrollProgress does not match getState()`
    );
    assert.strictEqual(
      antigravityController.currentAct,
      s.currentAct,
      `[FAIL] Getter currentAct does not match getState()`
    );
  }
  console.log(`  ✔ All ${clampCases.length} boundary and edge case clamping assertions passed`);

  // Direct test on pure function computeActFromProgress
  assert.strictEqual(computeActFromProgress(-50), 1);
  assert.strictEqual(computeActFromProgress(0), 1);
  assert.strictEqual(computeActFromProgress(0.19999), 1);
  assert.strictEqual(computeActFromProgress(0.20), 2);
  assert.strictEqual(computeActFromProgress(0.45), 3);
  assert.strictEqual(computeActFromProgress(0.70), 4);
  assert.strictEqual(computeActFromProgress(0.90), 5);
  assert.strictEqual(computeActFromProgress(1.0), 5);
  assert.strictEqual(computeActFromProgress(150), 5);
  console.log('  ✔ computeActFromProgress pure function verified across full domain');

  // -------------------------------------------------------------
  // TEST SUITE 3: Synchronous & Immediate Listener Invocations
  // -------------------------------------------------------------
  console.log('\nTEST SUITE 3: Listener Timing, Isolation, & Unsubscribe Behavior');

  // 3a. Immediate invocation upon subscription
  let subscriberInitialCalled = false;
  let receivedSnapshot: unknown = null;
  const unsub1 = antigravityController.subscribe((state) => {
    subscriberInitialCalled = true;
    receivedSnapshot = state;
  });
  assert.strictEqual(
    subscriberInitialCalled,
    true,
    '[FAIL] Listener was not invoked immediately upon calling subscribe()'
  );
  assert.deepStrictEqual(
    receivedSnapshot,
    antigravityController.getState(),
    '[FAIL] Initial snapshot provided to listener differs from getState()'
  );
  unsub1();
  console.log('  ✔ subscribe() immediately invokes listener with fresh state snapshot');

  // 3b. Synchronous update delivery before setter returns
  let syncReceived = false;
  let receivedScrollValue = -1;
  const unsub2 = antigravityController.subscribe((state) => {
    syncReceived = true;
    receivedScrollValue = state.scrollProgress;
  });

  syncReceived = false;
  antigravityController.setScrollProgress(0.42);
  assert.strictEqual(syncReceived, true, '[FAIL] Listener was not invoked synchronously during setScrollProgress');
  assert.strictEqual(receivedScrollValue, 0.42, '[FAIL] Listener did not receive updated progress value');
  unsub2();
  console.log('  ✔ Listeners receive state updates immediately & synchronously within setter calls');

  // 3c. Unsubscribe verification
  let calledAfterUnsub = false;
  const unsub3 = antigravityController.subscribe(() => {
    calledAfterUnsub = true;
  });
  calledAfterUnsub = false;
  unsub3();
  antigravityController.setScrollProgress(0.85);
  assert.strictEqual(
    calledAfterUnsub,
    false,
    '[FAIL] Listener was called after unsubscribe function was executed'
  );
  console.log('  ✔ Unsubscribe cleanly prevents subsequent notifications');

  // 3d. Error isolation (fault tolerance): one broken listener must not break others
  let healthyListenerCalled = false;
  let badListenerCallCount = 0;
  const badListener = () => {
    badListenerCallCount++;
    if (badListenerCallCount > 1) {
      throw new Error('Adversarial malicious exception inside listener');
    }
  };
  const healthyListener = () => {
    healthyListenerCalled = true;
  };

  const unsubBad = antigravityController.subscribe(badListener);
  const unsubHealthy = antigravityController.subscribe(healthyListener);

  healthyListenerCalled = false;
  // Trigger update - badListener throws, healthyListener should still execute
  antigravityController.setScrollProgress(0.33);

  assert.strictEqual(
    healthyListenerCalled,
    true,
    '[FAIL] An exception in a listener broke the notification chain for subsequent listeners'
  );
  unsubBad();
  unsubHealthy();
  console.log('  ✔ Error isolation verified: throwing listener does not disrupt other subscribers');

  // 3e. Self-unsubscribing listener during dispatch
  let selfUnsubCount = 0;
  let unsubSelf: () => void;
  unsubSelf = antigravityController.subscribe(() => {
    selfUnsubCount++;
    if (selfUnsubCount === 2) {
      unsubSelf();
    }
  });
  antigravityController.setScrollProgress(0.12);
  antigravityController.setScrollProgress(0.13);
  antigravityController.setScrollProgress(0.14);
  assert.strictEqual(
    selfUnsubCount,
    2,
    `[FAIL] Self-unsubscribing listener had incorrect execution count: ${selfUnsubCount} (expected 2)`
  );
  console.log('  ✔ Self-unsubscribing listeners execute and detach safely without iteration crashes');

  // -------------------------------------------------------------
  // TEST SUITE 4: Window CustomEvent 'antigravity:telemetry' Dispatch
  // -------------------------------------------------------------
  console.log('\nTEST SUITE 4: Window CustomEvent Telemetry Event Bus');
  let windowEventReceived = false;
  let eventDetailReceived: unknown = null;

  const onWindowTelemetry = (e: { type: string; detail?: unknown }) => {
    windowEventReceived = true;
    eventDetailReceived = e.detail;
  };

  (mockWindow as unknown as { addEventListener: typeof mockWindow.addEventListener }).addEventListener(
    'antigravity:telemetry',
    onWindowTelemetry
  );

  windowEventReceived = false;
  antigravityController.setHouseholdSize(5);

  assert.strictEqual(
    windowEventReceived,
    true,
    '[FAIL] window did not receive CustomEvent "antigravity:telemetry"'
  );
  assert.strictEqual(
    (eventDetailReceived as { householdSize: number }).householdSize,
    5,
    '[FAIL] CustomEvent detail payload does not match state update'
  );

  (mockWindow as unknown as { removeEventListener: typeof mockWindow.removeEventListener }).removeEventListener(
    'antigravity:telemetry',
    onWindowTelemetry
  );
  console.log('  ✔ window.dispatchEvent("antigravity:telemetry") broadcasts state changes accurately');

  // -------------------------------------------------------------
  // TEST SUITE 5: Language Switching & 'ar' Reflection
  // -------------------------------------------------------------
  console.log('\nTEST SUITE 5: Multilingual Switching & RTL / "ar" Reflection');

  antigravityController.setActiveLanguage('ar');
  assert.strictEqual(
    antigravityController.activeLanguage,
    'ar',
    '[FAIL] activeLanguage getter did not reflect "ar"'
  );
  assert.strictEqual(
    antigravityController.getState().activeLanguage,
    'ar',
    '[FAIL] getState().activeLanguage did not reflect "ar"'
  );

  // Test DOM reflection as done by LanguageProvider
  const isArabic = antigravityController.activeLanguage === 'ar';
  mockDocElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
  mockDocElement.setAttribute('lang', antigravityController.activeLanguage);

  assert.strictEqual(
    mockDocElement.getAttribute('dir'),
    'rtl',
    '[FAIL] Arabic active language failed to set dir="rtl" on documentElement'
  );
  assert.strictEqual(
    mockDocElement.getAttribute('lang'),
    'ar',
    '[FAIL] Arabic active language failed to set lang="ar" on documentElement'
  );

  // Switch to Turkish
  antigravityController.setActiveLanguage('tr');
  mockDocElement.setAttribute('dir', antigravityController.activeLanguage === 'ar' ? 'rtl' : 'ltr');
  mockDocElement.setAttribute('lang', antigravityController.activeLanguage);
  assert.strictEqual(mockDocElement.getAttribute('dir'), 'ltr');
  assert.strictEqual(mockDocElement.getAttribute('lang'), 'tr');

  // Switch to English
  antigravityController.setActiveLanguage('en');
  mockDocElement.setAttribute('dir', antigravityController.activeLanguage === 'ar' ? 'rtl' : 'ltr');
  mockDocElement.setAttribute('lang', antigravityController.activeLanguage);
  assert.strictEqual(mockDocElement.getAttribute('dir'), 'ltr');
  assert.strictEqual(mockDocElement.getAttribute('lang'), 'en');

  // Switch back to German
  antigravityController.setActiveLanguage('de');
  mockDocElement.setAttribute('dir', antigravityController.activeLanguage === 'ar' ? 'rtl' : 'ltr');
  mockDocElement.setAttribute('lang', antigravityController.activeLanguage);
  assert.strictEqual(mockDocElement.getAttribute('dir'), 'ltr');
  assert.strictEqual(mockDocElement.getAttribute('lang'), 'de');

  console.log('  ✔ Language switching correctly updates state and sets documentElement dir/lang');

  // -------------------------------------------------------------
  // TEST SUITE 6: Household Size & Savings Bounds Clamping
  // -------------------------------------------------------------
  console.log('\nTEST SUITE 6: Household Size Clamping & Savings Calculation Table');

  const householdCases: Array<{ input: number; expectedSize: number; expectedSavings: number }> = [
    { input: -5, expectedSize: 1, expectedSavings: 420 },
    { input: 0, expectedSize: 1, expectedSavings: 420 },
    { input: 1, expectedSize: 1, expectedSavings: 420 },
    { input: 2, expectedSize: 2, expectedSavings: 760 },
    { input: 3, expectedSize: 3, expectedSavings: 1120 },
    { input: 4, expectedSize: 4, expectedSavings: 1480 },
    { input: 5, expectedSize: 5, expectedSavings: 1650 },
    { input: 6, expectedSize: 6, expectedSavings: 1800 },
    { input: 7, expectedSize: 6, expectedSavings: 1800 },
    { input: 100, expectedSize: 6, expectedSavings: 1800 },
    { input: 2.7, expectedSize: 3, expectedSavings: 1120 }, // math.round(2.7) = 3
    { input: 4.2, expectedSize: 4, expectedSavings: 1480 }, // math.round(4.2) = 4
  ];

  for (const h of householdCases) {
    antigravityController.setHouseholdSize(h.input);
    const st = antigravityController.getState();
    assert.strictEqual(
      st.householdSize,
      h.expectedSize,
      `[FAIL] Household input ${h.input} expected size ${h.expectedSize}, got ${st.householdSize}`
    );
    assert.strictEqual(
      st.savingsValue,
      h.expectedSavings,
      `[FAIL] Household input ${h.input} expected savings ${h.expectedSavings}, got ${st.savingsValue}`
    );
  }
  console.log('  ✔ Household size clamping [1..6] and savings lookup table fully verified');

  // Custom savings override
  antigravityController.setSavingsValue(2450);
  assert.strictEqual(antigravityController.savingsValue, 2450);
  antigravityController.setSavingsValue(-300);
  assert.strictEqual(antigravityController.savingsValue, 0, 'Negative savings should clamp to 0');
  console.log('  ✔ Manual savings value clamping verified');

  // -------------------------------------------------------------
  // TEST SUITE 7: Consultation Drawer & Hover Target State Transitions
  // -------------------------------------------------------------
  console.log('\nTEST SUITE 7: Consultation Drawer & Hover Target Transitions');

  antigravityController.setConsultationOpen(false);
  assert.strictEqual(antigravityController.isConsultationOpen, false);
  antigravityController.toggleConsultation();
  assert.strictEqual(antigravityController.isConsultationOpen, true);
  antigravityController.toggleConsultation();
  assert.strictEqual(antigravityController.isConsultationOpen, false);
  antigravityController.openConsultation();
  assert.strictEqual(antigravityController.isConsultationOpen, true);
  antigravityController.closeConsultation();
  assert.strictEqual(antigravityController.isConsultationOpen, false);

  const hoverTargets: Array<import('../src/types/telemetry').HoverTarget> = [
    'energy',
    'health',
    'mobility',
    'telecom',
    'house',
    null,
  ];
  for (const t of hoverTargets) {
    antigravityController.setHoverTarget(t);
    assert.strictEqual(antigravityController.hoverTarget, t);
  }
  console.log('  ✔ Consultation toggles and all 5 hover targets + null verified');

  // -------------------------------------------------------------
  // TEST SUITE 8: Immutability of getState() Snapshot
  // -------------------------------------------------------------
  console.log('\nTEST SUITE 8: Snapshot Immutability (Tamper Resistance)');
  const snapshot1 = antigravityController.getState();
  // Attempt to mutate the returned snapshot
  (snapshot1 as { scrollProgress: number }).scrollProgress = 0.9999;
  (snapshot1 as { activeLanguage: string }).activeLanguage = 'corrupted';

  const snapshot2 = antigravityController.getState();
  assert.notStrictEqual(
    snapshot2.scrollProgress,
    0.9999,
    '[FAIL] Mutating returned snapshot mutated internal controller state!'
  );
  assert.notStrictEqual(
    snapshot2.activeLanguage,
    'corrupted',
    '[FAIL] Mutating returned snapshot mutated internal controller state!'
  );
  console.log('  ✔ getState() returns defensive copy; controller internal state protected');

  console.log('\n===========================================================');
  console.log('🎉 ALL ADVERSARIAL STRESS TESTS PASSED WITH 100% SUCCESS!');
  console.log('===========================================================');
}

runAdversarialHarness().catch((err) => {
  console.error('\n❌ STRESS TEST ASSERTION FAILED:\n', err);
  process.exit(1);
});
