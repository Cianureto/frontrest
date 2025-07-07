import React from 'react';

const HamburgerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="15" width="20" height="4" rx="2" />
    <rect x="2" y="5" width="20" height="4" rx="2" />
    <ellipse cx="12" cy="12" rx="10" ry="2" />
  </svg>
);

export default HamburgerIcon; 