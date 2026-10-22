import React from 'react';

export default function Skeleton({
  variant = 'rect', // 'rect' | 'circle' | 'text'
  className = '',
  width,
  height,
}) {
  const baseClasses = 'animate-pulse bg-cocoa/10';

  const variantClasses = {
    rect: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'h-4 rounded-md',
  }[variant] || 'rounded-2xl';

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
