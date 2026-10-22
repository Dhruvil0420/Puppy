import React, { useEffect, useCallback } from 'react';

export default function Lightbox({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onPrev,
  onNext,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex];
  const src = typeof currentImg === 'string' ? currentImg : currentImg?.url;
  const caption = typeof currentImg === 'object' ? currentImg?.caption : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] bg-cocoa/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-10 size-11 rounded-full bg-cream/20 text-cream hover:bg-cream/40 flex items-center justify-center text-xl cursor-pointer transition-colors"
        aria-label="Close modal"
      >
        ✕
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-cream/20 text-cream hover:bg-cream/40 flex items-center justify-center text-2xl cursor-pointer transition-colors"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-cream/20 text-cream hover:bg-cream/40 flex items-center justify-center text-2xl cursor-pointer transition-colors"
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* Content */}
      <div
        className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={caption || 'Preview'}
          className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl select-none"
        />
        {caption && (
          <p className="mt-4 text-center text-cream/90 text-sm font-medium">
            {caption}
          </p>
        )}
        {images.length > 1 && (
          <p className="mt-2 text-center text-cream/60 text-xs">
            {currentIndex + 1} of {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
