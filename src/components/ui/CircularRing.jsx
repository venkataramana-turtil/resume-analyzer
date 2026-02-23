import { useState, useEffect } from 'react'
import { atsColor } from '../../helpers.js'

export const CircularRing = ({ score }) => {
  const R = 70, SW = 11;
  const C = 2 * Math.PI * R;
  const [offset, setOffset] = useState(C);
  const color = atsColor(score);

  useEffect(() => {
    const t = setTimeout(() => setOffset(C - (score / 100) * C), 350);
    return () => clearTimeout(t);
  }, [score, C]);

  const cx = R + SW, cy = R + SW;
  const sz = (R + SW) * 2;

  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} className="pop">
      {/* Glow filter */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1e1e35" strokeWidth={SW} />
      {/* Progress arc */}
      <circle
        cx={cx} cy={cy} r={R}
        fill="none"
        stroke={color}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter="url(#glow)"
        className="ring-arc"
      />
      {/* Score text */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize="36"
        fontWeight="700" fontFamily="'Space Mono',monospace">{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#6b7280" fontSize="11"
        fontFamily="'DM Mono',monospace">ATS Score</text>
    </svg>
  );
};
