import { CandidateCard } from './CandidateCard.jsx'
import { ATSSection } from './ATSSection.jsx'
import { ImprovementPlanSection } from './ImprovementPlanSection.jsx'
import { SalarySection } from './SalarySection.jsx'
import { PersonalSalarySection } from './PersonalSalarySection.jsx'
import { MarketFitSection } from './MarketFitSection.jsx'
import { CandidateVsMarketSection } from './CandidateVsMarketSection.jsx'

const STEPS = [
  { key: 'candidate',           label: 'Candidate profile'  },
  { key: 'ats',                 label: 'ATS score'           },
  { key: 'improvement_plan',    label: 'Improvement plan'    },
  { key: 'salary',              label: 'Salary ranges'       },
  { key: 'personal_salary',     label: 'Personal salary'     },
  { key: 'market_fit',          label: 'Hiring confidence'   },
  { key: 'candidate_vs_market', label: 'You vs. Market'      },
];

const FloatingPill = ({ sections, streaming }) => {
  if (!streaming) return null;

  const done    = STEPS.filter(s => sections[s.key]).length;
  const total   = STEPS.length;
  const pending = STEPS.filter(s => !sections[s.key]);
  const current = pending[0];

  if (!current) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      style={{ pointerEvents: 'none' }}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg"
        style={{
          background: '#12121e',
          border: '1px solid rgba(124,58,237,.4)',
          boxShadow: '0 4px 24px rgba(0,0,0,.5), 0 0 0 1px rgba(124,58,237,.15)',
        }}>
        {/* Spinner */}
        <span className="inline-block w-3.5 h-3.5 rounded-full border-2 animate-spin shrink-0"
          style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
        {/* Label */}
        <div>
          <p className="text-xs font-medium leading-none mb-0.5" style={{ color: '#a78bfa', fontFamily: "'DM Mono',monospace" }}>
            {current.label}
          </p>
          <p className="text-xs leading-none" style={{ color: '#374151', fontFamily: "'DM Mono',monospace" }}>
            {done} / {total} loaded
          </p>
        </div>
      </div>
    </div>
  );
};

export const ResultsDashboard = ({ sections, streaming, charCount, market, onReset }) => {
  const { candidate, ats, improvement_plan, salary, personal_salary, market_fit, candidate_vs_market } = sections;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between fade">
        <div className="flex items-center gap-2">
          <span className="text-lg">📄</span>
          <h1 className="text-lg font-bold text-white">Resume Analysis</h1>
        </div>
        <span className="text-xs px-2 py-1 rounded" style={{ background: '#1e1e35', color: '#6b7280' }}>
          {charCount.toLocaleString()} chars parsed
        </span>
      </div>

      {candidate            && <CandidateCard c={candidate} />}
      {ats                  && <ATSSection ats={ats} />}
      {improvement_plan     && <ImprovementPlanSection plan={improvement_plan} currentScore={ats?.score ?? 0} />}
      {salary               && <SalarySection salary={salary} market={market} />}
      {personal_salary      && <PersonalSalarySection ps={personal_salary} market={market} />}
      {market_fit           && <MarketFitSection mf={market_fit} />}
      {candidate_vs_market  && <CandidateVsMarketSection cvm={candidate_vs_market} />}

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

      <FloatingPill sections={sections} streaming={streaming} />
    </div>
  );
};
