import React from 'react';

export const LemanaHouseBadge: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
    <path
      d="M22 3L4 17.5V40H40V17.5L22 3Z"
      fill="#FFCC00"
      stroke="#141414"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 40V25.5H28.5V40"
      fill="#FFFFFF"
      stroke="#141414"
      strokeWidth="2.3"
      strokeLinejoin="round"
    />
  </svg>
);
