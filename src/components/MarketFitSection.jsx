import { confidenceColors } from '../helpers.js'
import { GaugeBar } from './ui/GaugeBar.jsx'

export const MarketFitSection = ({ mf }) => {
  const col = confidenceColors[mf.confidence_label] || '#a78bfa';
  return (
    <div className="fade-3 rounded-2xl border p-6" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
      <h3 className="text-lg font-bold mb-5">Hiring Confidence</h3>

      <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
        {/* Big number */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <span className="text-6xl font-bold pop" style={{ color:col }}>
            {mf.hire_confidence}%
          </span>
          <span className="text-sm font-bold px-3 py-1 rounded-full border"
            style={{ color:col, borderColor:col, background:`${col}22` }}>
            {mf.confidence_label}
          </span>
        </div>
        {/* Gauge + summary */}
        <div className="flex-1 space-y-4">
          <GaugeBar value={mf.hire_confidence} />
          <p className="text-sm leading-relaxed" style={{ color:'#9ca3af' }}>
            {mf.benchmark_summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Strengths */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color:'#6b7280' }}>YOUR STRENGTHS</p>
          <div className="flex flex-col gap-2">
            {(mf.strengths || []).map((s, i) => (
              <span key={i} className="text-xs px-3 py-2 rounded-lg text-center"
                style={{ background:'rgba(0,230,118,.09)', color:'#6ee7b7',
                  border:'1px solid rgba(0,230,118,.2)' }}>{s}</span>
            ))}
          </div>
        </div>
        {/* Gaps */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color:'#6b7280' }}>MARKET GAPS</p>
          <div className="flex flex-col gap-2">
            {(mf.gaps || []).map((g, i) => (
              <span key={i} className="text-xs px-3 py-2 rounded-lg text-center"
                style={{ background:'rgba(255,153,0,.09)', color:'#fbbf24',
                  border:'1px solid rgba(255,153,0,.2)' }}>{g}</span>
            ))}
          </div>
        </div>
        {/* Roles */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color:'#6b7280' }}>ROLES TO TARGET</p>
          <div className="flex flex-col gap-2">
            {(mf.roles_recommended || []).map((r, i) => (
              <span key={i} className="text-xs px-3 py-2 rounded-lg text-center cursor-pointer transition-opacity hover:opacity-75"
                style={{ background:'rgba(124,58,237,.12)', color:'#a78bfa',
                  border:'1px solid rgba(124,58,237,.3)' }}>→ {r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
