import { MARKETS } from '../config.js'

export const MarketPicker = ({ market, setMarket }) => (
  <div className="mb-6">
    <p className="text-xs font-bold mb-2" style={{ color:'#6b7280' }}>TARGET MARKET</p>
    <div className="grid grid-cols-5 gap-2">
      {MARKETS.map(m => {
        const active = market.id === m.id;
        return (
          <button key={m.id} onClick={() => setMarket(m)}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all duration-150"
            style={{
              background:   active ? 'rgba(124,58,237,.2)' : '#12121e',
              borderColor:  active ? '#7c3aed' : '#1e1e35',
              boxShadow:    active ? '0 0 12px rgba(124,58,237,.3)' : 'none',
              transform:    active ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{m.flag}</span>
            <span className="text-center leading-tight" style={{
              fontSize: '0.6rem', fontWeight: 700,
              color: active ? '#a78bfa' : '#6b7280',
            }}>{m.short}</span>
          </button>
        );
      })}
    </div>
    <p className="text-xs mt-2" style={{ color:'#4b5563' }}>
      Salaries calibrated to <span style={{ color:'#a78bfa' }}>{market.name}</span> standards in{' '}
      <span style={{ color:'#a78bfa' }}>{market.currency}</span>
    </p>
  </div>
);
