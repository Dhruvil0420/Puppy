import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — TeddyPups U.A.E.</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-16">
        <div className="max-w-md w-full rounded-4xl bg-white border border-cocoa/15 p-8 sm:p-10 shadow-float space-y-6">
          <div className="text-center space-y-2">
            <div className="size-14 mx-auto rounded-2xl bg-honey/60 flex items-center justify-center text-3xl shadow-soft">
              🐶
            </div>
            <h1 className="font-display text-3xl font-medium text-cocoa">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-cocoa/70">
              Sign in to manage puppies, enquiries, happy families & settings
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cocoa/70 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@teddypups.ae"
                className="w-full px-4 py-3 rounded-2xl border border-cocoa/15 bg-cream/50 focus:bg-white focus:border-cocoa outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cocoa/70 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-cocoa/15 bg-cream/50 focus:bg-white focus:border-cocoa outline-none text-sm"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-xs text-cocoa/50">
            TeddyPups U.A.E. • Authorized personnel only
          </p>
        </div>
      </div>
    </>
  );
}
