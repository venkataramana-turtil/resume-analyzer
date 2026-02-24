import { CandidateCard } from './CandidateCard.jsx'
import { ATSSection } from './ATSSection.jsx'
import { ImprovementPlanSection } from './ImprovementPlanSection.jsx'
import { SalarySection } from './SalarySection.jsx'
import { PersonalSalarySection } from './PersonalSalarySection.jsx'
import { MarketFitSection } from './MarketFitSection.jsx'
import { CandidateVsMarketSection } from './CandidateVsMarketSection.jsx'

const GhostCard = ({ label }) => (
  <div className="rounded-2xl border px-5 py-4 flex items-center gap-3"
    style={{ borderColor: '#1e1e35', borderStyle: 'dashed', background: '#0d0d18' }}>
    <span className="inline-block w-3 h-3 rounded-full border-2 animate-spin shrink-0"
      style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
    <span className="text-xs" style={{ color: '#374151', fontFamily: "'DM Mono', monospace" }}>
      Loading {label}...
    </span>
  </div>
);

export const ResultsDashboard = ({ sections, streaming, charCount, market, onReset }) => {
  const { candidate, ats, improvement_plan, salary, personal_salary, market_fit, candidate_vs_market } = sections;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between fade">
        <div className="flex items-center gap-2">
          <span className="text-lg">📄</span>
          <h1 className="text-lg font-bold text-white">Resume Analysis</h1>
          {streaming && (
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full"
              style={{ background: 'rgba(124,58,237,.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#a78bfa' }} />
              Analyzing
            </span>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded" style={{ background: '#1e1e35', color: '#6b7280' }}>
          {charCount.toLocaleString()} chars parsed
        </span>
      </div>

      {candidate       ? <CandidateCard c={candidate} />                                                      : streaming && <GhostCard label="candidate profile" />}
      {ats             ? <ATSSection ats={ats} />                                                              : streaming && <GhostCard label="ATS score" />}
      {improvement_plan ? <ImprovementPlanSection plan={improvement_plan} currentScore={ats?.score ?? 0} />   : streaming && <GhostCard label="improvement plan" />}
      {salary          ? <SalarySection salary={salary} market={market} />                                    : streaming && <GhostCard label="salary ranges" />}
      {personal_salary ? <PersonalSalarySection ps={personal_salary} market={market} />                       : streaming && <GhostCard label="personal salary" />}
      {market_fit      ? <MarketFitSection mf={market_fit} />                                                 : streaming && <GhostCard label="hiring confidence" />}
      {candidate_vs_market ? <CandidateVsMarketSection cvm={candidate_vs_market} />                          : streaming && <GhostCard label="you vs. market" />}

      {!streaming && (
        <div className="text-center pt-4 pb-10 fade">
          <button onClick={onReset}
            className="px-8 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-80 border"
            style={{ borderColor: '#7c3aed', color: '#a78bfa', background: 'rgba(124,58,237,.08)',
              fontFamily: "'Space Mono',monospace" }}>
            ↩ Analyze Another Resume
          </button>
        </div>
      )}
    </div>
  );
};
