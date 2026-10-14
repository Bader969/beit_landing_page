import React, { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from './i18n/language-context';
import { antigravityController } from './store/antigravity-controller';
import { TelemetryState } from './types/telemetry';
import { SceneContainer } from './components/canvas/SceneContainer';
import { Navigation } from './components/Navigation';
import { ActSections } from './components/ActSections';
import { TelemetryHUD } from './components/TelemetryHUD';
import { ConsultationDrawer } from './components/ConsultationDrawer';

const AppContent: React.FC = () => {
  const { isRTL } = useLanguage();
  const [telemetry, setTelemetry] = useState<TelemetryState>(() => antigravityController.getState());

  useEffect(() => {
    const unsubscribe = antigravityController.subscribe((state) => {
      setTelemetry(state);
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      antigravityController.setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-[#0F2D4A] text-[#FAFAF7] font-sans ${isRTL ? 'font-arabic' : ''} relative`}>
      {/* 3D WebGL Procedural Background Scene */}
      <SceneContainer telemetry={telemetry} />

      {/* Scrollytelling HTML Layer */}
      <Navigation telemetry={telemetry} />
      <ActSections telemetry={telemetry} />
      <TelemetryHUD telemetry={telemetry} />
      <ConsultationDrawer telemetry={telemetry} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
