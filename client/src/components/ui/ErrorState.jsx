import React from 'react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load the data. Please check your connection and try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`text-center py-16 px-4 max-w-md mx-auto space-y-4 ${className}`}>
      <div className="text-4xl text-rose-500 font-bold select-none" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="font-display text-2xl text-cocoa font-medium">
        {title}
      </h3>
      <p className="text-cocoa/70 text-sm leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
