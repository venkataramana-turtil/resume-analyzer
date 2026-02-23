import { useState, useEffect } from 'react'
import { fmtMoney } from '../helpers.js'

export const PersonalSalarySection = ({ ps, market }) => {
  const sym = market.sym;
  const range = (ps.stretch - ps.floor) || 1;
  const targetPct = ((ps.target - ps.floor) / range) * 100;

  // Animated target number counter
  const [displayTarget, setDisplayTarget] = useState(0);
  useEffect(() => {
    const steps = 40;
    const increment = ps.target / steps;
    let current = 0;
    const id = setInterval(() => {
      current += increment;
      if (current >= ps.target) { setDisplayTarget(ps.target); clearInterval(id); }
      else setDisplayTarget(Math.round(current));
    }, 30);
    return () => clearInterval(id);
  }, [ps.target]);

  return (
    <div className="fade-3 rounded-2xl border overflow-hidden" style={{ borderColor:'#1e1e35' }}>
      {/* Header bar */}
      <div className="px-6 py-3 flex items-center justify-between"
        style={{ background:'linear-gradient(135deg,rgba(124,58,237,.25),rgba(168,85,247,.1))',
          borderBottom:'1px solid #1e1e35' }}>
        <div className="flex items-center gap-2">
          <span className="text-base">💰</span>
          <h3 className="text-sm font-bold text-white">What You Can Demand</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded"
          style={{ background:'rgba(124,58,237,.2)', color:'#a78bfa',
            border:'1px solid rgba(124,58,237,.3)' }}>
          {market.flag} {market.name} · {ps.currency}
        </span>
      </div>

      <div className="p-6" style={{ background:'#12121e' }}>
        {/* Three number cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Floor */}
          <div className="rounded-xl p-4 text-center border"
            style={{ background:'rgba(255,153,0,.06)', borderColor:'rgba(255,153,0,.2)' }}>
            <p className="text-xs font-bold mb-1" style={{ color:'#6b7280' }}>FLOOR</p>
            <p className="text-lg font-bold" style={{ color:'#fbbf24', fontFamily:"'Space Mono',monospace" }}>
              {fmtMoney(ps.floor, sym)}
            </p>
            <p className="text-xs mt-1" style={{ color:'#4b5563' }}>Walk-away min</p>
          </div>

          {/* Target — hero card */}
          <div className="rounded-xl p-4 text-center border relative"
            style={{ background:'rgba(124,58,237,.12)', borderColor:'rgba(124,58,237,.5)',
              boxShadow:'0 0 24px rgba(124,58,237,.2)' }}>
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background:'#7c3aed', color:'#fff' }}>YOUR ASK</span>
            </div>
            <p className="text-xs font-bold mb-1 mt-1" style={{ color:'#a78bfa' }}>TARGET</p>
            <p className="text-2xl font-bold text-white" style={{ fontFamily:"'Space Mono',monospace" }}>
              {fmtMoney(displayTarget, sym)}
            </p>
            <p className="text-xs mt-1" style={{ color:'#7c3aed' }}>Lead with this</p>
          </div>

          {/* Stretch */}
          <div className="rounded-xl p-4 text-center border"
            style={{ background:'rgba(0,230,118,.06)', borderColor:'rgba(0,230,118,.2)' }}>
            <p className="text-xs font-bold mb-1" style={{ color:'#6b7280' }}>STRETCH</p>
            <p className="text-lg font-bold" style={{ color:'#6ee7b7', fontFamily:"'Space Mono',monospace" }}>
              {fmtMoney(ps.stretch, sym)}
            </p>
            <p className="text-xs mt-1" style={{ color:'#4b5563' }}>With competing offers</p>
          </div>
        </div>

        {/* Range bar with markers */}
        <div className="relative mb-6">
          {/* Track */}
          <div className="h-2 rounded-full" style={{
            background:'linear-gradient(to right,rgba(251,191,36,.4),rgba(124,58,237,.6),rgba(110,231,183,.4))'
          }} />
          {/* Target marker */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left:`${targetPct}%` }}>
            <div className="w-4 h-4 rounded-full border-2 border-white"
              style={{ background:'#7c3aed', boxShadow:'0 0 10px rgba(124,58,237,.8)' }} />
          </div>
          {/* Floor dot */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2.5 h-2.5 rounded-full -translate-x-1/2"
            style={{ background:'#fbbf24' }} />
          {/* Stretch dot */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2.5 h-2.5 rounded-full translate-x-1/2"
            style={{ background:'#6ee7b7' }} />
        </div>

        {/* Rationale */}
        {ps.rationale && (
          <p className="text-sm leading-relaxed mb-5 pb-5 border-b" style={{
            color:'#9ca3af', borderColor:'#1e1e35'
          }}>
            {ps.rationale}
          </p>
        )}

        {/* Negotiation tips */}
        {ps.negotiation_tips?.length > 0 && (
          <div>
            <p className="text-xs font-bold mb-3" style={{ color:'#6b7280' }}>NEGOTIATION TIPS</p>
            <div className="space-y-2">
              {ps.negotiation_tips.map((tip, i) => (
                <div key={i} className="flex gap-3 text-xs p-3 rounded-lg"
                  style={{ background:'rgba(124,58,237,.07)', border:'1px solid rgba(124,58,237,.15)' }}>
                  <span className="shrink-0 font-bold" style={{ color:'#7c3aed' }}>0{i + 1}</span>
                  <span style={{ color:'#c4b5fd' }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
