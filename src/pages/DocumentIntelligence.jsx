import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Upload, ChevronDown, ChevronUp, AlertTriangle, AlertCircle, CheckCircle, Search, ShieldAlert, FileSearch } from 'lucide-react';
import ThinkingAnimation from '../components/ThinkingAnimation';
import PageHeader from '../components/PageHeader';
import { useHealthScoreContext } from '../context/HealthScoreContext';
import documentData from '../data/document-analysis.json';

const ANALYSIS_STEPS = [
  { key: 'classifying', icon: <FileSearch size={14} /> },
  { key: 'extracting', icon: <FileText size={14} /> },
  { key: 'checkingInterest', icon: <CheckCircle size={14} /> },
  { key: 'scanningCharges', icon: <CheckCircle size={14} /> },
  { key: 'verifyingFees', icon: <CheckCircle size={14} /> },
];

const SEVERITY_CONFIG = {
  high: { 
    bg: 'bg-danger-light', 
    border: 'border-danger-mid', 
    text: 'text-danger', 
    labelKey: 'docs.highRisk', 
    icon: AlertTriangle 
  },
  medium: { 
    bg: 'bg-warning-light', 
    border: 'border-warning-mid', 
    text: 'text-warning', 
    labelKey: 'docs.mediumRisk', 
    icon: AlertCircle 
  },
};

export default function DocumentIntelligence() {
  const { t } = useTranslation();
  const { triggerEvent } = useHealthScoreContext();
  const [status, setStatus] = useState('idle'); // idle, analyzing, done
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [expandedIds, setExpandedIds] = useState([]);

  const issues = documentData.summary.level2.issues;

  const handleUpload = () => {
    setStatus('analyzing');
    setVisibleSteps(0);
    setExpandedIds([]);

    const interval = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= ANALYSIS_STEPS.length) {
          clearInterval(interval);
          setTimeout(() => setStatus('done'), 800);
          triggerEvent('document-analysed');
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <PageHeader 
        title={t('docs.title')} 
        subtitle={t('docs.subtitle')} 
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left: Action Area */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-2 border-dashed border-border-medium rounded-2xl p-12 text-center shadow-card group hover:border-primary/50 transition-all cursor-pointer"
              onClick={handleUpload}
            >
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                {t('docs.upload')}
              </h3>
              <p className="text-text-secondary text-sm font-body max-w-xs mx-auto mb-6 whitespace-pre-line">
                {t('docs.aiReadingModeDetail')}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-border-light" />
                <span className="text-text-muted text-[11px] font-bold uppercase tracking-widest">{t('docs.orUseSample')}</span>
                <span className="h-px w-8 bg-border-light" />
              </div>
              <button className="mt-4 text-primary text-sm font-bold hover:underline">
                {t('docs.useSample')}
              </button>
            </motion.div>
          )}

          {status === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-border-light rounded-2xl p-8 shadow-card"
            >
              <div className="flex flex-col items-center text-center">
                <ThinkingAnimation text={t('docs.analyzing')} />
                
                <div className="mt-8 w-full max-w-sm space-y-3">
                  {ANALYSIS_STEPS.map((step, idx) => (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: idx < visibleSteps ? 1 : 0.3,
                        x: 0
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-app-bg border border-border-light"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${idx < visibleSteps ? 'bg-success/20 text-success' : 'bg-slate-200 text-slate-400'}`}>
                        {step.icon}
                      </div>
                      <span className="text-text-primary text-sm font-medium">
                        {t(`docs.${step.key}`)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Analysis */}
          <AnimatePresence>
            {status === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* 30-second summary */}
                <div className="bg-primary-light border border-primary-mid border-l-4 border-l-primary rounded-2xl p-6 shadow-card">
                  <h3 className="font-display font-bold text-lg text-primary mb-2 flex items-center gap-2">
                    <ShieldAlert size={20} />
                    {t('docs.summary30s')}
                  </h3>
                  <p className="text-text-primary text-[15px] font-body leading-relaxed">
                    {documentData.summary.level1.content}
                  </p>
                </div>

                {/* Issue Cards */}
                {issues.map((issue, idx) => {
                  const sev = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.medium;
                  const SevIcon = sev.icon;
                  const isExpanded = expandedIds.includes(issue.id);
                  return (
                    <div
                      key={issue.id}
                      className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-card"
                    >
                      <button
                        onClick={() => toggleExpand(issue.id)}
                        className="w-full p-5 text-left flex items-start gap-4"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sev.bg} ${sev.text}`}>
                          <SevIcon size={22} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${sev.text}`}>
                              {t('docs.issueLabel')} {issue.id} · {t(sev.labelKey)}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-[16px] text-text-primary">
                            {issue.flag}
                          </h4>
                        </div>
                        <div className="mt-2">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 pt-2 border-t border-app-bg"
                          >
                            <div className="space-y-4">
                              <div className="bg-danger-light border-l-4 border-danger p-4 rounded-lg">
                                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-1.5">{t('docs.problematicClause')}</p>
                                <p className="text-text-primary text-sm font-mono leading-relaxed bg-white/50 p-2 rounded border border-danger-mid/30">
                                  {issue.clause}
                                </p>
                              </div>
                              <div>
                                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-1.5">{t('docs.theReality')}</p>
                                <p className="text-text-primary text-sm font-body leading-relaxed">
                                  {issue.explanation}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Info Sidebar */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          {status === 'done' && (
            <div className="bg-white border border-border-light rounded-2xl p-6 shadow-card">
              <h3 className="font-display font-bold text-text-primary text-[15px] mb-4">{t('docs.documentMeta')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-app-bg">
                  <span className="text-text-secondary text-xs font-body">{t('docs.name')}</span>
                  <span className="text-text-primary text-xs font-bold">{documentData.documentName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-app-bg">
                  <span className="text-text-secondary text-xs font-body">{t('docs.type')}</span>
                  <span className="text-text-primary text-xs font-bold">{documentData.documentType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-app-bg">
                  <span className="text-text-secondary text-xs font-body">{t('docs.amount')}</span>
                  <span className="text-text-primary text-xs font-bold">₹{documentData.loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-text-secondary text-xs font-body">{t('docs.tenure')}</span>
                  <span className="text-text-primary text-xs font-bold">{documentData.tenureMonths} {t('docs.months')}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-sidebar rounded-xl text-white">
                <h4 className="font-display font-bold text-sm text-primary-light mb-2 flex items-center gap-2">
                  <Search size={14} />
                  {t('docs.recommendation')}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-body">
                  {documentData.recommendation}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-card">
            <h3 className="font-display font-bold text-text-primary text-[15px] mb-4 flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              {t('docs.aiReadingMode')}
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed font-body">
              {t('docs.aiReadingModeDetail')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
