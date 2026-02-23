import { Skeleton } from './skeletons.jsx'

export const LoadingState = ({ step, tagline }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4">
    <div className="text-center mb-12" style={{ maxWidth: 480 }}>
      {/* Spinner */}
      <div className="relative w-14 h-14 mx-auto mb-6">
        <div className="w-14 h-14 rounded-full border-4 border-violet-500 border-t-transparent spin-anim" />
        <div className="absolute inset-0 rounded-full border-4 border-violet-900/40" />
      </div>

      <h2 className="text-xl font-bold text-white mb-3">Analyzing your resume...</h2>

      {/* Creative one-liner tagline */}
      {tagline && (
        <p className="text-sm italic mb-4 px-4 py-2.5 rounded-xl"
          style={{
            color: '#a78bfa',
            background: 'rgba(124,58,237,.08)',
            border: '1px solid rgba(124,58,237,.2)',
            fontStyle: 'italic',
          }}>
          ✦ {tagline}
        </p>
      )}

      {/* Step indicator */}
      <p className="text-xs" style={{ color:'#4b5563' }}>{step}</p>
    </div>
    <div className="w-full max-w-4xl">
      <Skeleton />
    </div>
  </div>
);
