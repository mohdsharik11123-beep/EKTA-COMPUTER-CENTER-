import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Plus, Trash2, Shield, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, saveSettings, adminUser } = useApp();

  const [phone, setPhone] = useState(settings.phone || '');
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '');
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address || '');
  const [mapsUrl, setMapsUrl] = useState(settings.mapsUrl || '');
  const [openingHours, setOpeningHours] = useState(settings.openingHours || '');
  const [footerText, setFooterText] = useState(settings.footerText || '');

  // Social Links
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(settings.linkedinUrl || '');

  // Authorized Puter Users
  const [authorizedUsers, setAuthorizedUsers] = useState<string[]>(
    settings.authorizedPuterUsers || []
  );
  const [newUser, setNewUser] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const handleAddUser = () => {
    if (newUser.trim() && !authorizedUsers.includes(newUser.trim())) {
      setAuthorizedUsers([...authorizedUsers, newUser.trim()]);
      setNewUser('');
    }
  };

  const handleRemoveUser = (userToRemove: string) => {
    // Prevent removing own username if it's the current admin
    if (authorizedUsers.length === 1) {
      alert('You must have at least one authorized administrator.');
      return;
    }
    setAuthorizedUsers(authorizedUsers.filter((u) => u !== userToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSettings({
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        address: address.trim(),
        mapsUrl: mapsUrl.trim(),
        openingHours: openingHours.trim(),
        footerText: footerText.trim(),
        facebookUrl: facebookUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        authorizedPuterUsers: authorizedUsers
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="admin-settings-view" className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Center Contact & System Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure official center telephone numbers, WhatsApp support, location, and Puter account access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Official Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="st-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Center Phone Number
              </label>
              <input
                id="st-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-2xs text-slate-400 mt-1">Leave blank if pending official setup</p>
            </div>

            <div>
              <label htmlFor="st-whatsapp" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                WhatsApp Support Number
              </label>
              <input
                id="st-whatsapp"
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-2xs text-slate-400 mt-1">Used to generate genuine WhatsApp chat links</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="st-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <input
                id="st-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. info@ektacomputer.edu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="st-hours" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Operating / Lab Hours
              </label>
              <input
                id="st-hours"
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="e.g. Monday - Saturday: 8:00 AM – 8:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="st-address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Center Physical Address
            </label>
            <textarea
              id="st-address"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 2nd Floor, Main Market Road, Near Central Bus Stand..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
            ></textarea>
          </div>

          <div>
            <label htmlFor="st-maps" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Maps URL / Embed Link (Optional)
            </label>
            <input
              id="st-maps"
              type="url"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
            />
            <p className="text-2xs text-slate-400 mt-1">If blank, no fake or placeholder map is shown to users.</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Social Media Links (Optional)
          </h3>
          <p className="text-xs text-slate-500">
            Social links are ONLY displayed on the website when valid URLs are provided here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="st-facebook" className="block text-xs font-semibold text-slate-700 mb-1">
                Facebook Page URL
              </label>
              <input
                id="st-facebook"
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="st-instagram" className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram Profile URL
              </label>
              <input
                id="st-instagram"
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="st-youtube" className="block text-xs font-semibold text-slate-700 mb-1">
                YouTube Channel URL
              </label>
              <input
                id="st-youtube"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="st-linkedin" className="block text-xs font-semibold text-slate-700 mb-1">
                LinkedIn URL
              </label>
              <input
                id="st-linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Website Footer Statement
          </h3>
          <div>
            <label htmlFor="st-footer-text" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mission Statement & Brand Summary
            </label>
            <textarea
              id="st-footer-text"
              rows={2}
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="e.g. Empowering students and professionals through practical computer education and technical skills."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
            ></textarea>
          </div>
        </div>

        {/* Authorized Puter Users (Security & Multi-Admin Access) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Authorized Puter.js Administrator Accounts
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Only users whose Puter usernames are listed below can sign in to the Ekta Computer Center Admin Portal. You can authorize trusted colleagues by entering their Puter usernames.
          </p>

          <div className="space-y-2">
            {authorizedUsers.map((user) => (
              <div
                key={user}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">{user}</span>
                  {adminUser?.username === user && (
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      You
                    </span>
                  )}
                </div>
                {authorizedUsers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Revoke access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="Enter colleague's Puter username"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddUser}
              disabled={!newUser.trim()}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 disabled:opacity-50"
            >
              Authorize User
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
