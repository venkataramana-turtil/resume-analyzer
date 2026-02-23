import { useState, useEffect } from 'react'

export const GaugeBar = ({ value }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 500); return () => clearTimeout(t); }, [value]);
  return (
    <div className="relative h-5 rounded-full overflow-hidden" style={{ background: '#1e1e35' }}>
      <div className="gauge-fill h-full rounded-full"
        style={{ width: `${w}%`,
          background: 'linear-gradient(to right,#ff4444,#ff9900 35%,#aacc00 65%,#00e676)' }} />
      <div className="absolute inset-0 flex items-center justify-end pr-3">
        <span className="text-xs font-bold text-white/90">{value}%</span>
      </div>
    </div>
  );
};
