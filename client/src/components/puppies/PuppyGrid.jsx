import React from 'react';
import PuppyCard from './PuppyCard';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

export default function PuppyGrid({
  puppies = [],
  loading = false,
  skeletonCount = 6,
  emptyMessage,
  onResetFilters,
  className = '',
}) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white border border-cocoa/10 p-3 sm:p-3.5 space-y-4 shadow-card"
          >
            <Skeleton variant="rect" className="aspect-square w-full rounded-2xl" />
            <div className="space-y-2 px-1">
              <Skeleton variant="text" className="w-2/3 h-6" />
              <Skeleton variant="text" className="w-1/2 h-4" />
            </div>
            <div className="pt-3 border-t border-cocoa/5 flex justify-between px-1">
              <Skeleton variant="text" className="w-1/3 h-4" />
              <Skeleton variant="text" className="w-1/4 h-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!puppies || puppies.length === 0) {
    return (
      <EmptyState
        title="No puppies found"
        description={emptyMessage || "We couldn't find any puppies matching this criteria."}
        actionLabel={onResetFilters ? "Reset all filters" : null}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 ${className}`}>
      {puppies.map((puppy, idx) => (
        <PuppyCard key={puppy._id || puppy.slug || idx} puppy={puppy} priority={idx < 4} />
      ))}
    </div>
  );
}
