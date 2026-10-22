import React from 'react';

export default function Badge({
  type, // 'available' | 'reserved' | 'gone-home' | 'video' | 'origin' | 'custom'
  children,
  className = '',
}) {
  const baseClasses =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm transition-transform';

  switch (type) {
    case 'available':
      return (
        <span className={`${baseClasses} bg-emerald-500/90 text-white ${className}`}>
          <span className="size-1.5 rounded-full bg-white animate-pulse" />
          {children || 'Available'}
        </span>
      );

    case 'reserved':
      return (
        <span className={`${baseClasses} bg-amber-500/90 text-white ${className}`}>
          <span className="size-1.5 rounded-full bg-white" />
          {children || 'Reserved'}
        </span>
      );

    case 'gone-home':
      return (
        <span className={`${baseClasses} bg-rose-500/90 text-white ${className}`}>
          {children || 'gone home ♥'}
        </span>
      );

    case 'video':
      return (
        <span className={`${baseClasses} bg-cocoa/85 text-cream border border-cream/20 ${className}`}>
          <span>▶</span>
          {children || 'video'}
        </span>
      );

    case 'origin':
      return (
        <span className={`${baseClasses} bg-honey text-cocoa font-medium ${className}`}>
          {children}
        </span>
      );

    default:
      return (
        <span className={`${baseClasses} bg-sand/90 text-cocoa ${className}`}>
          {children}
        </span>
      );
  }
}
