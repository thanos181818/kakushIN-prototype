import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Landmark, ArrowLeft, Clock, CheckCircle, Search, ExternalLink } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useHealthScoreContext } from '../context/HealthScoreContext';
import schemesData from '../data/schemes.json';

export default function SchemeEligibility() {
  const { t } = useTranslation();
  const { triggerEvent } = useHealthScoreContext();
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleSchemeClick = (scheme) => {
    setSelectedScheme(scheme);
    triggerEvent('scheme-viewed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <PageHeader 
        title={t('schemes.title')} 
        subtitle={t('schemes.subtitle')} 
      />

      {!selectedScheme ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {schemesData.map((scheme, idx) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSchemeClick(scheme)}
                className="bg-white border border-border-light rounded-2xl p-6 shadow-card hover:border-primary/40 cursor-pointer transition-all group flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Landmark size={24} />
                </div>
                <h3 className="font-display font-bold text-text-primary text-lg leading-tight mb-2">
                  {t(`schemesData.${scheme.id}.name`, { defaultValue: scheme.name })}
                </h3>
                <p className="text-text-secondary text-sm font-body line-clamp-2 mb-4">
                  {t(`schemesData.${scheme.id}.description`, { defaultValue: scheme.description })}
                </p>
                <div className="mt-auto pt-4 border-t border-app-bg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-muted text-[11px] font-bold uppercase tracking-wider">{t('schemes.match')}</span>
                    <span className="text-primary text-[11px] font-bold">{scheme.matchScore}%</span>
                  </div>
                  <div className="h-1.5 bg-app-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${scheme.matchScore}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white border border-border-light rounded-2xl p-8 shadow-card flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success flex-shrink-0">
              <CheckCircle size={48} />
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-text-primary mb-2">
                {t('schemes.totalBenefits')}: ₹7,20,000
              </h4>
              <p className="text-text-secondary text-sm font-body leading-relaxed max-w-2xl">
                {t('schemes.closingNote')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-border-light rounded-2xl shadow-card overflow-hidden"
        >
          {/* Header */}
          <div className="bg-sidebar p-8 text-white relative">
            <button 
              onClick={() => setSelectedScheme(null)}
              className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              {t('schemes.back')}
            </button>
            
            <div className="mt-8 flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary-light">
                <Landmark size={40} />
              </div>
              <div>
                <h2 className="font-display font-bold text-3xl">{t(`schemesData.${selectedScheme.id}.name`, { defaultValue: selectedScheme.name })}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <Clock size={14} />
                    {selectedScheme.applicationSteps[0].time}
                  </div>
                  <div className="flex items-center gap-1.5 text-success text-sm font-semibold">
                    <CheckCircle size={14} />
                    {t(`schemesData.${selectedScheme.id}.benefit`, { defaultValue: selectedScheme.benefit })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-3 space-y-8">
              <section>
                <h4 className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Search size={14} className="text-primary" />
                  {t('schemes.stepByStepGuide')}
                </h4>
                <div className="space-y-4">
                  {selectedScheme.applicationSteps.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-app-bg rounded-xl border border-border-light group hover:border-primary/20 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary text-[15px] font-bold font-display leading-tight">
                          {t(`schemesData.${selectedScheme.id}.steps.${i}.title`, { defaultValue: step.title })}
                        </p>
                        <p className="text-text-secondary text-sm font-body mt-1 leading-relaxed">
                          {t(`schemesData.${selectedScheme.id}.steps.${i}.detail`, { defaultValue: step.detail })}
                        </p>
                      </div>
                      <div className="text-[10px] font-bold text-text-muted uppercase tracking-tighter mt-1">{step.time}</div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-primary-light border border-primary-mid rounded-xl p-5 italic text-primary-dark text-sm font-body leading-relaxed">
                "{t('schemes.closingNote')}"
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="bg-white border border-border-light rounded-2xl p-6 shadow-raised">
                <h4 className="font-display font-bold text-text-primary mb-4">{t('schemes.whatYouNeed')}</h4>
                <div className="space-y-3">
                  {['aadhar', 'bankPassbook', 'phoneNumber', 'rationCard'].map((key) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center text-success">
                        <CheckCircle size={12} />
                      </div>
                      <span className="text-text-secondary text-sm font-medium">{t(`schemes.documents.${key}`)}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-body font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-blue transition-all">
                  {t('schemes.applyOnline')} <ExternalLink size={16} />
                </button>
              </div>

              <div className="bg-app-bg rounded-2xl p-6 border border-dashed border-border-medium">
                <h4 className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-3">{t('schemes.questions')}</h4>
                <p className="text-text-muted text-xs leading-relaxed font-body">
                  {t('schemes.visitNearestCSC')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
