import { useState, useRef, useCallback } from 'react'
import { MarketPicker } from './MarketPicker.jsx'
import { RoleInput } from './RoleInput.jsx'

export const UploadZone = ({ onFile, market, setMarket }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile]         = useState(null);
  const [roles, setRoles]       = useState([]);
  const inputRef = useRef(null);

  const pick = f => { if (f && f.type === 'application/pdf') setFile(f); };

  const onDrop      = useCallback(e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files[0]); }, []);
  const onDragOver  = e => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onChange    = e => pick(e.target.files[0]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md fade">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">📄</div>
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analyzer</h1>
          <p className="text-sm" style={{ color:'#6b7280' }}>
            ATS scoring · salary benchmarking · market fit
          </p>
          <p className="text-xs mt-1" style={{ color:'#4b5563' }}>
            Powered by GLM-4.7 · your resume never leaves your browser
          </p>
        </div>

        {/* Market Picker */}
        <MarketPicker market={market} setMarket={setMarket} />

        {/* Drop Zone */}
        <div
          className={`dz rounded-2xl p-12 text-center cursor-pointer ${dragging ? 'dz-active' : ''} ${file ? 'dz-filled' : ''}`}
          onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={onChange} />
          {file ? (
            <div>
              <div className="text-4xl mb-3">📎</div>
              <p className="font-bold text-white truncate">{file.name}</p>
              <p className="text-xs mt-2" style={{ color:'#6b7280' }}>
                {(file.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-3">{dragging ? '🎯' : '☁️'}</div>
              <p className="font-bold text-white mb-1">
                {dragging ? 'Drop it!' : 'Drop your resume here'}
              </p>
              <p className="text-sm" style={{ color:'#6b7280' }}>or click to browse · PDF files only</p>
            </div>
          )}
        </div>

        {/* Target Roles */}
        <div className="mt-5">
          <RoleInput roles={roles} setRoles={setRoles} />
        </div>

        {/* Analyze button */}
        <button
          onClick={() => file && onFile(file, roles)}
          className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
          style={{
            background: file ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#1e1e35',
            color: file ? '#fff' : '#4b5563',
            cursor: file ? 'pointer' : 'not-allowed',
            fontFamily: "'Space Mono',monospace",
            boxShadow: file ? '0 0 24px rgba(124,58,237,.4)' : 'none',
          }}
        >
          {file ? '→  Analyze Resume' : 'Select a PDF to get started'}
        </button>
      </div>
    </div>
  );
};
