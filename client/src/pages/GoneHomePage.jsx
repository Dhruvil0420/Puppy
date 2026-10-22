import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SectionHeading from '../components/ui/SectionHeading';
import PuppyCard from '../components/puppies/PuppyCard';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

export default function GoneHomePage() {
  const [puppies, setPuppies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get('/puppies/gone-home')
      .then((res) => {
        if (isMounted && res.data?.data) {
          setPuppies(res.data.data);
        }
      })
      .catch((err) => {
        console.warn('Error loading gone home puppies:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <Helmet>
        <title>Already Gone Home — TeddyPups Dubai</title>
        <meta
          name="description"
          content="These beloved puppies have already joined their forever families in Dubai and across the U.A.E."
        />
      </Helmet>

      <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="cherished memories"
          title="Already gone home"
          subtitle="These puppies have found their forever families and are living their happiest lives."
        />

        {/* CTA to active puppies */}
        <div className="mt-8 text-center">
          <Button to="/puppies" variant="primary" size="md">
            View currently available puppies →
          </Button>
        </div>

        <div className="mt-14">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-white border border-cocoa/10 p-3.5 space-y-4 shadow-card">
                  <Skeleton variant="rect" className="aspect-square w-full rounded-2xl" />
                  <Skeleton variant="text" className="w-2/3 h-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {puppies.map((puppy) => (
                <PuppyCard key={puppy._id || puppy.slug} puppy={puppy} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA to Happy Families */}
        <div className="mt-20 pt-10 border-t border-cocoa/10 text-center space-y-3">
          <p className="font-scrawl text-2xl text-apricot">want to see more heartwarming moments?</p>
          <Link
            to="/happy-families"
            className="inline-flex items-center gap-2 font-display text-base font-semibold text-cocoa hover:text-apricot transition-colors"
          >
            Explore our Happy Families gallery (250+ photos) →
          </Link>
        </div>
      </div>
    </>
  );
}
