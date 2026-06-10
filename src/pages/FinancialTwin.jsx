import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Info, ArrowUpRight, Target, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useHealthScoreContext } from '../context/HealthScoreContext';
import { calculateProjections } from '../utils/twinCalculations';

const RISK_LEVELS = ['conservative', 'balanced', 'growth'];

export default function FinancialTwin() {
  const { t } = useTranslation();
  const { triggerEvent } = useHealthScoreContext();
  const [monthlyAmount, setMonthlyAmount] = useState(2000);
  const [riskLevel, setRiskLevel] = useState('balanced');

  const { chartData, tenYearSavings, tenYearMedian, difference, probability } = calculateProjections(
    monthlyAmount,
    riskLevel
  );

  const formatINR = (val) => `₹${val.toLocaleString('en-IN')}`;

  const handleSliderChange = (e) => {
    setMonthlyAmount(Number(e.target.value));
    triggerEvent('twin-explored');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <PageHeader 
        title={t('twin.title')} 
        subtitle={t('twin.subtitle')} 
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left: Controls */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-text-primary text-[15px]">{t('twin.investmentPlan')}</h3>
              <Target size={18} className="text-primary" />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-text-secondary text-xs font-body uppercase tracking-wider">{t('twin.monthlyAmount')}</label>
                  <span className="font-mono text-lg font-bold text-primary">{formatINR(monthlyAmount)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={monthlyAmount}
                  onChange={handleSliderChange}
                  className="w-full accent-primary h-2 bg-app-bg rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-text-muted text-[10px] font-mono">₹500</span>
                  <span className="text-text-muted text-[10px] font-mono">₹10,000</span>
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-xs font-body uppercase tracking-wider block mb-3">{t('twin.riskLevel')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {RISK_LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setRiskLevel(level);
                        triggerEvent('twin-explored');
                      }}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        riskLevel === level
                          ? 'bg-primary text-white border-primary shadow-blue'
                          : 'bg-white text-text-secondary border-border-light hover:border-primary/30'
                      }`}
                    >
                      {t(`twin.${level}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-card">
            <h3 className="font-display font-bold text-text-primary text-[15px] mb-4">{t('twin.tenYearOutlook')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-app-bg rounded-xl">
                <span className="text-text-secondary text-sm">{t('twin.savingsAccount')}</span>
                <span className="font-mono text-sm font-bold text-text-primary">{formatINR(tenYearSavings)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary-light border border-primary-mid rounded-xl">
                <span className="text-primary text-sm font-semibold">{t('twin.liquidFund')}</span>
                <span className="font-mono text-sm font-bold text-primary">{formatINR(tenYearMedian)}</span>
              </div>
              <div className="pt-2 flex justify-between items-center px-1">
                <span className="text-text-primary text-sm font-bold">{t('twin.difference')}</span>
                <div className="flex items-center gap-1 text-success">
                  <ArrowUpRight size={16} />
                  <span className="font-mono text-xl font-bold">{formatINR(difference)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visualization */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-danger" />
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{t('twin.pessimistic')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{t('twin.median')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{t('twin.optimistic')}</span>
                </div>
              </div>
              <TrendingUp size={20} className="text-text-muted" />
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tickFormatter={(y) => `${y}y`}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <Tooltip
                    formatter={(v) => [formatINR(v), '']}
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 12,
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      padding: '12px',
                    }}
                    labelFormatter={(y) => `Year ${y}`}
                    itemStyle={{ fontSize: 13, fontWeight: 700, padding: '2px 0' }}
                    labelStyle={{ fontSize: 11, color: '#64748B', marginBottom: '4px', fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="pessimistic" stroke="#DC2626" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="median" stroke="#2563EB" strokeWidth={4} dot={false} />
                  <Line type="monotone" dataKey="optimistic" stroke="#16A34A" strokeWidth={2} dot={false} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-sidebar rounded-2xl p-6 text-white flex items-center justify-between shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <ShieldCheck size={28} className="text-primary" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-body uppercase tracking-widest">{t('twin.probability')}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">{probability}%</p>
              </div>
            </div>
            <div className="flex-1 max-w-[200px] ml-8">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${probability}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
