import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/admin', end: true, icon: '📊' },
    { label: 'Puppies', path: '/admin/puppies', icon: '🐾' },
    { label: 'Enquiries', path: '/admin/enquiries', icon: '💌' },
    { label: 'Happy Families', path: '/admin/happy-families', icon: '📸' },
    { label: 'FAQs', path: '/admin/faqs', icon: '❓' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-sand/30 flex flex-col md:flex-row text-cocoa">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-cocoa/10 flex flex-col justify-between p-6 shrink-0 shadow-soft">
        <div className="space-y-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-3xl">🐶</span>
            <div>
              <span className="font-display text-xl font-medium tracking-tight text-cocoa block">
                TeddyPups
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-apricot block">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cocoa text-cream shadow-soft'
                      : 'text-cocoa/75 hover:bg-honey/40 hover:text-cocoa'
                  }`
                }
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User bar & Logout */}
        <div className="pt-6 border-t border-cocoa/10 space-y-3">
          <div className="text-xs">
            <span className="block text-cocoa/50 font-bold uppercase tracking-wider">Logged in as</span>
            <span className="font-medium text-cocoa truncate block">{admin?.name || admin?.email || 'Administrator'}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-10 rounded-2xl border border-cocoa/20 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
