import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import PuppyCard from '../puppies/PuppyCard';
import Skeleton from '../ui/Skeleton';

export default function MeetThePupsSection({ puppies = [], loading = false }) {
  // Take up to 15 puppies for the grid
  const displayPuppies = puppies.slice(0, 15);

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="available now"
          title="Meet the pups"
          subtitle="Real puppies, real photos, looking for their families right now."
        />

        <div className="mt-12 sm:mt-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-white border border-cocoa/10 p-3.5 space-y-4 shadow-card">
                  <Skeleton variant="rect" className="aspect-square w-full rounded-2xl" />
                  <div className="space-y-2 px-1">
                    <Skeleton variant="text" className="w-2/3 h-6" />
                    <Skeleton variant="text" className="w-1/2 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {displayPuppies.map((puppy, idx) => (
                <div key={puppy._id || puppy.slug || idx} className="relative">
                  {/* Numbered pill indicator */}
                  <div className="absolute -top-2 -left-2 z-20 size-7 rounded-full bg-honey text-cocoa font-display font-semibold text-xs flex items-center justify-center shadow-soft border border-cocoa/10">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <PuppyCard puppy={puppy} />
                </div>
              ))}

              {/* Last Tile: "Meet them all" */}
              <Link
                to="/puppies"
                className="group relative rounded-3xl bg-honey/40 hover:bg-honey/70 border-2 border-dashed border-cocoa/20 p-6 shadow-card hover:shadow-float transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[320px] hover:-translate-y-1"
              >
                <div className="size-16 rounded-full bg-cream flex items-center justify-center text-3xl shadow-soft group-hover:scale-110 group-hover:rotate-12 transition-transform">
                  🐾
                </div>
                <h3 className="font-display text-2xl font-medium text-cocoa mt-4">
                  Meet them all
                </h3>
                <p className="text-cocoa/75 text-sm mt-1 max-w-[200px]">
                  Explore all available & reserved puppies looking for loving homes
                </p>
                <span className="mt-5 px-5 py-2.5 rounded-full bg-cocoa text-cream text-xs font-semibold group-hover:bg-cocoa-light transition-colors shadow-soft">
                  Browse all puppies →
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
