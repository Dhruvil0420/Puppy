import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

export default function PuppyCard({ puppy, priority = false }) {
  if (!puppy) return null;

  const photo =
    puppy.primaryImage ||
    puppy.photos?.[0] ||
    (typeof puppy.images?.[0] === 'string' ? puppy.images[0] : puppy.images?.[0]?.url) ||
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80';
  const hasVideo = Boolean(puppy.videoUrl);
  const isGoneHome = puppy.status === 'gone-home';
  const isReserved = puppy.status === 'reserved';
  const isAvailable = puppy.status === 'available';

  const originLabel = puppy.origin === 'dubai' ? 'In Dubai showroom' : 'Imported';

  return (
    <article className="group relative rounded-3xl bg-white border border-cocoa/10 p-3 sm:p-3.5 shadow-card hover:shadow-float transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-honey/30">
        <img
          src={photo}
          alt={puppy.name}
          loading={priority ? 'eager' : 'lazy'}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          <div>
            {isAvailable && <Badge type="available">Available</Badge>}
            {isReserved && <Badge type="reserved">Reserved</Badge>}
            {isGoneHome && <Badge type="gone-home">gone home ♥</Badge>}
          </div>

          <div className="flex items-center gap-1">
            {hasVideo && <Badge type="video">video</Badge>}
          </div>
        </div>

        {/* Origin Pill (Bottom left of image) */}
        <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
          <Badge type="origin" className="text-[10px] sm:text-xs">
            {originLabel}
          </Badge>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-3.5 pb-1 px-1 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-xl sm:text-2xl text-cocoa font-medium group-hover:text-apricot transition-colors truncate">
              {puppy.name}
            </h3>
            <span className="text-xs uppercase tracking-wider text-cocoa/60 font-semibold shrink-0">
              {puppy.gender}
            </span>
          </div>

          <p className="text-sm text-cocoa/70 line-clamp-1 mt-0.5">
            {puppy.breed}
          </p>
        </div>

        {/* Footer info & link */}
        <div className="mt-4 pt-3 border-t border-cocoa/5 flex items-center justify-between">
          <span className="text-xs font-medium text-cocoa/60">
            {puppy.estimatedAdultWeight || 'Teacup size'}
          </span>
          <span className="font-display text-sm font-semibold text-apricot flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Meet {puppy.name} →
          </span>
        </div>
      </div>

      {/* Full card clickable link */}
      <Link
        to={`/puppies/${puppy.slug}`}
        className="absolute inset-0 z-10 rounded-3xl"
        aria-label={`View details for ${puppy.name}`}
      >
        <span className="sr-only">View details for {puppy.name}</span>
      </Link>
    </article>
  );
}
