import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Skeleton from '../components/ui/Skeleton';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
const HomePage = lazy(() => import('../pages/public/HomePage'));
const PuppiesPage = lazy(() => import('../pages/public/PuppiesPage'));
const PuppyDetailPage = lazy(() => import('../pages/public/PuppyDetailPage'));
const GoneHomePage = lazy(() => import('../pages/public/GoneHomePage'));
const HappyFamiliesPage = lazy(() => import('../pages/public/HappyFamiliesPage'));
const HowItWorksPage = lazy(() => import('../pages/public/HowItWorksPage'));
const FaqPage = lazy(() => import('../pages/public/FaqPage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage'));

// Admin Pages
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminPuppiesPage = lazy(() => import('../pages/admin/AdminPuppiesPage'));
const AdminEnquiriesPage = lazy(() => import('../pages/admin/AdminEnquiriesPage'));
const AdminHappyFamiliesPage = lazy(() => import('../pages/admin/AdminHappyFamiliesPage'));
const AdminFaqsPage = lazy(() => import('../pages/admin/AdminFaqsPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));

function PageFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-8">
      <Skeleton variant="rect" className="w-1/2 h-10 rounded-2xl mx-auto" />
      <Skeleton variant="rect" className="w-full h-80 rounded-3xl" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages wrapped with Public Layout */}
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="puppies"
          element={
            <Suspense fallback={<PageFallback />}>
              <PuppiesPage />
            </Suspense>
          }
        />
        <Route
          path="puppies/:slug"
          element={
            <Suspense fallback={<PageFallback />}>
              <PuppyDetailPage />
            </Suspense>
          }
        />
        <Route
          path="gone-home"
          element={
            <Suspense fallback={<PageFallback />}>
              <GoneHomePage />
            </Suspense>
          }
        />
        <Route
          path="happy-families"
          element={
            <Suspense fallback={<PageFallback />}>
              <HappyFamiliesPage />
            </Suspense>
          }
        />
        <Route
          path="how-it-works"
          element={
            <Suspense fallback={<PageFallback />}>
              <HowItWorksPage />
            </Suspense>
          }
        />
        <Route
          path="faq"
          element={
            <Suspense fallback={<PageFallback />}>
              <FaqPage />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={<PageFallback />}>
              <ContactPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>

      {/* Admin Login Route (no index, outside public layout) */}
      <Route
        path="admin/login"
        element={
          <Suspense fallback={<PageFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="admin"
          element={
            <Suspense fallback={<PageFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminDashboardPage />
              </Suspense>
            }
          />
          <Route
            path="puppies"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminPuppiesPage />
              </Suspense>
            }
          />
          <Route
            path="enquiries"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminEnquiriesPage />
              </Suspense>
            }
          />
          <Route
            path="happy-families"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminHappyFamiliesPage />
              </Suspense>
            }
          />
          <Route
            path="faqs"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminFaqsPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminSettingsPage />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
