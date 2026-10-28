import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: 'bg-accent text-on-accent hover:brightness-110',
    secondary: 'bg-surface-raised text-text hover:bg-zinc-800',
    ghost: 'bg-transparent text-text hover:bg-white/5',
    danger: 'bg-danger text-white hover:brightness-110',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button className={`rounded-md font-semibold transition-all active:scale-95 ${variants[variant]} ${sizes[size]}`} {...props}>
      {children}
    </button>
  );
};

export const Badge = ({ score }) => {
  let color = 'bg-warning text-on-gold';
  let label = 'Fair';
  if (score >= 80) { color = 'bg-gold text-on-gold'; label = 'Excellent'; }
  else if (score >= 60) { color = 'bg-accent-secondary text-on-accent-secondary'; label = 'Good'; }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(0,0,0,0.5)] ${color}`}>
      {label} ({score})
    </span>
  );
};
