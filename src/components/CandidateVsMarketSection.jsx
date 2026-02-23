import { useState, useEffect } from 'react'

const cvmStandingMeta = {
  'Top 10%':      { color: '#00e676', bg: 'rgba(0,230,118,.1)',  border: 'rgba(0,230,118,.3)'  },
  'Top 25%':      { color: '#aacc00', bg: 'rgba(170,204,0,.1)',  border: 'rgba(170,204,0,.3)'  },
  'Average':      { color: '#ff9900', bg: 'rgba(255,153,0,.1)',  border: 'rgba(255,153,0,.3)'  },
  'Below Average':{ color: '#ff4444', bg: 'rgba(255,68,68,.1)',  border: 'rgba(255,68,68,.3)'  },
  'Entry Level':  { color: '#ff4444', bg: 'rgba(255,68,68,.1)',  border: 'rgba(255,68,68,.3)'  },
};

export const CandidateVsMarketSection = ({ cvm }) => {
  const meta = cvmStandingMeta[cvm.overall_standing] || cvmStandingMeta['Average'];
  const [animated, setAnimated] = useState(false);
  const [pctLeft, setPctLeft]   = useState(0);

  useEffect(() => {
    const t = setTimeout(() => { setAnimated(true); setPctLeft(cvm.standing_percentile); }, 450);
    return () => clearTimeout(t);
  }, [cvm.standing_percentile]);

  return (
    <div className="fade-4 rounded-2xl border overflow-hidden" style={{ borderColor: '#1e1e35' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,.15),rgba(124,58,237,.1))',
          borderBottom: '1px solid #1e1e35' }}>
        <div className="flex items-center gap-2">
          <span className="text-base">📊</span>
          <h3 className="text-sm font-bold text-white">You vs. Market Average</h3>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full border"
          style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}>
          {cvm.overall_standing}
        </span>
      </div>

      <div className="p-6" style={{ background: '#12121e' }}>
        {/* Summary */}
        <p className="text-sm leading-relaxed mb-5 pb-5 border-b"
          style={{ color: '#9ca3af', borderColor: '#1e1e35' }}>
          {cvm.summary}
        </p>

        {/* Percentile strip */}
        <div className="mb-7">
          <p className="text-xs font-bold mb-3" style={{ color: '#6b7280' }}>MARKET PERCENTILE</p>
          <div className="relative h-2 rounded-full"
            style={{ background: 'linear-gradient(to right,#7f1d1d 0%,#d97706 50%,#166534 100%)' }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white"
              style={{
                left: `${pctLeft}%`,
                background: meta.color,
                boxShadow: `0 0 10px ${meta.color}99`,
                transition: 'left 1.5s cubic-bezier(.34,1.56,.64,1)',
              }} />
          </div>
          <div className="flex justify-between text-xs mt-2" style={{ color: '#4b5563' }}>
            <span>0th</span>
            <span className="font-bold" style={{ color: meta.color, fontFamily:"'Space Mono',monospace" }}>
              {cvm.standing_percentile}th percentile
            </span>
            <span>100th</span>
          </div>
        </div>

        {/* Dimension breakdown */}
        <div className="mb-7">
          <p className="text-xs font-bold mb-4" style={{ color: '#6b7280' }}>DIMENSION BREAKDOWN</p>
          <div className="space-y-4">
            {(cvm.dimensions || []).map((dim, i) => {
              const ahead = dim.candidate_score >= dim.market_avg_score;
              const cPct  = (dim.candidate_score / 10) * 100;
              const mPct  = (dim.market_avg_score / 10) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: '#c4c4d4' }}>{dim.name}</span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold" style={{ color: ahead ? '#6ee7b7' : '#f87171',
                        fontFamily:"'Space Mono',monospace" }}>{dim.candidate_score}/10</span>
                      <span style={{ color: '#4b5563' }}>· avg</span>
                      <span style={{ color: '#6b7280', fontFamily:"'Space Mono',monospace" }}>
                        {dim.market_avg_score}/10
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden" style={{ background: '#1e1e35' }}>
                    {/* Candidate bar */}
                    <div className="gauge-fill absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: animated ? `${cPct}%` : '0%',
                        background: ahead
                          ? 'linear-gradient(to right,#5b21b6,#8b5cf6)'
                          : 'linear-gradient(to right,#7f1d1d,#ef4444)',
                      }} />
                    {/* Market avg marker */}
                    <div className="absolute top-0 bottom-0 w-0.5"
                      style={{ left: `${mPct}%`, background: 'rgba(255,255,255,0.45)', zIndex: 1 }} />
                  </div>
                  {dim.note && (
                    <p className="text-xs mt-0.5" style={{ color: '#4b5563' }}>{dim.note}</p>
                  )}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-4 text-xs" style={{ color: '#4b5563' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-2 rounded-full" style={{ background: '#7c3aed' }} />
              <span>You</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.45)' }} />
              <span>Market average</span>
            </div>
          </div>
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pros */}
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: '#6b7280' }}>YOUR ADVANTAGES</p>
            <div className="space-y-2">
              {(cvm.pros || []).map((pro, i) => (
                <div key={i} className="p-3 rounded-xl flex gap-3"
                  style={{ background: 'rgba(0,230,118,.06)', border: '1px solid rgba(0,230,118,.18)' }}>
                  <span className="shrink-0 text-sm leading-none mt-0.5" style={{ color: '#6ee7b7' }}>↑</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold" style={{ color: '#6ee7b7' }}>{pro.title}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(0,230,118,.1)', color: '#4d7a60', fontSize: '0.6rem' }}>
                        {pro.category}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{pro.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: '#6b7280' }}>MARKET GAPS</p>
            <div className="space-y-2">
              {(cvm.cons || []).map((con, i) => (
                <div key={i} className="p-3 rounded-xl flex gap-3"
                  style={{ background: 'rgba(255,68,68,.06)', border: '1px solid rgba(255,68,68,.18)' }}>
                  <span className="shrink-0 text-sm leading-none mt-0.5" style={{ color: '#f87171' }}>↓</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold" style={{ color: '#f87171' }}>{con.title}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(255,68,68,.1)', color: '#7a4040', fontSize: '0.6rem' }}>
                        {con.category}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{con.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
