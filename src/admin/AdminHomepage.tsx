import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminHomepage: React.FC = () => {
  const { settings, saveSettings } = useApp();

  const [heroHeading, setHeroHeading] = useState(settings.heroHeading || '');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || '');
  const [heroCtaPrimary, setHeroCtaPrimary] = useState(settings.heroCtaPrimary || '');
  const [heroCtaSecondary, setHeroCtaSecondary] = useState(settings.heroCtaSecondary || '');
  const [aboutPreview, setAboutPreview] = useState(settings.aboutPreview || '');
  const [whyChooseUs, setWhyChooseUs] = useState(settings.whyChooseUs || []);

  const [newWhyTitle, setNewWhyTitle] = useState('');
  const [newWhyDesc, setNewWhyDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddWhy = () => {
    if (newWhyTitle.trim() && newWhyDesc.trim()) {
      setWhyChooseUs([
        ...whyChooseUs,
        { title: newWhyTitle.trim(), description: newWhyDesc.trim() }
      ]);
      setNewWhyTitle('');
      setNewWhyDesc('');
    }
  };

  const handleRemoveWhy = (index: number) => {
    setWhyChooseUs(whyChooseUs.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSettings({
        heroHeading,
        heroSubtitle,
        heroCtaPrimary,
        heroCtaSecondary,
        aboutPreview,
        whyChooseUs
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="admin-homepage-view" className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Homepage Content Editor
        </h2>
        <p className="text-xs text-slate-500">
          Modify live text copy, banner headlines, and core educational pillars on the public homepage.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero Section Copy */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Hero Header & Call to Actions
          </h3>

          <div>
            <label htmlFor="hp-hero-heading" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Main Hero Heading
            </label>
            <input
              id="hp-hero-heading"
              type="text"
              required
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              placeholder="e.g. Practical Computer Education & Technical Skill Development"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="hp-hero-sub" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Subtitle Paragraph
            </label>
            <textarea
              id="hp-hero-sub"
              rows={3}
              required
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Descriptive overview of the center's mission..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hp-cta-primary" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Button Label
              </label>
              <input
                id="hp-cta-primary"
                type="text"
                value={heroCtaPrimary}
                onChange={(e) => setHeroCtaPrimary(e.target.value)}
                placeholder="e.g. Explore Courses"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="hp-cta-secondary" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Secondary Button Label
              </label>
              <input
                id="hp-cta-secondary"
                type="text"
                value={heroCtaSecondary}
                onChange={(e) => setHeroCtaSecondary(e.target.value)}
                placeholder="e.g. Contact & Enquiry"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* About Preview */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            About Section Preview Text
          </h3>
          <div>
            <label htmlFor="hp-about-preview" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Introduction to Ekta Computer Center
            </label>
            <textarea
              id="hp-about-preview"
              rows={4}
              value={aboutPreview}
              onChange={(e) => setAboutPreview(e.target.value)}
              placeholder="Summary of the center's background, equipment, and educational commitment..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
            ></textarea>
          </div>
        </div>

        {/* Why Choose Us Points */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            "Why Choose Us" Educational Pillars
          </h3>

          <div className="space-y-3">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveWhy(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Pillar */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
              Add New Educational Feature Point
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newWhyTitle}
                onChange={(e) => setNewWhyTitle(e.target.value)}
                placeholder="Pillar Title (e.g. Certified Instructors)"
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
              <input
                type="text"
                value={newWhyDesc}
                onChange={(e) => setNewWhyDesc(e.target.value)}
                placeholder="Explanation (e.g. Guidance by instructors with 5+ years field experience)"
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleAddWhy}
              disabled={!newWhyTitle.trim() || !newWhyDesc.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pillar</span>
            </button>
          </div>
        </div>

        {/* Submit bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating Homepage...' : 'Save Homepage Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
