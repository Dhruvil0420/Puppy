import React from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — TeddyPups U.A.E.</title>
      </Helmet>

      <div className="min-h-[60vh] flex items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md space-y-5">
          <div className="text-6xl animate-float">🐾</div>
          <p className="font-scrawl text-2xl text-apricot">oops, lost your way?</p>
          <h1 className="font-display text-4xl sm:text-5xl font-medium text-cocoa">
            404 - Page Not Found
          </h1>
          <p className="text-cocoa/75 text-sm sm:text-base leading-relaxed">
            We couldn't find the page you were looking for. Let's head back to all the adorable puppies!
          </p>
          <div className="pt-2">
            <Button to="/" variant="primary" size="md">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
