import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import Accordion from '../ui/Accordion';
import api from '../../api/axios';
import Skeleton from '../ui/Skeleton';

export default function FaqPreview() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get('/faqs?home=true')
      .then((res) => {
        if (isMounted && res.data?.data) {
          setFaqs(res.data.data.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-sand/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="common questions"
          title="Everything you need to know"
          subtitle="Clear answers about puppy health, showroom visits, and care."
        />

        <div className="mt-12">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="rect" className="w-full h-16 rounded-3xl" />
              ))}
            </div>
          ) : (
            <Accordion items={faqs} />
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 font-display text-base font-semibold text-cocoa hover:text-apricot transition-colors"
          >
            <span>Read all questions</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
