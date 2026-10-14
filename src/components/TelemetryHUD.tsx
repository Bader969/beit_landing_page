import React from 'react';
import { TelemetryState } from '../types/telemetry';
interface TelemetryHUDProps {
  telemetry: TelemetryState;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry }) => {
  return (
    <div className="fixed bottom-4 left-4 z-30 bg-[#0F2D4A]/90 backdrop-blur-md border border-[#C7A55A]/30 p-3 rounded-2xl text-[11px] font-mono shadow-2xl max-w-xs space-y-1">
      <div className="flex items-center justify-between text-[#C7A55A] font-bold border-b border-white/10 pb-1">
        <span>Antigravity Telemetry</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <div className="flex justify-between">
        <span className="text-[#FAFAF7]/60">scrollProgress:</span>
        <span className="text-emerald-400">{telemetry.scrollProgress.toFixed(3)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#FAFAF7]/60">currentAct:</span>
        <span className="text-[#C7A55A] font-bold">Act {telemetry.currentAct}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#FAFAF7]/60">activeLanguage:</span>
        <span className="uppercase text-[#0F8A83] font-bold">{telemetry.activeLanguage}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#FAFAF7]/60">hoverTarget:</span>
        <span className="text-blue-300">{telemetry.hoverTarget || 'none'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#FAFAF7]/60">savingsValue:</span>
        <span className="text-[#C7A55A] font-bold">{telemetry.savingsValue} €</span>
      </div>
    </div>
  );
};
