import React, { useState } from 'react';
import { useLanguage } from '../i18n/language-context';
import { antigravityController } from '../store/antigravity-controller';
import { ActiveLanguage, HoverTarget, TelemetryState } from '../types/telemetry';
import {
  Zap,
  ShieldCheck,
  Car,
  Wifi,
  ChevronDown,
  Sparkles,
  Users,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Activity,
  Shield,
  Layers,
  Lock,
  RefreshCw,
  Globe,
  Gauge,
} from 'lucide-react';

interface ActSectionsProps {
  telemetry: TelemetryState;
}

export const ActSections: React.FC<ActSectionsProps> = ({ telemetry }) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [portalTab, setPortalTab] = useState<'overview' | 'audit' | 'protection' | 'vault'>('overview');
  const [isAudited, setIsAudited] = useState(false);

  const handlePillarHover = (target: HoverTarget) => {
    antigravityController.setHoverTarget(target);
  };

  const handleHouseholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    antigravityController.setHouseholdSize(size);
  };

  const languages: { code: ActiveLanguage; label: string }[] = [
    { code: 'de', label: 'DE' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'EN' },
    { code: 'tr', label: 'TR' },
  ];

  // Dynamic kilowatt counter based on household size
  const annualKilowatt = (1800 + (telemetry.householdSize - 1) * 750).toLocaleString();

  return (
    <main className="relative z-10 flex flex-col items-stretch pointer-events-none">
      {/* ACT 1: The Burden of Paperwork & The Anchor */}
      <section
        id="act-1"
        className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F8A83]/20 border border-[#0F8A83]/40 text-[#0F8A83] text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>{t.act1.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FAFAF7] leading-tight">
            {t.act1.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#FAFAF7]/70 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.act1.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <span className="px-4 py-2 rounded-xl bg-[#2D3748]/70 border border-white/10 text-xs text-[#FAFAF7]/80 backdrop-blur-md shadow-md animate-bounce">
              {t.act1.floatingSheetText1}
            </span>
            <span className="px-4 py-2 rounded-xl bg-[#2D3748]/70 border border-white/10 text-xs text-[#FAFAF7]/80 backdrop-blur-md shadow-md delay-150 animate-bounce">
              {t.act1.floatingSheetText2}
            </span>
            <span className="px-4 py-2 rounded-xl bg-[#2D3748]/70 border border-white/10 text-xs text-[#FAFAF7]/80 backdrop-blur-md shadow-md delay-300 animate-bounce">
              {t.act1.floatingSheetText3}
            </span>
          </div>

          <div className="pt-12 flex flex-col items-center gap-2 text-xs text-[#FAFAF7]/50 font-medium">
            <span>{t.act1.scrollHint}</span>
            <ChevronDown className="w-5 h-5 text-[#C7A55A] animate-pulse" />
          </div>
        </div>
      </section>

      {/* ACT 2: The Deconstruction of Protection (4 Feature Cards) */}
      <section
        id="act-2"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-24 relative"
      >
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C7A55A]/20 border border-[#C7A55A]/40 text-[#C7A55A] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.act2.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAFAF7] tracking-tight">
              {t.act2.title}
            </h2>
            <p className="text-base sm:text-lg text-[#FAFAF7]/70">
              {t.act2.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Strom & Gas (Dynamic Kilowatt Counter) */}
            <div
              onMouseEnter={() => handlePillarHover('energy')}
              onMouseLeave={() => handlePillarHover(null)}
              className={`pointer-events-auto p-6 sm:p-8 rounded-3xl bg-[#0B2238]/85 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-6 ${
                telemetry.hoverTarget === 'energy'
                  ? 'border-[#0F8A83] shadow-2xl shadow-[#0F8A83]/30 bg-[#0F2D4A]'
                  : 'border-white/10 hover:border-[#0F8A83]/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  {/* Dynamic Kilowatt Counter Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F8A83]/20 border border-[#0F8A83]/50 text-[#0F8A83] text-[11px] font-mono font-bold animate-pulse">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>~{annualKilowatt} kWh</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-amber-400">
                    {t.act2.pillars.energy.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#FAFAF7] mt-1">
                    {t.act2.pillars.energy.title}
                  </h3>
                </div>
                <p className="text-sm text-[#FAFAF7]/70 leading-relaxed">
                  {t.act2.pillars.energy.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-xs text-[#FAFAF7]/60">
                  {t.act2.pillars.energy.metricLabel}
                </span>
                <span className="text-lg font-extrabold text-[#C7A55A]">
                  {t.act2.pillars.energy.metric}
                </span>
              </div>
            </div>

            {/* Card 2: Krankenkasse (3D Cross & Health Pulse Rhythm) */}
            <div
              onMouseEnter={() => handlePillarHover('health')}
              onMouseLeave={() => handlePillarHover(null)}
              className={`pointer-events-auto p-6 sm:p-8 rounded-3xl bg-[#0B2238]/85 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-6 ${
                telemetry.hoverTarget === 'health'
                  ? 'border-[#0F8A83] shadow-2xl shadow-[#0F8A83]/30 bg-[#0F2D4A]'
                  : 'border-white/10 hover:border-[#0F8A83]/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  {/* Health Pulse Rhythm Indicator */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[11px] font-mono font-bold">
                    <Activity className="w-3.5 h-3.5 animate-bounce" />
                    <span>72 BPM • Aktiv</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-emerald-400">
                    {t.act2.pillars.health.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#FAFAF7] mt-1">
                    {t.act2.pillars.health.title}
                  </h3>
                </div>
                <p className="text-sm text-[#FAFAF7]/70 leading-relaxed">
                  {t.act2.pillars.health.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-xs text-[#FAFAF7]/60">
                  {t.act2.pillars.health.metricLabel}
                </span>
                <span className="text-lg font-extrabold text-[#C7A55A]">
                  {t.act2.pillars.health.metric}
                </span>
              </div>
            </div>

            {/* Card 3: Mobility (Reinforced Metallic Shield) */}
            <div
              onMouseEnter={() => handlePillarHover('mobility')}
              onMouseLeave={() => handlePillarHover(null)}
              className={`pointer-events-auto p-6 sm:p-8 rounded-3xl bg-[#0B2238]/85 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-6 ${
                telemetry.hoverTarget === 'mobility'
                  ? 'border-[#0F8A83] shadow-2xl shadow-[#0F8A83]/30 bg-[#0F2D4A]'
                  : 'border-white/10 hover:border-[#0F8A83]/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Car className="w-6 h-6" />
                  </div>
                  {/* Metallic Shield Rim Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C7A55A]/20 border border-[#C7A55A]/50 text-[#C7A55A] text-[11px] font-mono font-bold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Vollkasko 100%</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-cyan-400">
                    {t.act2.pillars.mobility.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#FAFAF7] mt-1">
                    {t.act2.pillars.mobility.title}
                  </h3>
                </div>
                <p className="text-sm text-[#FAFAF7]/70 leading-relaxed">
                  {t.act2.pillars.mobility.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-xs text-[#FAFAF7]/60">
                  {t.act2.pillars.mobility.metricLabel}
                </span>
                <span className="text-lg font-extrabold text-[#C7A55A]">
                  {t.act2.pillars.mobility.metric}
                </span>
              </div>
            </div>

            {/* Card 4: Telecom (Glowing Fiber Web) */}
            <div
              onMouseEnter={() => handlePillarHover('telecom')}
              onMouseLeave={() => handlePillarHover(null)}
              className={`pointer-events-auto p-6 sm:p-8 rounded-3xl bg-[#0B2238]/85 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-6 ${
                telemetry.hoverTarget === 'telecom'
                  ? 'border-[#0F8A83] shadow-2xl shadow-[#0F8A83]/30 bg-[#0F2D4A]'
                  : 'border-white/10 hover:border-[#0F8A83]/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Wifi className="w-6 h-6" />
                  </div>
                  {/* Glowing Fiber Web Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[11px] font-mono font-bold animate-pulse">
                    <Layers className="w-3.5 h-3.5" />
                    <span>1.000 Mbit/s</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-purple-400">
                    {t.act2.pillars.telecom.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#FAFAF7] mt-1">
                    {t.act2.pillars.telecom.title}
                  </h3>
                </div>
                <p className="text-sm text-[#FAFAF7]/70 leading-relaxed">
                  {t.act2.pillars.telecom.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-xs text-[#FAFAF7]/60">
                  {t.act2.pillars.telecom.metricLabel}
                </span>
                <span className="text-lg font-extrabold text-[#C7A55A]">
                  {t.act2.pillars.telecom.metric}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACT 3: The Multilingual Flip & Real-Time Savings Engine */}
      <section
        id="act-3"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-24 relative"
      >
        <div className="max-w-5xl mx-auto w-full space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F8A83]/20 border border-[#0F8A83]/40 text-[#0F8A83] text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.act3.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAFAF7] tracking-tight">
              {t.act3.title}
            </h2>
            <p className="text-base sm:text-lg text-[#FAFAF7]/70">
              {t.act3.subtitle}
            </p>
          </div>

          <div className="pointer-events-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B2238]/95 to-[#0F2D4A]/95 backdrop-blur-2xl border border-[#C7A55A]/30 shadow-2xl space-y-10">
            {/* Act III Interactive Language Switcher Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#07192A]/80 border border-white/10">
              <div className="flex items-center gap-2.5 text-xs text-[#FAFAF7]/80">
                <Globe className="w-4 h-4 text-[#C7A55A]" />
                <span className="font-semibold">3D Typography & RTL Morph:</span>
                <span className="px-2 py-0.5 rounded-md bg-[#0F8A83]/30 text-[#1DF8E0] font-mono text-[11px]">
                  {t.act3.brand3DText}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#2D3748]/70 p-1 rounded-xl border border-white/10">
                {languages.map((item) => (
                  <button
                    key={`act3-lang-${item.code}`}
                    onClick={() => setLanguage(item.code)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      language === item.code
                        ? 'bg-[#0F8A83] text-white shadow-lg shadow-[#0F8A83]/40'
                        : 'text-[#FAFAF7]/70 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider & Savings Readout */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10">
              <div className="space-y-4 w-full md:w-1/2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#FAFAF7]/80">
                  <Users className="w-4 h-4 text-[#0F8A83]" />
                  <span>
                    {t.act3.sliderLabel}:{' '}
                    <strong className="text-white text-base">
                      {telemetry.householdSize} {t.act3.personsLabel}
                    </strong>
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={telemetry.householdSize}
                  onChange={handleHouseholdChange}
                  className="w-full accent-[#0F8A83] h-2 bg-[#2D3748] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#FAFAF7]/50 font-mono">
                  <span>1 P. (480 €)</span>
                  <span>2 P. (940 €)</span>
                  <span>3 P. (1.120 €)</span>
                  <span>4 P. (1.480 €)</span>
                  <span>5 P. (1.650 €)</span>
                  <span>Gewerbe (2.350 €)</span>
                </div>

                {/* 3D Life-Shield Category Selector */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { label: 'Single', persons: 1, savings: 480 },
                    { label: 'Paar', persons: 2, savings: 940 },
                    { label: 'Familie', persons: 4, savings: 1480 },
                    { label: 'Gewerbe', persons: 6, savings: 2350 },
                  ].map((tier) => (
                    <button
                      key={tier.label}
                      onClick={() => {
                        antigravityController.setHouseholdSize(tier.persons);
                        antigravityController.setSavingsValue(tier.savings);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        telemetry.savingsValue === tier.savings
                          ? 'bg-[#5CBFBD] text-[#0F2D4A] font-bold border-[#5CBFBD] shadow-lg shadow-[#5CBFBD]/30'
                          : 'bg-[#15426b]/40 text-[#FAFAF7]/80 border-white/10 hover:border-[#5CBFBD]/40'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`w-full md:w-1/2 flex flex-col ${isRTL ? 'items-start text-left' : 'items-end text-right'}`}>
                <span className="text-xs uppercase font-semibold text-[#0F8A83] tracking-wider">
                  {t.act3.savingsPrefix}
                </span>
                <div className="text-5xl sm:text-6xl font-extrabold text-[#C7A55A] font-mono tracking-tight mt-1">
                  ~{telemetry.savingsValue.toLocaleString()} {t.act3.savingsSuffix}
                </div>
                <span className="text-xs text-[#FAFAF7]/50 mt-1">
                  {t.act3.savingsNote}
                </span>
              </div>
            </div>

            {/* 4 Pillars Savings Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#2D3748]/40 border border-white/5">
                <div className="text-xs text-[#FAFAF7]/60">{t.act2.pillars.energy.title}</div>
                <div className="text-xl font-bold text-white mt-1">
                  ~{Math.round(telemetry.savingsValue * 0.40)} €
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#2D3748]/40 border border-white/5">
                <div className="text-xs text-[#FAFAF7]/60">{t.act2.pillars.health.title}</div>
                <div className="text-xl font-bold text-white mt-1">
                  ~{Math.round(telemetry.savingsValue * 0.30)} €
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#2D3748]/40 border border-white/5">
                <div className="text-xs text-[#FAFAF7]/60">{t.act2.pillars.mobility.title}</div>
                <div className="text-xl font-bold text-white mt-1">
                  ~{Math.round(telemetry.savingsValue * 0.20)} €
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#2D3748]/40 border border-white/5">
                <div className="text-xs text-[#FAFAF7]/60">{t.act2.pillars.telecom.title}</div>
                <div className="text-xl font-bold text-white mt-1">
                  ~{Math.round(telemetry.savingsValue * 0.10)} €
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => antigravityController.openConsultation()}
                className="px-8 py-4 rounded-2xl bg-[#0F8A83] hover:bg-[#0F8A83]/90 text-white font-bold text-base shadow-xl shadow-[#0F8A83]/30 transition-all flex items-center gap-3 cursor-pointer"
              >
                <span>{t.nav.ctaConsultation}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ACT 4: The Sanctuary of Flow & Interactive Digital CRM Client Portal */}
      <section
        id="act-4"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-24 relative"
      >
        <div className="max-w-6xl mx-auto w-full space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C7A55A]/20 border border-[#C7A55A]/40 text-[#C7A55A] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.act4.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAFAF7] tracking-tight">
              {t.act4.title}
            </h2>
            <p className="text-base sm:text-lg text-[#FAFAF7]/70">
              {t.act4.subtitle}
            </p>
          </div>

          <div className="pointer-events-auto p-8 sm:p-12 rounded-3xl bg-[#0B2238]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-8">
            {/* CRM Portal Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-bold text-[#0F8A83] tracking-wider block">
                  {t.act4.portalSubtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {t.act4.portalTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2 bg-[#07192A] p-1.5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setPortalTab('overview')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    portalTab === 'overview'
                      ? 'bg-[#0F8A83] text-white shadow'
                      : 'text-[#FAFAF7]/70 hover:text-white'
                  }`}
                >
                  Übersicht
                </button>
                <button
                  onClick={() => setPortalTab('audit')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    portalTab === 'audit'
                      ? 'bg-[#0F8A83] text-white shadow'
                      : 'text-[#FAFAF7]/70 hover:text-white'
                  }`}
                >
                  Tarif-Audit
                </button>
                <button
                  onClick={() => setPortalTab('protection')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    portalTab === 'protection'
                      ? 'bg-[#0F8A83] text-white shadow'
                      : 'text-[#FAFAF7]/70 hover:text-white'
                  }`}
                >
                  Kündigungsschutz
                </button>
                <button
                  onClick={() => setPortalTab('vault')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    portalTab === 'vault'
                      ? 'bg-[#0F8A83] text-white shadow'
                      : 'text-[#FAFAF7]/70 hover:text-white'
                  }`}
                >
                  Dokumenten-Tresor
                </button>
              </div>
            </div>

            {/* CRM Portal Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-[#FAFAF7]/80">{t.act4.feature1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-[#FAFAF7]/80">{t.act4.feature2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-[#FAFAF7]/80">{t.act4.feature3}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-[#FAFAF7]/80">{t.act4.feature4}</p>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={() => setIsAudited(!isAudited)}
                    className="px-5 py-2.5 rounded-xl bg-[#0F2D4A] hover:bg-[#0F2D4A]/80 border border-[#0F8A83] text-[#1DF8E0] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAudited ? 'animate-spin' : ''}`} />
                    <span>{isAudited ? 'Audit Erfolgreich (Geprüft)' : 'Automatischer Tarif-Audit starten'}</span>
                  </button>
                </div>
              </div>

              {/* Digital Portal Interactive Live HUD Widget */}
              <div className="p-6 rounded-2xl bg-[#0F2D4A] border border-[#C7A55A]/30 space-y-4 font-mono text-xs shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 text-[#C7A55A]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Lock className="w-3.5 h-3.5 text-[#0F8A83]" />
                    <span>DSGVO / GDPR 100% ZERTIFIZIERT</span>
                  </span>
                  <span className="text-emerald-400">STATUS: AKTIV</span>
                </div>

                <div className="space-y-3 text-[#FAFAF7]/80">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span>1. Öko-Strom & Gas (Vattenfall):</span>
                    <span className="text-emerald-400 font-bold">Optimum (-580 €)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span>2. Krankenversicherung (Barmer):</span>
                    <span className="text-emerald-400 font-bold">Zusatzbeitrag minimiert</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span>3. KFZ-Kasko Fristgarantie:</span>
                    <span className="text-[#C7A55A] font-bold">30.11. Frist geschützt</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <span>4. Telekom Glasfaser 1000:</span>
                    <span className="text-emerald-400 font-bold">Aktiv (1 Gbit/s)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-[#FAFAF7]/60">Bestätigte Jahresersparnis:</span>
                  <span className="text-xl font-extrabold text-[#C7A55A]">
                    ~{telemetry.savingsValue.toLocaleString()} € / Jahr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACT 5: The Direct Teleport & Instant Advisor Consultation */}
      <section
        id="act-5"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-24 relative"
      >
        <div className="max-w-4xl mx-auto w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F8A83]/20 border border-[#0F8A83]/40 text-[#0F8A83] text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>{t.act5.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#FAFAF7] tracking-tight">
            {t.act5.title}
          </h2>

          <p className="text-lg sm:text-xl text-[#FAFAF7]/70 max-w-2xl mx-auto leading-relaxed">
            {t.act5.subtitle}
          </p>

          <blockquote className="p-6 rounded-2xl bg-[#0B2238]/80 backdrop-blur-xl border border-white/10 italic text-[#FAFAF7]/80 text-sm sm:text-base max-w-xl mx-auto shadow-xl">
            &ldquo;{t.act5.advisorQuote}&rdquo;
            <div className="mt-3 text-xs not-italic font-bold text-[#C7A55A]">
              — {t.consultation.advisorName} ({t.consultation.advisorRole})
            </div>
          </blockquote>

          <div className="pt-4">
            <button
              onClick={() => antigravityController.openConsultation()}
              className="pointer-events-auto px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-[#C7A55A] to-[#D4AF37] text-[#0F2D4A] font-extrabold text-base sm:text-lg shadow-2xl shadow-[#C7A55A]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-3"
            >
              <span>{t.act5.ctaButton}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
