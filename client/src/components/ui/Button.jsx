import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'whatsapp' | 'outline' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  target,
  rel,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const sizeClasses = {
    sm: 'h-9 px-4 text-xs rounded-full gap-1.5',
    md: 'h-11 px-6 text-sm rounded-full gap-2',
    lg: 'h-13 px-8 text-base rounded-full gap-2.5',
  }[size] || 'h-11 px-6 text-sm rounded-full gap-2';

  const variantClasses = {
    primary:
      'bg-cocoa text-cream hover:bg-cocoa-light shadow-soft hover:shadow-card',
    secondary:
      'bg-honey text-cocoa hover:bg-honey/80 shadow-soft',
    whatsapp:
      'bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-soft hover:shadow-card',
    outline:
      'border-2 border-cocoa text-cocoa hover:bg-cocoa hover:text-cream',
    ghost:
      'text-cocoa hover:bg-honey/40',
  }[variant] || 'bg-cocoa text-cream';

  const classes = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
