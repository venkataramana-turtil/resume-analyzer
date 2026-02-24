export const atsColor = s => s <= 40 ? '#ff4444' : s <= 65 ? '#ff9900' : s <= 85 ? '#aacc00' : '#00e676';

// sym comes from the selected market object; Indian rupee uses en-IN for lakh/crore commas
export const fmtMoney = (n, sym = '$') => {
  const locale = sym.trim() === '₹' ? 'en-IN' : 'en-US';
  return sym + new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(n));
};

export const generateTagline = (file) => {
  const kb   = Math.round(file.size / 1024);
  const secs = Math.min(45, Math.max(18, Math.round(18 + kb / 18)));
  const lines = [
    `Distilling ${kb}KB of career history into pure signal · ~${secs}s`,
    `Running your resume through 10 ATS filters and a market teardown · ~${secs}s`,
    `Reading between every bullet point so recruiters don't have to · ~${secs}s`,
    `Benchmarking you against 2026 hiring standards · ~${secs}s`,
    `Doing in ${secs}s what most HR teams take 3 weeks to ignore`,
    `Turning ${kb}KB of hustle into a data-driven story · ~${secs}s`,
    `Simulating the recruiter's first 30 seconds on your resume · ~${secs}s`,
    `Cross-referencing your skills against live market demand · ~${secs}s`,
  ];
  return lines[Math.floor(Math.random() * lines.length)];
};

export const confidenceColors = {
  'Unlikely':    '#ff4444',
  'Possible':    '#ff9900',
  'Likely':      '#aacc00',
  'Strong':      '#00e676',
  'Exceptional': '#00e676',
};

export const seniorityStyles = {
  'Junior':    'bg-blue-900/40 text-blue-300 border-blue-700/60',
  'Mid':       'bg-violet-900/40 text-violet-300 border-violet-700/60',
  'Senior':    'bg-amber-900/40 text-amber-300 border-amber-700/60',
  'Lead':      'bg-orange-900/40 text-orange-300 border-orange-700/60',
  'Principal': 'bg-red-900/40 text-red-300 border-red-700/60',
  'Executive': 'bg-pink-900/40 text-pink-300 border-pink-700/60',
};
