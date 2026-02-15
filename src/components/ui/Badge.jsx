import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-stone-100 text-stone-900',
    confirmed: 'bg-green-100 text-green-800 border border-green-200',
    processing: 'bg-blue-100 text-blue-800 border border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border border-purple-200',
    delivered: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;