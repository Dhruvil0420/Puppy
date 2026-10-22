import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import SectionHeading from '../components/ui/SectionHeading';
import Skeleton from '../components/ui/Skeleton';
import Lightbox from '../components/ui/Lightbox';
import Button from '../components/ui/Button';

export default function HappyFamiliesPage() {
  const [families, setFamilies] = useState([]);
  const [totalCount, setTotalCount] = useState(250);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const fetchFamilies = (pageNum, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    api.get(`/happy-families?page=${pageNum}&limit=12`)
      .then((res) => {
        if (res.data?.data) {
          if (append) {
            setFamilies((prev) => [...prev, ...res.data.data]);
          } else {
            setFamilies(res.data.data);
          }
          if (res.data?.meta?.total) {
            setTotalCount(res.data.meta.total);
            setHasMore(families.length + res.data.data.length < res.data.meta.total);
          }
        }
      })
      .catch((err) => {
        console.warn('Error loading happy families:', err.message);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    fetchFamilies(1, false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFamilies(nextPage, true);
  };

  const images = families.map((f) => ({
    url: f.imageUrl,
    caption: f.caption || 'Happy puppy family in Dubai',
  }));

  return (
    <>
      <Helmet>
        <title>Happy Families — Our Wall of Happy Endings | TeddyPups Dubai</title>
        <meta
          name="description"
          content="Over 250+ happy families welcomed their dream teacup puppy into their homes in Dubai and across the U.A.E."
        />
      </Helmet>

      <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="our wall of happy endings"
          title="Happy families"
          subtitle="Real moments of love from families who welcomed their little ones into their homes."
        />

        {/* Dynamic counter */}
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-honey/60 text-cocoa text-sm font-semibold shadow-soft">
            <span>✨</span>
            <span>{totalCount} moments and counting</span>
          </span>
        </div>

        {/* Featured Testimonial */}
        <div className="mt-12 max-w-3xl mx-auto rounded-3xl bg-honey/30 border border-cocoa/10 p-8 sm:p-10 text-center shadow-card relative">
          <span className="text-4xl text-apricot select-none">“</span>
          <p className="font-display text-lg sm:text-2xl text-cocoa font-medium leading-relaxed italic -mt-2">
            "Adopting our little Maltipoo from TeddyPups was the best decision our family made. The team in Dubai guided us through every single step with such care, and our baby is thriving and full of joy."
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-cocoa">
            <strong className="font-semibold">Sarah M.</strong>
            <span className="text-cocoa/40">•</span>
            <span className="text-xs text-cocoa/70">Downtown Dubai, UAE</span>
          </div>
        </div>

        {/* Masonry / Responsive Photo Grid */}
        <div className="mt-16">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} variant="rect" className="aspect-square w-full rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {families.map((item, idx) => (
                <div
                  key={item._id || idx}
                  onClick={() => {
                    setLightboxIdx(idx);
                    setLightboxOpen(true);
                  }}
                  className="group relative aspect-square rounded-3xl overflow-hidden bg-honey/20 border border-cocoa/10 shadow-card hover:shadow-float transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.caption || 'Happy family with puppy'}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-cocoa/85 via-cocoa/40 to-transparent text-cream opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-medium line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="mt-12 text-center">
              <Button
                variant="secondary"
                size="md"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading more photos...' : 'Load more happy moments'}
              </Button>
            </div>
          )}

          {/* Footer Line */}
          <div className="mt-20 pt-8 border-t border-cocoa/10 text-center">
            <p className="font-scrawl text-2xl text-apricot">
              every one of them was a Teddy Pup once
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox with keyboard navigation */}
      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        currentIndex={lightboxIdx}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIdx((p) => (p === 0 ? images.length - 1 : p - 1))}
        onNext={() => setLightboxIdx((p) => (p + 1) % images.length)}
      />
    </>
  );
}
