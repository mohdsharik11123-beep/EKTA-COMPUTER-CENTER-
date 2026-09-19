import React from 'react';
import { useApp, PublicPage } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck, MessageCircle, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setPage } = useApp();

  const handleNav = (target: PublicPage) => {
    setPage(target);
  };

  const hasContactInfo = Boolean(
    settings.phone || settings.email || settings.address || settings.openingHours || settings.whatsapp
  );

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                ECC
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Ekta Computer Center
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.footerText ||
                'Empowering students and professionals through practical computer education and technical skills.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Puter.js Serverless Cloud Storage</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About the Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('courses')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Courses & Curriculum
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('services')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('gallery')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('notices')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Latest Notices & Circulars
                </button>
              </li>
            </ul>
          </div>

          {/* Center Contact Information (Only factual fields configured by admin) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Center Information
            </h3>
            {hasContactInfo ? (
              <ul className="space-y-3 text-sm text-slate-300">
                {settings.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                    <span>{settings.address}</span>
                  </li>
                )}
                {settings.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                    <a
                      href={`tel:${settings.phone}`}
                      className="hover:text-white transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings.whatsapp && (
                  <li className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors inline-flex items-center gap-1 text-emerald-300 hover:underline"
                    >
                      <span>WhatsApp Support ({settings.whatsapp})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <a
                      href={`mailto:${settings.email}`}
                      className="hover:text-white transition-colors"
                    >
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.openingHours && (
                  <li className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{settings.openingHours}</span>
                  </li>
                )}
              </ul>
            ) : (
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
                <p>Official contact details can be configured by center staff in the Admin Portal.</p>
                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  className="mt-2 text-blue-400 hover:underline inline-block font-semibold"
                >
                  Submit an online admission enquiry &rarr;
                </button>
              </div>
            )}

            {/* Social links if configured */}
            {(settings.facebookUrl || settings.instagramUrl || settings.youtubeUrl || settings.linkedinUrl) && (
              <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-400">Official Profiles:</span>
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Facebook
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">
                    Instagram
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:underline">
                    YouTube
                  </a>
                )}
                {settings.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Ekta Computer Center. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Management</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
