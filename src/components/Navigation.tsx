import React from 'react';
import { useLanguage } from '../i18n/language-context';
import { antigravityController } from '../store/antigravity-controller';
import { ActiveLanguage, TelemetryState } from '../types/telemetry';
import { Globe } from 'lucide-react';

interface NavigationProps {
  telemetry: TelemetryState;
}

export const Navigation: React.FC<NavigationProps> = ({ telemetry }) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: ActiveLanguage; label: string }[] = [
    { code: 'de', label: 'DE' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'EN' },
    { code: 'tr', label: 'TR' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0F2D4A]/80 backdrop-blur-md border-b border-[#C7A55A]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F8A83] to-[#0F2D4A] border border-[#C7A55A] flex items-center justify-center shadow-lg shadow-[#0F8A83]/20">
            <span className="text-[#FAFAF7] font-bold text-xl leading-none">+</span>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#FAFAF7] block">
              {t.nav.brand}
            </span>
            <span className="text-xs text-[#0F8A83] font-medium hidden sm:block">
              {t.nav.tagline}
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#FAFAF7]/80">
          <a
            href="#act-1"
            className={`transition-colors ${telemetry.currentAct === 1 ? 'text-[#C7A55A] font-semibold' : 'hover:text-[#C7A55A]'}`}
          >
            {t.nav.act1}
          </a>
          <a
            href="#act-2"
            className={`transition-colors ${telemetry.currentAct === 2 ? 'text-[#C7A55A] font-semibold' : 'hover:text-[#C7A55A]'}`}
          >
            {t.nav.act2}
          </a>
          <a
            href="#act-3"
            className={`transition-colors ${telemetry.currentAct === 3 ? 'text-[#C7A55A] font-semibold' : 'hover:text-[#C7A55A]'}`}
          >
            {t.nav.act3}
          </a>
          <a
            href="#act-4"
            className={`transition-colors ${telemetry.currentAct === 4 ? 'text-[#C7A55A] font-semibold' : 'hover:text-[#C7A55A]'}`}
          >
            {t.nav.act4}
          </a>
          <a
            href="#act-5"
            className={`transition-colors ${telemetry.currentAct === 5 ? 'text-[#C7A55A] font-semibold' : 'hover:text-[#C7A55A]'}`}
          >
            {t.nav.act5}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#2D3748]/60 p-1 rounded-xl border border-white/10">
            <Globe className="w-4 h-4 text-[#C7A55A] mx-1.5 hidden sm:block" />
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === item.code
                    ? 'bg-[#0F8A83] text-white shadow-md'
                    : 'text-[#FAFAF7]/70 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => antigravityController.openConsultation()}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#C7A55A] to-[#D4AF37] text-[#0F2D4A] hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#C7A55A]/20 cursor-pointer"
          >
            {t.nav.ctaConsultation}
          </button>
        </div>
      </div>
    </header>
  );
};
