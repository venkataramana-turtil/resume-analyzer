import { atsColor } from '../helpers.js'
import { CircularRing } from './ui/CircularRing.jsx'

export const ATSSection = ({ ats }) => {
  const col = atsColor(ats.score);
  return (
    <div className="fade-1 rounded-2xl border p-6" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
      <h3 className="text-lg font-bold mb-5">ATS Analysis</h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Ring + verdict */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <CircularRing score={ats.score} />
          <span className="text-sm font-bold px-4 py-1 rounded-full border"
            style={{ color:col, borderColor:col, background:`${col}22` }}>
            {ats.verdict}
          </span>
        </div>

        {/* Checklist */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold mb-2" style={{ color:'#6b7280' }}>CHECKLIST</p>
          <div>
            {(ats.passed_checks || []).map((chk, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b"
                style={{ borderColor:'#1e1e35' }}>
                <span className="shrink-0 mt-0.5">{chk.status ? '✅' : '❌'}</span>
                <div className="min-w-0">
                  <div className="text-xs font-medium"
                    style={{ color: chk.status ? '#e2e2e2' : '#f87171' }}>{chk.label}</div>
                  {chk.note && (
                    <div className="text-xs mt-0.5" style={{ color:'#6b7280' }}>{chk.note}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {ats.critical_issues?.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold mb-2" style={{ color:'#6b7280' }}>CRITICAL ISSUES</p>
          <div className="space-y-2">
            {ats.critical_issues.map((issue, i) => (
              <div key={i} className="flex gap-2 p-3 rounded-lg border text-xs"
                style={{ background:'rgba(255,68,68,.07)', borderColor:'rgba(255,68,68,.3)', color:'#fca5a5' }}>
                <span className="shrink-0">⚠️</span><span>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {ats.quick_wins?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold mb-2" style={{ color:'#6b7280' }}>QUICK WINS</p>
          <div className="flex flex-wrap gap-2">
            {ats.quick_wins.map((win, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full border"
                style={{ background:'rgba(0,230,118,.07)', borderColor:'rgba(0,230,118,.3)', color:'#6ee7b7' }}>
                ✨ {win}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
