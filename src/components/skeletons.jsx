export const SK = ({ h = 4, w = 'full', cls = '' }) => (
  <div className={`shimmer-block rounded-lg ${cls}`} style={{ height: h * 4, width: w === 'full' ? '100%' : w }} />
);

export const Skeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
    <div className="shimmer-block h-36 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="shimmer-block h-64 md:col-span-2" />
      <div className="shimmer-block h-64 md:col-span-3" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="shimmer-block h-44" />)}
    </div>
    <div className="shimmer-block h-56 w-full" />
  </div>
);

export const CandidateCardSkeleton = () => (
  <div className="rounded-2xl border p-6 fade" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
    <div className="flex gap-2 items-center mb-2"><SK h={7} w={192} /><SK h={5} w={64} /></div>
    <SK h={4} w={128} cls="mb-3" />
    <div className="flex gap-4 mb-5"><SK h={3} w={96} /><SK h={3} w={120} /><SK h={3} w={80} /></div>
    <SK h={3} w={80} cls="mb-2" />
    <div className="flex gap-2">{[88,72,80,64,76].map((w,i)=><SK key={i} h={7} w={w} cls="rounded-full" />)}</div>
  </div>
);

export const ATSSkeleton = () => (
  <div className="rounded-2xl border p-6 fade-1" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
    <SK h={5} w={140} cls="mb-5" />
    <div className="flex gap-6">
      <SK h={40} w={162} cls="rounded-full shrink-0" />
      <div className="flex-1 space-y-3">{[1,2,3,4,5].map(i=><SK key={i} h={10} />)}</div>
    </div>
  </div>
);

export const ImprovementSkeleton = () => (
  <div className="rounded-2xl border overflow-hidden fade-2" style={{ borderColor:'#1e1e35' }}>
    <div className="p-6" style={{ background:'#12121e' }}>
      <SK h={5} w={140} cls="mb-4" /><SK h={8} cls="mb-2" /><SK h={3} cls="mb-1" />
    </div>
    <div style={{ background:'#0f0f1a' }} className="divide-y divide-[#1e1e35]">
      {[1,2,3,4].map(i=><div key={i} className="px-6 py-4"><SK h={12} /></div>)}
    </div>
  </div>
);

export const SalarySkeleton = () => (
  <div className="rounded-2xl border p-6 fade-2" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
    <SK h={5} w={140} cls="mb-5" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1,2,3,4].map(i=><SK key={i} h={32} cls="rounded-xl" />)}
    </div>
  </div>
);

export const PersonalSalarySkeleton = () => (
  <div className="rounded-2xl border overflow-hidden fade-3" style={{ borderColor:'#1e1e35' }}>
    <SK h={12} cls="rounded-none" />
    <div className="p-6" style={{ background:'#12121e' }}>
      <div className="grid grid-cols-3 gap-3 mb-5">{[1,2,3].map(i=><SK key={i} h={24} cls="rounded-xl" />)}</div>
      <SK h={2} cls="rounded-full mb-5" />
      <SK h={16} cls="rounded-lg mb-5" />
      <div className="space-y-2">{[1,2].map(i=><SK key={i} h={12} cls="rounded-lg" />)}</div>
    </div>
  </div>
);

export const MarketFitSkeleton = () => (
  <div className="rounded-2xl border p-6 fade-3" style={{ background:'#12121e', borderColor:'#1e1e35' }}>
    <SK h={5} w={160} cls="mb-5" />
    <div className="flex gap-6 mb-6">
      <SK h={28} w={112} cls="rounded-xl shrink-0" />
      <div className="flex-1 space-y-3"><SK h={5} cls="rounded-full" /><SK h={14} cls="rounded-lg" /></div>
    </div>
    <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i=><SK key={i} h={32} cls="rounded-xl" />)}</div>
  </div>
);

export const CandidateVsMarketSkeleton = () => (
  <div className="rounded-2xl border overflow-hidden fade-4" style={{ borderColor:'#1e1e35' }}>
    <SK h={12} cls="rounded-none" />
    <div className="p-6" style={{ background:'#12121e' }}>
      <SK h={14} cls="rounded-lg mb-5" />
      <SK h={2} cls="rounded-full mb-6" />
      <div className="space-y-4 mb-6">{[1,2,3,4,5,6].map(i=><SK key={i} h={8} cls="rounded-lg" />)}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">{[1,2,3].map(i=><SK key={i} h={16} cls="rounded-xl" />)}</div>
        <div className="space-y-2">{[1,2,3].map(i=><SK key={i} h={16} cls="rounded-xl" />)}</div>
      </div>
    </div>
  </div>
);
