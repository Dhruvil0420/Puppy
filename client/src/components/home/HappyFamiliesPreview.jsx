import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import api from '../../api/axios';
import Skeleton from '../ui/Skeleton';

export default function HappyFamiliesPreview() {
  const [families, setFamilies] = useState([]);
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get('/happy-families?limit=8').catch(() => ({ data: { data: [] } })),
      api.get('/testimonials?featured=true').catch(() => ({ data: { data: [] } })),
    ]).then(([famRes, testRes]) => {
      if (isMounted) {
        if (famRes.data?.data) setFamilies(famRes.data.data.slice(0, 8));
        if (testRes.data?.data?.length > 0) {
          setTestimonial(testRes.data.data[0]);
        }
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="pure happiness"
          title="Happy families & heartfelt reviews"
          subtitle="Real moments of love from families who welcomed their little ones into their homes."
        />

        {/* Featured Testimonial Quote */}
        {testimonial && (
          <div className="mt-12 max-w-3xl mx-auto rounded-3xl bg-honey/40 border border-cocoa/10 p-8 sm:p-10 text-center shadow-card relative">
            <span className="text-4xl text-apricot select-none">“</span>
            <p className="font-display text-lg sm:text-2xl text-cocoa font-medium leading-relaxed italic -mt-2">
              {testimonial.quote || testimonial.content}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="font-semibold text-sm text-cocoa">
                {testimonial.authorName}
              </span>
              {testimonial.location && (
                <>
                  <span className="text-cocoa/40">•</span>
                  <span className="text-xs text-cocoa/70">{testimonial.location}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Photo Strip / Carousel */}
        <div className="mt-12">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rect" className="aspect-square w-full rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {families.slice(0, 4).map((f, i) => (
                <div
                  key={f._id || i}
                  className="group relative aspect-square rounded-3xl overflow-hidden shadow-card border border-cocoa/10 bg-honey/30 hover:-translate-y-1 transition-all"
                >
                  <img
                    src={f.imageUrl}
                    alt={f.caption || 'Happy family'}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {f.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-cocoa/80 to-transparent text-cream opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                      {f.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link to see all */}
        <div className="mt-10 text-center">
          <Link
            to="/happy-families"
            className="inline-flex items-center gap-2 font-display text-base font-semibold text-cocoa hover:text-apricot transition-colors"
          >
            <span>See more happy moments (250+ families)</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
