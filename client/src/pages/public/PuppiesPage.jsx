import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import api from '@/services/api';
import SectionHeading from '@/components/ui/SectionHeading';
import PuppyGrid from '@/components/puppies/PuppyGrid';
import PuppyCard from '@/components/puppies/PuppyCard';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { useSettings } from '@/context/SettingsContext';

export default function PuppiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useSettings();

  const [puppies, setPuppies] = useState([]);
  const [goneHomePuppies, setGoneHomePuppies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read filters directly from URL search params so back/forward navigation works seamlessly
  const currentBreed = searchParams.get('breed') || '';
  const currentOrigin = searchParams.get('origin') || '';

  const breedOptions = [
    { label: 'All breeds', value: '' },
    { label: 'Maltipoo', value: 'maltipoo' },
    { label: 'Pomeranian', value: 'pomeranian' },
    { label: 'Poodle', value: 'poodle' },
    { label: 'Cavapoo', value: 'cavapoo' },
    { label: 'Shih Tzu', value: 'shih-tzu' },
  ];

  const originOptions = [
    { label: 'All locations', value: '' },
    { label: 'In Dubai', value: 'dubai' },
    { label: 'Imported', value: 'imported' },
  ];

  const fetchPuppies = () => {
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (currentBreed) query.set('breed', currentBreed);
    if (currentOrigin) query.set('origin', currentOrigin);
    query.set('limit', '50');

    Promise.all([
      api.get(`/puppies?${query.toString()}`),
      api.get('/puppies/gone-home').catch(() => ({ data: { data: [] } })),
    ])
      .then(([pupsRes, goneRes]) => {
        if (pupsRes.data?.data) {
          setPuppies(pupsRes.data.data);
        }
        if (goneRes.data?.data) {
          setGoneHomePuppies(goneRes.data.data.slice(0, 5));
        }
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPuppies();
  }, [currentBreed, currentOrigin]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const waLink = buildWhatsAppLink(
    `Hi TeddyPups! I am looking for a ${currentBreed || 'teacup'} puppy. Do you have any upcoming litters?`,
    settings?.whatsappNumber
  );

  return (
    <>
      <Helmet>
        <title>Available Puppies — TeddyPups U.A.E.</title>
        <meta
          name="description"
          content="Meet our adorable teacup puppies available in Dubai or imported on request with complete health certification."
        />
      </Helmet>

      <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeading
          eyebrow="from Teddy's sketchbook"
          title="Available puppies"
          subtitle="Real puppies, real photos. Every baby is vet-checked, microchipped, vaccinated, and showered with care."
        />

        {/* Filter Bar */}
        <div className="mt-10 sm:mt-12 space-y-4 max-w-4xl mx-auto">
          {/* Breed Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:justify-center">
            <span className="text-xs uppercase font-bold text-cocoa/50 shrink-0 mr-1 hidden sm:inline">
              Breed:
            </span>
            {breedOptions.map((opt) => {
              const active = currentBreed.toLowerCase() === opt.value.toLowerCase();
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateFilter('breed', opt.value)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-soft cursor-pointer ${
                    active
                      ? 'bg-cocoa text-cream'
                      : 'bg-white hover:bg-honey/50 text-cocoa border border-cocoa/10'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Origin Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:justify-center">
            <span className="text-xs uppercase font-bold text-cocoa/50 shrink-0 mr-1 hidden sm:inline">
              Location:
            </span>
            {originOptions.map((opt) => {
              const active = currentOrigin.toLowerCase() === opt.value.toLowerCase();
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateFilter('origin', opt.value)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-soft cursor-pointer ${
                    active
                      ? 'bg-apricot-dark text-white'
                      : 'bg-sand/50 hover:bg-sand text-cocoa border border-cocoa/10'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Results count & Clear filters */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-cocoa/70 pt-2 px-2 border-t border-cocoa/5">
            <span>
              Showing <strong className="text-cocoa font-semibold">{puppies.length}</strong> {puppies.length === 1 ? 'puppy' : 'puppies'}
            </span>

            {(currentBreed || currentOrigin) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-apricot-dark hover:underline font-semibold cursor-pointer"
              >
                Clear all filters ✕
              </button>
            )}
          </div>
        </div>

        {/* Puppy Grid / Error / Empty State */}
        <div className="mt-10">
          {error ? (
            <ErrorState onRetry={fetchPuppies} />
          ) : puppies.length === 0 && !loading ? (
            <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
              <span className="text-5xl">🐾</span>
              <h3 className="font-display text-2xl text-cocoa font-medium">
                No puppies matching this filter
              </h3>
              <p className="text-cocoa/75 text-sm leading-relaxed">
                We might have newborn litters arriving soon from our Korea partners or upcoming showroom arrivals!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
                <Button href={waLink} variant="whatsapp" size="sm" target="_blank" rel="noopener noreferrer">
                  <span>💬</span> Enquire on WhatsApp
                </Button>
              </div>
            </div>
          ) : (
            <PuppyGrid
              puppies={puppies}
              loading={loading}
              skeletonCount={8}
            />
          )}
        </div>

        {/* Already Gone Home Section */}
        {goneHomePuppies.length > 0 && (
          <div className="mt-24 pt-16 border-t border-cocoa/10">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <p className="font-scrawl text-2xl text-apricot">forever loved</p>
              <h2 className="font-display text-3xl font-medium text-cocoa">
                Already gone home
              </h2>
              <p className="text-cocoa/75 text-sm sm:text-base">
                These puppies have found their families.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {goneHomePuppies.map((puppy) => (
                <PuppyCard key={puppy._id || puppy.slug} puppy={puppy} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/happy-families"
                className="font-display text-sm font-semibold text-cocoa hover:text-apricot transition-colors"
              >
                See photos of our happy families →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
