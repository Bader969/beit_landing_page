import React, { useState } from 'react';
import { useLanguage } from '../i18n/language-context';
import { antigravityController } from '../store/antigravity-controller';
import { TelemetryState } from '../types/telemetry';
import { X, MessageCircle, PhoneCall, Calendar, CheckCircle2 } from 'lucide-react';

interface ConsultationDrawerProps {
  telemetry: TelemetryState;
}

export const ConsultationDrawer: React.FC<ConsultationDrawerProps> = ({ telemetry }) => {
  const { t, isRTL } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    householdSize: telemetry.householdSize || 3,
  });

  if (!telemetry.isConsultationOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      // Optional auto-close or reset after success
    }, 4000);
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed inset-0 z-50 flex items-center ${
        isRTL ? 'justify-start' : 'justify-end'
      } bg-black/70 backdrop-blur-md transition-all`}
    >
      <div
        className={`w-full max-w-xl h-full bg-[#0F2D4A] ${
          isRTL ? 'border-r' : 'border-l'
        } border-[#C7A55A]/30 p-6 sm:p-10 overflow-y-auto space-y-8 flex flex-col justify-between shadow-2xl ${
          isRTL ? 'text-right font-arabic' : 'text-left'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="text-xs uppercase tracking-wider text-[#0F8A83] font-bold">
              {t.consultation.subtitle}
            </span>
            <button
              onClick={() => antigravityController.closeConsultation()}
              className="p-2 rounded-xl bg-[#2D3748] hover:bg-[#2D3748]/80 text-[#FAFAF7] transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#FAFAF7]">
              {t.consultation.title}
            </h3>
            {/* Live Household & Savings Summary Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#07192A] border border-[#C7A55A]/30 text-xs font-mono">
              <span className="text-[#FAFAF7]/70">Haushalt: {telemetry.householdSize} Personen</span>
              <span className="text-[#C7A55A] font-bold">~{telemetry.savingsValue} € / Jahr Ersparnis</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B2238] border border-[#0F8A83]/30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0F8A83] to-[#C7A55A] p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-[#0F2D4A] flex items-center justify-center font-bold text-lg text-[#C7A55A]">
                  {t.consultation.advisorName.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-[#FAFAF7]">{t.consultation.advisorName}</h4>
                <p className="text-xs text-[#0F8A83] font-medium">{t.consultation.advisorRole}</p>
                <p className="text-xs text-[#FAFAF7]/60 mt-1">{t.consultation.advisorBio}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <a
              href="https://wa.me/491500000000"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 flex items-center gap-3 transition-all text-[#FAFAF7] hover:bg-emerald-900/30"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-sm font-semibold">{t.consultation.channels.whatsapp}</div>
            </a>
            <div className="p-3.5 rounded-xl bg-[#0F8A83]/20 border border-[#0F8A83]/40 flex items-center gap-3 transition-all text-[#FAFAF7]">
              <PhoneCall className="w-5 h-5 text-[#0F8A83] shrink-0" />
              <div className="text-sm font-semibold">{t.consultation.channels.callback}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#C7A55A]/20 border border-[#C7A55A]/40 flex items-center gap-3 transition-all text-[#FAFAF7]">
              <Calendar className="w-5 h-5 text-[#C7A55A] shrink-0" />
              <div className="text-sm font-semibold">{t.consultation.channels.calendar}</div>
            </div>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-lg text-white">Vielen Dank!</h4>
                <p className="text-xs mt-1 text-emerald-200">{t.consultation.form.successMessage}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#FAFAF7]/80 mb-1">
                  {t.consultation.form.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B2238] border border-white/20 text-[#FAFAF7] focus:outline-none focus:border-[#0F8A83] text-sm"
                  placeholder="Max Mustermann"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FAFAF7]/80 mb-1">
                    {t.consultation.form.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B2238] border border-white/20 text-[#FAFAF7] focus:outline-none focus:border-[#0F8A83] text-sm"
                    placeholder="+49 170 1234567"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#FAFAF7]/80 mb-1">
                    {t.consultation.form.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B2238] border border-white/20 text-[#FAFAF7] focus:outline-none focus:border-[#0F8A83] text-sm"
                    placeholder="kontakt@example.de"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FAFAF7]/80 mb-1">
                  {t.consultation.form.householdLabel} ({formData.householdSize})
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={formData.householdSize}
                  onChange={(e) => {
                    const size = parseInt(e.target.value, 10);
                    setFormData({ ...formData, householdSize: size });
                    antigravityController.setHouseholdSize(size);
                  }}
                  className="w-full accent-[#0F8A83] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0F8A83] to-[#0B2238] border border-[#0F8A83] hover:brightness-110 text-[#FAFAF7] font-bold text-sm shadow-lg shadow-[#0F8A83]/30 transition-all cursor-pointer"
              >
                {t.consultation.form.submitBtn}
              </button>
            </form>
          )}
        </div>

        <div className="pt-6 border-t border-white/10 text-[11px] text-[#FAFAF7]/60">
          <p>{t.consultation.securityNote}</p>
        </div>
      </div>
    </div>
  );
};