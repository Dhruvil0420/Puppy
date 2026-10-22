import React from 'react';
import Button from './Button';

export default function EmptyState({
  title = 'No puppies found',
  description = 'Try adjusting your filters or search criteria.',
  actionLabel,
  onAction,
  icon = '🐾',
  className = '',
}) {
  return (
    <div className={`text-center py-16 px-4 max-w-md mx-auto space-y-4 ${className}`}>
      <div className="text-5xl select-none" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-cocoa font-medium">
        {title}
      </h3>
      <p className="text-cocoa/70 text-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
