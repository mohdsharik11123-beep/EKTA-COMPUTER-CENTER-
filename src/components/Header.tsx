import React, { useState } from 'react';
import { useApp, PublicPage } from '../context/AppContext';
import { Menu, X, Shield, PhoneCall, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { page, setPage, settings, isAuthenticated } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PublicPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'courses', label: 'Courses' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'notices', label: 'Notices' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (targetPage: PublicPage) => {
    setPage(targetPage);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top micro-bar for direct contact info if configured */}
      {(settings.phone || settings.email || settings.openingHours) && (
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3 text-blue-400" />
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors hidden sm:inline"
                >
                  {settings.email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              {settings.openingHours && (
                <span className="hidden md:inline text-slate-400">
                  {settings.openingHours}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors font-medium ml-2 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700"
              >
                <Shield className="w-3 h-3 text-blue-400" />
                <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand treatment */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer flex items-center gap-3.5 group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-lg tracking-wider shadow-sm group-hover:bg-blue-800 transition-colors">
              ECC
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                Ekta Computer Center
              </span>
              <span className="block text-xs font-medium text-slate-500 tracking-wide uppercase">
                Education & Skill Development
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = page === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:scale-95 shadow-xs transition-all"
            >
              <span>Admission Enquiry</span>
              <Sparkles className="w-4 h-4 text-blue-200" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded-lg"
            >
              Enquire
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = page === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Admin Portal</span>
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  {isAuthenticated ? 'Authenticated' : 'Sign In'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
