import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowUpRight, ArrowDownRight, Home as HomeIcon, ShoppingCart, Fuel, Phone, Banknote, AlertTriangle } from 'lucide-react';
import HealthScoreRing from '../components/HealthScoreRing';
import PageHeader from '../components/PageHeader';
import { useHealthScoreContext } from '../context/HealthScoreContext';
import rajeshData from '../data/rajesh.json';

const CATEGORY_ICONS = {
  gig: Zap,
  housing: HomeIcon,
  debt: Banknote,
  food: ShoppingCart,
  utilities: Phone,
  transport: Fuel,
};

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { score } = useHealthScoreContext();
  const { income, transactions, profile } = rajeshData;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <PageHeader 
        title={t('dashboard.greeting')} 
        subtitle="Monday, 25 November · Pune" 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Income Card */}
        <div className="bg-white border border-border-light rounded-2xl p-5 shadow-card">
          <p className="text-text-secondary text-xs font-body uppercase tracking-wider mb-1">{t('dashboard.income')}</p>
          <p className="font-mono text-3xl font-semibold text-text-primary tracking-tight">
            ₹{income.lastThreeMonths[2].toLocaleString('en-IN')}
          </p>
          <p className="text-success text-xs font-body mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} />
            {t('dashboard.thisMonth')}
          </p>
        </div>

        {/* Floor Card */}
        <div className="bg-white border border-border-light rounded-2xl p-5 shadow-card">
          <p className="text-text-secondary text-xs font-body uppercase tracking-wider mb-1">{t('dashboard.floor')}</p>
          <p className="font-mono text-3xl font-semibold text-text-primary tracking-tight">
            ₹{income.survivalFloor.toLocaleString('en-IN')}
          </p>
          <p className="text-text-secondary text-xs font-body mt-1">{t('dashboard.survivalMinimum')}</p>
        </div>

        {/* Buffer Card */}
        <div className="bg-white border border-border-light rounded-2xl p-5 shadow-card">
          <p className="text-text-secondary text-xs font-body uppercase tracking-wider mb-1">{t('dashboard.buffer')}</p>
          <p className="font-mono text-3xl font-semibold text-text-primary tracking-tight">
            ₹{income.currentBuffer.toLocaleString('en-IN')}
          </p>
          <p className="text-warning text-xs font-body mt-1">{t('dashboard.currentSavings')}</p>
        </div>

        {/* Health Score Card */}
        <div className="bg-white border border-border-light rounded-2xl p-4 shadow-card flex items-center gap-4">
          <div className="flex-shrink-0">
            <HealthScoreRing score={score} size={80} strokeWidth={6} />
          </div>
          <div>
            <p className="text-text-secondary text-xs font-body uppercase tracking-wider">{t('dashboard.score')}</p>
            <p className="font-mono text-2xl font-bold text-text-primary">{score}/100</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Income Breakdown */}
        <div className="col-span-1 md:col-span-3 bg-white border border-border-light rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-app-bg">
            <h2 className="font-display text-[15px] font-semibold text-text-primary">{t('dashboard.incomeTierBreakdown')}</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-text-secondary text-xs font-body w-24 text-right">{t('dashboard.survivalFloor')}</span>
                <div className="flex-1 h-2.5 bg-app-bg rounded-full overflow-hidden">
                  <div className="h-full bg-danger/70 rounded-full" style={{ width: `${(income.survivalFloor / income.monthlyMedian) * 100}%` }} />
                </div>
                <span className="font-mono text-text-primary text-xs w-16">₹{income.survivalFloor.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-secondary text-xs font-body w-24 text-right">{t('dashboard.stabilityBuffer')}</span>
                <div className="flex-1 h-2.5 bg-app-bg rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: `${(income.currentBuffer / income.stabilityBuffer) * 100}%` }} />
                </div>
                <span className="font-mono text-warning text-xs w-16">₹{income.currentBuffer.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-muted text-xs font-body w-24 text-right">{t('dashboard.growthZone')}</span>
                <div className="flex-1 h-2.5 bg-app-bg rounded-full overflow-hidden">
                  <div className="h-full bg-success/40 rounded-full" style={{ width: '0%' }} />
                </div>
                <span className="font-mono text-text-muted text-xs w-16">₹0</span>
              </div>
            </div>
            <p className="text-text-secondary text-xs text-center font-medium pt-2 border-t border-app-bg">
              {t('dashboard.bufferNeeded')}
            </p>
          </div>
        </div>

        {/* Scheme Alert */}
        <div className="col-span-1 md:col-span-2 bg-primary-light border border-primary-mid border-l-4 border-l-primary rounded-2xl p-6 flex flex-col justify-between shadow-card">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-primary fill-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">{t('dashboard.schemeAlertLabel')}</span>
            </div>
            <h3 className="font-display font-bold text-lg text-text-primary leading-tight">
              {t('dashboard.schemesFound')}
            </h3>
            <p className="text-text-secondary text-sm mt-2 font-body">
              {t('dashboard.schemesDetail')}
            </p>
          </div>
          <button 
            onClick={() => navigate('/schemes')}
            className="mt-4 bg-primary hover:bg-primary-dark text-white font-body text-[14px] font-semibold px-4 py-2.5 rounded-xl shadow-blue transition-all"
          >
            {t('dashboard.viewSchemes')} →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transactions */}
        <div className="bg-white border border-border-light rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-app-bg flex justify-between items-center">
            <h2 className="font-display text-[15px] font-semibold text-text-primary">{t('dashboard.recentTransactions')}</h2>
            <button className="text-primary text-xs font-semibold hover:underline">{t('dashboard.viewAll')}</button>
          </div>
          <div className="p-2">
            {recentTransactions.map((tx) => {
              const Icon = CATEGORY_ICONS[tx.category] || Banknote;
              const isIncome = tx.amount > 0;
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3 hover:bg-app-bg rounded-xl transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isIncome ? 'bg-success/10 text-success' : 'bg-app-bg text-text-secondary'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium truncate">
                      {t(`transactions.${tx.description.toLowerCase()}`, { defaultValue: tx.description })}
                    </p>
                    <p className="text-text-muted text-[11px] font-body">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className={`font-mono text-sm font-bold ${isIncome ? 'text-success' : 'text-text-primary'}`}>
                    {isIncome ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Debt Tracker */}
        <div className="bg-white border border-border-light rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-app-bg">
            <h2 className="font-display text-[15px] font-semibold text-text-primary">{t('dashboard.debtTracker')}</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="p-3 bg-danger-light border border-danger-mid rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center text-danger">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <p className="text-text-primary text-sm font-semibold">{t('dashboard.quickCashLoan')}</p>
                  <p className="text-danger text-[10px] font-bold uppercase tracking-wider">36% {t('dashboard.highRate')}</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-text-primary">₹8,000</span>
            </div>
            <div className="p-3 bg-warning-light border border-warning-mid rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <p className="text-text-primary text-sm font-semibold">{t('dashboard.moneyTap')}</p>
                  <p className="text-warning text-[10px] font-bold uppercase tracking-wider">24% {t('dashboard.highRate')}</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-text-primary">₹5,000</span>
            </div>
            <div className="pt-2 border-t border-app-bg flex justify-between items-center px-1">
              <span className="text-text-secondary text-xs font-medium">{t('dashboard.combinedMonthlyEMI')}</span>
              <span className="font-mono text-sm font-bold text-text-primary">₹1,840/mo</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
