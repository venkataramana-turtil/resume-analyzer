import { useState, useRef } from 'react'

export const RoleInput = ({ roles, setRoles }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const commit = () => {
    const val = input.trim().replace(/,+$/, '').trim();
    if (val && roles.length < 5 && !roles.includes(val)) {
      setRoles([...roles, val]);
    }
    setInput('');
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); }
    else if (e.key === 'Backspace' && !input && roles.length) {
      setRoles(roles.slice(0, -1));
    }
  };

  return (
    <div className="mb-5">
      <label className="block text-xs font-bold mb-1.5" style={{ color:'#6b7280' }}>
        TARGET ROLES{' '}
        <span style={{ color:'#4b5563', fontWeight:400 }}>(optional)</span>
      </label>

      {/* Tag input box */}
      <div
        className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border cursor-text min-h-[48px] transition-colors"
        style={{ background:'#12121e', borderColor: roles.length ? '#7c3aed' : '#1e1e35' }}
        onClick={() => inputRef.current?.focus()}
      >
        {roles.map((r, i) => (
          <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
            style={{ background:'rgba(124,58,237,.2)', color:'#a78bfa',
              border:'1px solid rgba(124,58,237,.4)' }}>
            {r}
            <button
              onClick={e => { e.stopPropagation(); setRoles(roles.filter((_,j)=>j!==i)); }}
              className="opacity-60 hover:opacity-100 transition-opacity leading-none ml-0.5"
              style={{ fontSize:'0.85rem' }}>×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          placeholder={roles.length ? '' : 'e.g. Staff Engineer, Product Manager…'}
          className="flex-1 min-w-[140px] bg-transparent outline-none text-xs"
          style={{ color:'#e2e2e2', fontFamily:"'DM Mono',monospace" }}
        />
      </div>
      <p className="text-xs mt-1" style={{ color:'#4b5563' }}>
        Press <kbd style={{ background:'#1e1e35', padding:'0 4px', borderRadius:3, color:'#6b7280' }}>Enter</kbd> or{' '}
        <kbd style={{ background:'#1e1e35', padding:'0 4px', borderRadius:3, color:'#6b7280' }}>,</kbd> to add · up to 5 roles
      </p>
    </div>
  );
};
