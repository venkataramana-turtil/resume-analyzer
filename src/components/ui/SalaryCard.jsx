import { fmtMoney } from '../../helpers.js'
import { SalaryBar } from './SalaryBar.jsx'

const cardMeta = {
  service_based: { icon: '🏢', from: 'from-blue-900/20',   border: 'border-blue-800/30'   },
  product_based: { icon: '🚀', from: 'from-violet-900/20', border: 'border-violet-800/30' },
  startup:       { icon: '⚡', from: 'from-pink-900/20',   border: 'border-pink-800/30'   },
  freelance:     { icon: '💼', from: 'from-amber-900/20',  border: 'border-amber-800/30'  },
};

export const SalaryCard = ({ type, label, min, median, max, note, delayClass, sym }) => {
  const m = cardMeta[type] || cardMeta.service_based;
  return (
    <div className={`${delayClass} rounded-xl border p-4 bg-gradient-to-br ${m.from} to-transparent ${m.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{m.icon}</span>
        <span className="text-xs font-bold text-white/90 leading-tight">{label}</span>
      </div>
      <SalaryBar min={min} median={median} max={max} sym={sym} />
      <div className="text-center">
        <span className="text-base font-bold text-white">{fmtMoney(min, sym)}</span>
        <span className="text-gray-500 mx-2 text-sm">—</span>
        <span className="text-base font-bold text-white">{fmtMoney(max, sym)}</span>
      </div>
      {note && <p className="text-xs mt-2" style={{ color: '#6b7280' }}>{note}</p>}
    </div>
  );
};
