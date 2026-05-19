import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-secondary text-light',
    accent: 'bg-accent text-primary',
    sage: 'bg-sage text-primary',
    blush: 'bg-blush text-primary',
    mint: 'bg-mint text-primary',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
