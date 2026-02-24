export const ErrorState = ({ message, onRetry, title = 'Something went wrong', icon = '⚠️' }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="text-center max-w-md fade">
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      <p className="text-sm mb-6 p-4 rounded-xl border leading-relaxed"
        style={{ color:'#fca5a5', background:'rgba(255,68,68,.07)', borderColor:'rgba(255,68,68,.3)' }}>
        {message}
      </p>
      <button onClick={onRetry}
        className="px-8 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
        style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff',
          fontFamily:"'Space Mono',monospace" }}>
        ↩ Try Again
      </button>
    </div>
  </div>
);
