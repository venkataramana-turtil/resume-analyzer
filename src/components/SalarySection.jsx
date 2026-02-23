import { SalaryCard } from './ui/SalaryCard.jsx'

export const SalarySection = ({ salary, market }) => {
  const delays = ['fade-2','fade-3','fade-4','fade-5'];
  const types = ['service_based','product_based','startup','freelance'];
  return (
    <div className="fade-2 rounded-2xl border p-6" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
      <div className="flex items-center gap-2 mb-5">
        <h3 className="text-lg font-bold">Salary Ranges</h3>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background:'#1e1e35', color:'#6b7280' }}>
          {salary.currency}
        </span>
        <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1"
          style={{ background:'rgba(124,58,237,.15)', color:'#a78bfa', border:'1px solid rgba(124,58,237,.3)' }}>
          {market.flag} {market.name}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {types.map((t, i) => (
          <SalaryCard key={t} type={t} delayClass={delays[i]} sym={market.sym} {...salary[t]} />
        ))}
      </div>
    </div>
  );
};
