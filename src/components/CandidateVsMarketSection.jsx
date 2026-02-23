import { useState, useEffect } from 'react'

const cvmStandingMeta = {
  'Top 10%':      { color: '#00e676', bg: 'rgba(0,230,118,.1)',  border: 'rgba(0,230,118,.3)'  },
  'Top 25%':      { color: '#aacc00', bg: 'rgba(170,204,0,.1)',  border: 'rgba(170,204,0,.3)'  },
  'Average':      { color: '#ff9900', bg: 'rgba(255,153,0,.1)',  border: 'rgba(255,153,0,.3)'  },
  'Below Average':{ color: '#ff4444', bg: 'rgba(255,68,68,.1)',  border: 'rgba(255,68,68,.3)'  },
  'Entry Level':  { color: '#ff4444', bg: 'rgba(255,68,68,.1)',  border: 'rgba(255,68,68,.3)'  },
};

// Short axis labels for the radar
const AXIS_LABELS = ['Technical', 'Experience', 'Achievements', 'Education', 'Domain', 'Presentation'];

const RadarChart = ({ dimensions, accentColor }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 350); return () => clearTimeout(t); }, []);

  const cx = 130, cy = 125, maxR = 88, labelR = 112;
  const n = 6;
  const angles = Array.from({ length: n }, (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / n);

  const pt = (score, idx) => ({
    x: cx + (score / 10) * maxR * Math.cos(angles[idx]),
    y: cy + (score / 10) * maxR * Math.sin(angles[idx]),
  });

  const toPath = pts =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + 'Z';

  const cPts = dimensions.map((d, i) => pt(d.candidate_score,  i));
  const mPts = dimensions.map((d, i) => pt(d.market_avg_score, i));

  // Concentric grid rings at 2, 4, 6, 8, 10
  const grid = [2, 4, 6, 8, 10].map(v =>
    toPath(angles.map(a => ({ x: cx + (v / 10) * maxR * Math.cos(a), y: cy + (v / 10) * maxR * Math.sin(a) })))
  );

  return (
    <div style={{ opacity: show ? 1 : 0, transition: 'opacity 0.7s ease' }}>
      <svg width="260" height="250" viewBox="0 0 260 250" overflow="visible">
        {/* Grid rings */}
        {grid.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1e1e35" strokeWidth="1" />
        ))}
        {/* Axis spokes */}
        {angles.map((a, i) => (
          <line key={i}
            x1={cx} y1={cy}
            x2={cx + maxR * Math.cos(a)} y2={cy + maxR * Math.sin(a)}
            stroke="#1e1e35" strokeWidth="1"
          />
        ))}
        {/* Market avg polygon — dashed white */}
        <path d={toPath(mPts)}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        {/* Candidate polygon — solid accent */}
        <path d={toPath(cPts)}
          fill="rgba(124,58,237,0.22)"
          stroke="#7c3aed"
          strokeWidth="2"
        />
        {/* Candidate dots */}
        {cPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5"
            fill="#7c3aed" stroke="#0a0a0f" strokeWidth="1.5" />
        ))}
        {/* Market avg dots */}
        {mPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5"
            fill="rgba(255,255,255,0.35)" />
        ))}
        {/* Axis labels */}
        {angles.map((a, i) => {
          const lx = cx + labelR * Math.cos(a);
          const ly = cy + labelR * Math.sin(a);
          const anchor = lx < cx - 8 ? 'end' : lx > cx + 8 ? 'start' : 'middle';
          const d = dimensions[i];
          const ahead = d.candidate_score >= d.market_avg_score;
          return (
            <g key={i}>
              <text x={lx} y={ly - 5} textAnchor={anchor} dominantBaseline="middle"
                fontSize="9" fill="#9ca3af" fontFamily="'DM Mono', monospace">
                {AXIS_LABELS[i]}
              </text>
              <text x={lx} y={ly + 6} textAnchor={anchor} dominantBaseline="middle"
                fontSize="8.5" fontWeight="bold" fill={ahead ? '#6ee7b7' : '#f87171'}
                fontFamily="'Space Mono', monospace">
                {d.candidate_score}/10
              </text>
            </g>
          );
        })}
        {/* Grid value labels at centre-right */}
        {[2, 4, 6, 8].map(v => (
          <text key={v}
            x={cx + (v / 10) * maxR * Math.cos(-Math.PI / 2) + 4}
            y={cy + (v / 10) * maxR * Math.sin(-Math.PI / 2) - 3}
            fontSize="7" fill="#374151" fontFamily="monospace" textAnchor="start">
            {v}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-1 text-xs justify-center" style={{ color: '#4b5563' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 rounded-full" style={{ background: '#7c3aed' }} />
          <circle />
          <span>You</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0" style={{ borderTop: '1.5px dashed rgba(255,255,255,0.3)' }} />
          <span>Market avg</span>
        </div>
      </div>
    </div>
  );
};

export const CandidateVsMarketSection = ({ cvm }) => {
  const meta = cvmStandingMeta[cvm.overall_standing] || cvmStandingMeta['Average'];
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 450);
    return () => clearTimeout(t);
  }, []);

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
        <p className="text-sm leading-relaxed mb-6 pb-5 border-b"
          style={{ color: '#9ca3af', borderColor: '#1e1e35' }}>
          {cvm.summary}
        </p>

        {/* Radar chart replaces the old percentile bar */}
        <div className="mb-7">
          <div className="flex items-start justify-between mb-1">
            <p className="text-xs font-bold" style={{ color: '#6b7280' }}>SKILL RADAR</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ color: meta.color, background: meta.bg, fontFamily: "'Space Mono',monospace" }}>
              {cvm.standing_percentile}th percentile
            </span>
          </div>
          <div className="flex justify-center">
            <RadarChart dimensions={cvm.dimensions || []} accentColor={meta.color} />
          </div>
        </div>

        {/* Dimension notes list */}
        <div className="mb-7">
          <p className="text-xs font-bold mb-3" style={{ color: '#6b7280' }}>DIMENSION BREAKDOWN</p>
          <div className="space-y-3">
            {(cvm.dimensions || []).map((dim, i) => {
              const ahead = dim.candidate_score >= dim.market_avg_score;
              const delta = dim.candidate_score - dim.market_avg_score;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex items-center gap-1.5 shrink-0 w-36">
                    <span className="text-xs font-medium" style={{ color: '#c4c4d4' }}>{dim.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold" style={{
                      color: ahead ? '#6ee7b7' : '#f87171',
                      fontFamily: "'Space Mono',monospace"
                    }}>{dim.candidate_score}/10</span>
                    <span className="text-xs" style={{ color: '#374151' }}>vs</span>
                    <span className="text-xs" style={{ color: '#6b7280', fontFamily: "'Space Mono',monospace" }}>
                      {dim.market_avg_score}/10
                    </span>
                    <span className="text-xs font-bold" style={{
                      color: ahead ? '#6ee7b7' : '#f87171',
                      fontFamily: "'Space Mono',monospace"
                    }}>
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                  {dim.note && (
                    <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>{dim.note}</p>
                  )}
                </div>
              );
            })}
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
