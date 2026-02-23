import { fmtMoney } from '../../helpers.js'

export const SalaryBar = ({ min, median, max, sym }) => {
  const range = (max - min) || 1;
  const medPct = ((median - min) / range) * 100;
  return (
    <div className="my-3">
      <div className="relative h-5 rounded-full overflow-hidden" style={{ background: '#1a1a2e' }}>
        <div className="absolute inset-0 rounded-full"
          style={{ background: 'linear-gradient(to right,#4c1d95,#7c3aed,#a78bfa)' }} />
        {/* Median marker */}
        <div className="absolute top-0 bottom-0 w-0.5"
          style={{ left: `${medPct}%`, background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 0 6px rgba(255,255,255,0.7)' }} />
      </div>
      <div className="flex justify-between text-xs mt-1.5" style={{ color: '#6b7280' }}>
        <span>{fmtMoney(min, sym)}</span>
        <span className="font-bold" style={{ color: '#a78bfa' }}>↑ {fmtMoney(median, sym)} median</span>
        <span>{fmtMoney(max, sym)}</span>
      </div>
    </div>
  );
};
