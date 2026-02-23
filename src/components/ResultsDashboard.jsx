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
  { key: 'market_fit',          label: 'Hiring confidence'   },
  { key: 'candidate_vs_market', label: 'You vs. Market'      },
];

const StepTracker = ({ sections, streaming }) => {
  const allDone = STEPS.every(s => sections[s.key]);
  if (allDone) return null;

  const currentIdx = STEPS.findIndex(s => !sections[s.key]);

  return (
    <div className="fade rounded-xl border px-5 py-4" style={{ borderColor: '#1e1e35', background: '#12121e' }}>
      <p className="text-xs font-bold mb-3" style={{ color: '#6b7280', letterSpacing: '0.08em' }}>ANALYZING</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {STEPS.map((step, i) => {
          const done   = !!sections[step.key];
          const active = i === currentIdx && streaming;
          return (
            <div key={step.key} className="flex items-center gap-2">
              {done ? (
                <span className="text-xs" style={{ color: '#6ee7b7' }}>✓</span>
              ) : active ? (
                <span className="inline-block w-3 h-3 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
              ) : (
                <span className="inline-block w-3 h-3 rounded-full border"
                  style={{ borderColor: '#2d2d4a' }} />
              )}
              <span className="text-xs" style={{
                color: done ? '#6ee7b7' : active ? '#a78bfa' : '#374151',
                fontFamily: "'DM Mono', monospace",
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
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

      {/* Step tracker — visible until all sections loaded */}
      <StepTracker sections={sections} streaming={streaming} />

      {candidate       && <CandidateCard c={candidate} />}
      {ats             && <ATSSection ats={ats} />}
      {improvement_plan && <ImprovementPlanSection plan={improvement_plan} currentScore={ats?.score ?? 0} />}
      {salary          && <SalarySection salary={salary} market={market} />}
      {personal_salary && <PersonalSalarySection ps={personal_salary} market={market} />}
      {market_fit      && <MarketFitSection mf={market_fit} />}
      {candidate_vs_market && <CandidateVsMarketSection cvm={candidate_vs_market} />}

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
