import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

const HealthScoreContext = createContext();

export function HealthScoreProvider({ children }) {
  const { t } = useTranslation();
  const [score, setScore] = useState(47);
  const [firedEvents, setFiredEvents] = useState([]);
  const [toast, setToast] = useState(null);

  const triggerEvent = (eventType) => {
    const boosts = {
      'scam-detected': { points: 8, labelKey: 'scam-detected' },
      'scheme-viewed': { points: 6, labelKey: 'scheme-viewed' },
      'document-analysed': { points: 7, labelKey: 'document-analysed' },
      'twin-explored': { points: 4, labelKey: 'twin-explored' },
    };
    if (firedEvents.includes(eventType)) return;
    const boost = boosts[eventType];
    if (!boost) return;
    setScore((prev) => Math.min(prev + boost.points, 100));
    setFiredEvents((prev) => [...prev, eventType]);
    setToast(t(`boosts.${boost.labelKey}`));
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <HealthScoreContext.Provider value={{ score, triggerEvent, toast }}>
      {children}
      {toast && (
        <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[100] bg-white text-text-primary text-sm md:text-base font-semibold px-5 md:px-8 py-2.5 md:py-3.5 rounded-full shadow-lg border border-border animate-fade-in-down flex items-center gap-2 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-success" />
          {toast}
        </div>
      )}
    </HealthScoreContext.Provider>
  );
}

export const useHealthScoreContext = () => useContext(HealthScoreContext);
