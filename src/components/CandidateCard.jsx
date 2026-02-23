import { seniorityStyles } from '../helpers.js'

export const CandidateCard = ({ c }) => {
  const sc = seniorityStyles[c.seniority] || 'bg-gray-700/40 text-gray-300 border-gray-600';
  return (
    <div className="fade rounded-2xl border p-6" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white truncate">{c.name}</h2>
            <span className={`text-xs px-2 py-0.5 rounded border font-bold shrink-0 ${sc}`}>
              {c.seniority}
            </span>
          </div>
          <p className="text-sm mb-3" style={{ color: '#a78bfa' }}>{c.role}</p>
          <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#9ca3af' }}>
            <span>⏱ {(() => {
              const total = Number(c.experience_years);
              const yrs = Math.floor(total);
              const mos = Math.round((total - yrs) * 12);
              if (mos === 0) return `${yrs} yr${yrs !== 1 ? 's' : ''}`;
              if (yrs === 0) return `${mos} mo`;
              return `${yrs} yr${yrs !== 1 ? 's' : ''} ${mos} mo`;
            })()} experience</span>
            <span>🎓 {c.education}</span>
            <span>📍 {c.location_hint}</span>
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold mb-2" style={{ color: '#6b7280' }}>TOP SKILLS</p>
        <div className="flex flex-wrap gap-2">
          {(c.top_skills || []).map((sk, i) => (
            <span key={i} className="text-xs px-3 py-1 rounded-full border"
              style={{ borderColor:'#7c3aed', color:'#a78bfa', background:'rgba(124,58,237,.12)' }}>
              {sk}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
