import {
  ActiveLanguage,
  ActNumber,
  AntigravityControllerAPI,
  HoverTarget,
  TelemetryListener,
  TelemetryState,
} from '../types/telemetry';

export const SAVINGS_BY_HOUSEHOLD: Record<number, number> = {
  1: 420,
  2: 760,
  3: 1120,
  4: 1480,
  5: 1650,
  6: 1800,
};

export function computeActFromProgress(p: number): ActNumber {
  const clamped = Math.max(0, Math.min(1, p));
  if (clamped < 0.20) return 1;
  if (clamped < 0.45) return 2;
  if (clamped < 0.70) return 3;
  if (clamped < 0.90) return 4;
  return 5;
}

export class AntigravityControllerEngine implements AntigravityControllerAPI {
  private static instance: AntigravityControllerEngine | null = null;

  private state: TelemetryState = {
    scrollProgress: 0.0,
    activeLanguage: 'de',
    hoverTarget: null,
    savingsValue: SAVINGS_BY_HOUSEHOLD[3], // Default 3 persons: 1.120 €
    householdSize: 3,
    isConsultationOpen: false,
    currentAct: 1,
  };

  private listeners = new Set<TelemetryListener>();

  private constructor() {
    this.bindToWindow();
  }

  public static getInstance(): AntigravityControllerEngine {
    if (!AntigravityControllerEngine.instance) {
      AntigravityControllerEngine.instance = new AntigravityControllerEngine();
    }
    return AntigravityControllerEngine.instance;
  }

  private bindToWindow(): void {
    if (typeof window !== 'undefined') {
      window.AntigravityController = this;
      window.SplineApp = this;
    }
  }

  // Getters
  public get scrollProgress(): number {
    return this.state.scrollProgress;
  }

  public get activeLanguage(): ActiveLanguage {
    return this.state.activeLanguage;
  }

  public get hoverTarget(): HoverTarget {
    return this.state.hoverTarget;
  }

  public get savingsValue(): number {
    return this.state.savingsValue;
  }

  public get householdSize(): number {
    return this.state.householdSize;
  }

  public get isConsultationOpen(): boolean {
    return this.state.isConsultationOpen;
  }

  public get currentAct(): ActNumber {
    return this.state.currentAct;
  }

  public getState(): TelemetryState {
    return { ...this.state };
  }

  // Setters
  public setScrollProgress(progress: number): void {
    const clamped = Math.max(0, Math.min(1, Number(progress) || 0));
    const act = computeActFromProgress(clamped);
    if (this.state.scrollProgress !== clamped || this.state.currentAct !== act) {
      this.state.scrollProgress = clamped;
      this.state.currentAct = act;
      this.notifyListeners();
    }
  }

  public setActiveLanguage(lang: ActiveLanguage): void {
    if (this.state.activeLanguage !== lang) {
      this.state.activeLanguage = lang;
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
      }
      this.notifyListeners();
    }
  }

  public setHoverTarget(target: HoverTarget): void {
    if (this.state.hoverTarget !== target) {
      this.state.hoverTarget = target;
      this.notifyListeners();
    }
  }

  public setHouseholdSize(size: number): void {
    const validSize = Math.max(1, Math.min(6, Math.round(size)));
    const calculatedSavings = SAVINGS_BY_HOUSEHOLD[validSize] ?? 1120;
    if (this.state.householdSize !== validSize || this.state.savingsValue !== calculatedSavings) {
      this.state.householdSize = validSize;
      this.state.savingsValue = calculatedSavings;
      this.notifyListeners();
    }
  }

  public setSavingsValue(value: number): void {
    const clamped = Math.max(0, Math.round(value));
    if (this.state.savingsValue !== clamped) {
      this.state.savingsValue = clamped;
      this.notifyListeners();
    }
  }

  public setConsultationOpen(isOpen: boolean): void {
    if (this.state.isConsultationOpen !== isOpen) {
      this.state.isConsultationOpen = isOpen;
      this.notifyListeners();
    }
  }

  public openConsultation(): void {
    this.setConsultationOpen(true);
  }

  public closeConsultation(): void {
    this.setConsultationOpen(false);
  }

  public toggleConsultation(): void {
    this.setConsultationOpen(!this.state.isConsultationOpen);
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    // Provide current state immediately on subscription
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: string, detail?: unknown): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(event, { detail }));
    }
  }

  private notifyListeners(): void {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('Antigravity telemetry listener error:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('antigravity:telemetry', { detail: snapshot }));
    }
  }
}

export const antigravityController = AntigravityControllerEngine.getInstance();
