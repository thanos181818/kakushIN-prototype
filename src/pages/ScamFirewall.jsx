import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import ThinkingAnimation from '../components/ThinkingAnimation';
import PageHeader from '../components/PageHeader';
import { analyzeMessage } from '../utils/scamAnalysis';
import { useHealthScoreContext } from '../context/HealthScoreContext';

const SEVERITY_CONFIG = {
  danger: {
    bg: 'bg-danger-light',
    border: 'border-danger-mid',
    text: 'text-danger',
    icon: AlertTriangle,
    labelKey: 'scam.highRisk'
  },
  warning: {
    bg: 'bg-warning-light',
    border: 'border-warning-mid',
    text: 'text-warning',
    icon: AlertCircle,
    labelKey: 'scam.caution'
  },
  safe: {
    bg: 'bg-success-light',
    border: 'border-success-mid',
    text: 'text-success',
    icon: ShieldCheck,
    labelKey: 'scam.lowRisk'
  },
};

export default function ScamFirewall() {
  const { t } = useTranslation();
  const { triggerEvent } = useHealthScoreContext();
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('idle'); // idle, analyzing, done
  const [result, setResult] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);

  const samples = t('scam.samples', { returnObjects: true }) || [];

  const handleAnalyse = () => {
    if (!inputText.trim()) return;
    setStatus('analyzing');
    setResult(null);
    setExpandedIds([]);

    setTimeout(() => {
      const findings = analyzeMessage(inputText);
      const severity = findings.some(f => f.severity === 'high') ? 'danger' : findings.length > 0 ? 'warning' : 'safe';
      setResult({ findings, severity, count: findings.length });
      setStatus('done');
      triggerEvent('scam-detected');
    }, 2000);
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
        title={t('scam.title')} 
        subtitle={t('scam.subtitle')} 
      />

      <div className="grid grid-cols-5 gap-6">
        {/* Left: Input Area */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-card">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('scam.placeholder')}
              rows={8}
              className="w-full bg-app-bg border border-border-medium rounded-xl p-4 text-text-primary text-sm font-body resize-none focus:outline-none focus:border-primary transition-colors placeholder:text-text-muted"
            />
            
            <div className="flex flex-wrap gap-2 mb-3">
              {samples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sample.text);
                    setStatus('idle');
                    setResult(null);
                  }}
                  className="border border-primary/20 text-primary hover:bg-primary-light rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
                >
                  {sample.title}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  setInputText('');
                  setStatus('idle');
                  setResult(null);
                }}
                className="border border-border-light text-text-secondary hover:bg-app-bg rounded-xl px-4 py-3 text-[14px] font-semibold transition-all"
              >
                {t('scam.clear')}
              </button>
              <button
                onClick={handleAnalyse}
                disabled={!inputText.trim() || status === 'analyzing'}
                className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl px-4 py-3 text-[14px] font-semibold transition-all disabled:opacity-40 shadow-blue"
              >
                {status === 'analyzing' ? t('scam.analyzing') : t('scam.analyze')}
              </button>
            </div>
          </div>

          {status === 'analyzing' && (
            <div className="bg-white border border-border-light rounded-2xl p-8 shadow-card flex justify-center">
              <ThinkingAnimation text={t('scam.analyzing')} />
            </div>
          )}

          {/* Results Analysis */}
          <AnimatePresence>
            {status === 'done' && result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {result.findings.map((finding, idx) => {
                  const sev = SEVERITY_CONFIG[finding.severity] || SEVERITY_CONFIG.warning;
                  const SevIcon = sev.icon;
                  const isExpanded = expandedIds.includes(finding.id);
                  return (
                    <div
                      key={finding.id}
                      className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-card"
                    >
                      <button
                        onClick={() => toggleExpand(finding.id)}
                        className="w-full p-4 text-left flex items-start gap-4"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sev.bg} ${sev.text}`}>
                          <SevIcon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${sev.text}`}>
                              {t(sev.labelKey)}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-[15px] text-text-primary">
                            {t(`scamPatterns.${finding.id}.technique`, { defaultValue: finding.technique })}
                          </h4>
                          <p className="text-text-secondary text-xs mt-1">
                            {t('scam.detectedKeyword')}: <span className="font-mono font-semibold">"{finding.matchedKeyword}"</span>
                          </p>
                        </div>
                        <div className="mt-2">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                            <div className="space-y-3">
                              <p className="text-text-primary text-sm leading-relaxed font-body">
                                {t(`scamPatterns.${finding.id}.explanation`, { defaultValue: finding.explanation })}
                              </p>
                              <div className="p-3 bg-app-bg rounded-lg border-l-4 border-primary/30">
                                <p className="text-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1">{t('scam.legalContext')}</p>
                                <p className="text-text-primary text-[13px] font-body leading-relaxed">
                                  {t(`scamPatterns.${finding.id}.legalContext`, { defaultValue: finding.legalContext })}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {result.severity === 'safe' && (
                  <div className="bg-success-light border border-success-mid rounded-2xl p-6 flex items-start gap-4 shadow-card">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-success">
                        {t('scam.safe')}
                      </h4>
                      <p className="text-text-secondary text-sm mt-1 font-body leading-relaxed">
                        {t('scam.noPatternsFound')}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Educational Sidebar */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-card">
            <h3 className="font-display font-bold text-text-primary mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-primary" />
              {t('scam.howItWorks')}
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</div>
                <p className="text-text-secondary text-xs leading-relaxed font-body">{t('scam.step1Desc')}</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</div>
                <p className="text-text-secondary text-xs leading-relaxed font-body">{t('scam.step2Desc')}</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</div>
                <p className="text-text-secondary text-xs leading-relaxed font-body">{t('scam.step3Desc')}</p>
              </div>
            </div>
          </div>

          <div className="bg-sidebar rounded-2xl p-6 shadow-card text-white">
            <h4 className="font-display font-bold text-[15px] mb-3 text-primary-light">
              {t('scam.proTipForRajesh')}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed font-body italic">
              "{t('scam.proTipText')}"
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
