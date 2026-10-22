import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingBottomBar from './FloatingBottomBar';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-cocoa selection:bg-apricot/20 selection:text-cocoa">
      <ScrollToTop />

      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only-focusable fixed left-4 top-4 z-[110] rounded-full bg-cocoa px-5 py-3 font-semibold text-cream shadow-float transition-transform"
      >
        Skip to content
      </a>

      {/* Header with announcement & sticky nav */}
      <Header />

      {/* Main Page Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Bottom Bar on Mobile */}
      <FloatingBottomBar />
    </div>
  );
}
