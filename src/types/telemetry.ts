/**
 * Antigravity Telemetry and State Interface Definitions
 * Beit Plus 3D Cinematic Experience
 */

export type ActiveLanguage = 'de' | 'ar' | 'en' | 'tr';

export type HoverTarget = 'energy' | 'health' | 'mobility' | 'telecom' | 'house' | null;

export type ActNumber = 1 | 2 | 3 | 4 | 5;

export interface TelemetryState {
  /** Normalized scroll progress from 0.0 to 1.0 */
  scrollProgress: number;
  /** Active UI locale and 3D typography target */
  activeLanguage: ActiveLanguage;
  /** Currently hovered 3D pillar or house target for focus lighting */
  hoverTarget: HoverTarget;
  /** Real-time calculated annual savings in Euros (e.g. 420 - 2500 €) */
  savingsValue: number;
  /** Household size slider input (1 - 6 persons) */
  householdSize: number;
  /** Whether the Act V native advisor consultation drawer is open */
  isConsultationOpen: boolean;
  /** Current scrollytelling act index computed from scrollProgress */
  currentAct: ActNumber;
}

export type TelemetryListener = (state: TelemetryState) => void;

export interface AntigravityControllerAPI {
  readonly scrollProgress: number;
  readonly activeLanguage: ActiveLanguage;
  readonly hoverTarget: HoverTarget;
  readonly savingsValue: number;
  readonly householdSize: number;
  readonly isConsultationOpen: boolean;
  readonly currentAct: ActNumber;

  /** Get snapshot of current state */
  getState(): TelemetryState;

  /** Setters */
  setScrollProgress(progress: number): void;
  setActiveLanguage(lang: ActiveLanguage): void;
  setHoverTarget(target: HoverTarget): void;
  setHouseholdSize(size: number): void;
  setSavingsValue(value: number): void;
  setConsultationOpen(isOpen: boolean): void;
  openConsultation(): void;
  closeConsultation(): void;
  toggleConsultation(): void;

  /** Event subscription */
  subscribe(listener: TelemetryListener): () => void;
  emit(event: string, detail?: unknown): void;
}

declare global {
  interface Window {
    AntigravityController?: AntigravityControllerAPI;
    SplineApp?: AntigravityControllerAPI;
  }
}
