import { useState, useEffect } from 'react'
import { atsColor } from '../helpers.js'

const priorityMeta = {
  'Critical': { color: '#ff4444', bg: 'rgba(255,68,68,.08)',   border: 'rgba(255,68,68,.25)',   dot: '🔴' },
  'High':     { color: '#ff9900', bg: 'rgba(255,153,0,.08)',   border: 'rgba(255,153,0,.25)',   dot: '🟠' },
  'Medium':   { color: '#aacc00', bg: 'rgba(170,204,0,.08)',   border: 'rgba(170,204,0,.25)',   dot: '🟡' },
};

export const ImprovementPlanSection = ({ plan, currentScore }) => {
  const tips    = plan.tips || [];
  const potScore = plan.potential_score ?? 100;
  const gap     = potScore - currentScore;

  // Animate the potential score bar
  const [barW, setBarW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setBarW(potScore), 400);
    return () => clearTimeout(t);
  }, [potScore]);

  return (
    <div className="fade-2 rounded-2xl border overflow-hidden" style={{ borderColor:'#1e1e35' }}>

      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Road to 100</h3>
            <p className="text-xs mt-0.5" style={{ color:'#6b7280' }}>
              Apply these fixes to unlock {gap > 0 ? `+${gap} pts` : 'your full potential'}
            </p>
          </div>
          {/* Score jump */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: atsColor(currentScore), fontFamily:"'Space Mono',monospace" }}>
                {currentScore}
              </div>
              <div className="text-xs" style={{ color:'#4b5563' }}>now</div>
            </div>
            <div className="text-xl" style={{ color:'#4b5563' }}>→</div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: atsColor(potScore), fontFamily:"'Space Mono',monospace" }}>
                {potScore}
              </div>
              <div className="text-xs" style={{ color:'#4b5563' }}>potential</div>
            </div>
          </div>
        </div>

        {/* Progress bar: current filled, potential as lighter extension */}
        <div className="relative h-3 rounded-full overflow-hidden" style={{ background:'#1e1e35' }}>
          {/* Potential fill */}
          <div className="gauge-fill absolute inset-y-0 left-0 rounded-full"
            style={{ width:`${barW}%`, background:'rgba(124,58,237,.25)' }} />
          {/* Current fill */}
          <div className="absolute inset-y-0 left-0 rounded-full"
            style={{ width:`${currentScore}%`,
              background:`linear-gradient(to right,${atsColor(currentScore)}99,${atsColor(currentScore)})` }} />
          {/* Potential marker */}
          <div className="absolute top-0 bottom-0 w-px"
            style={{ left:`${potScore}%`, background:'rgba(255,255,255,.4)' }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color:'#4b5563' }}>
          <span>0</span>
          <span style={{ color: atsColor(potScore) }}>max reachable: {potScore}</span>
          <span>100</span>
        </div>
      </div>

      {/* Tips list */}
      <div className="divide-y" style={{ background:'#0f0f1a', borderColor:'#1e1e35' }}>
        {tips.map((tip, i) => {
          const meta = priorityMeta[tip.priority] || priorityMeta['Medium'];
          return (
            <div key={i} className="px-6 py-4 flex gap-4 items-start transition-colors hover:bg-white/[0.02]">
              {/* Left: priority dot + impact */}
              <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5" style={{ minWidth: 44 }}>
                <span className="text-base leading-none">{meta.dot}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ background: meta.bg, color: meta.color, border:`1px solid ${meta.border}`,
                    fontFamily:"'Space Mono',monospace", whiteSpace:'nowrap' }}>
                  +{tip.score_impact}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white">{tip.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background:'rgba(255,255,255,.05)', color:'#6b7280' }}>
                    {tip.category}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color:'#9ca3af' }}>{tip.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
