import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, Compass, Monitor, BookOpenCheck, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { settings, setPage } = useApp();

  return (
    <div id="about-view" className="py-10 lg:py-16 space-y-16">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            About The Center
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Ekta Computer Center
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {settings.aboutPreview ||
              'Ekta Computer Center provides comprehensive hands-on training in computer fundamentals, office software, financial accounting, coding, and digital design. Our goal is to equip learners with verifiable skills for academic and workplace success.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Target className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Core Mission</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              To deliver accessible, practical, and systematic computer education that empowers individuals with the technical skills, digital confidence, and operational capabilities needed in today's workforce.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Educational Vision</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              To be a trusted neighborhood center for computer literacy and professional software training, recognized for patient instruction, rigorous practical exercises, and disciplined student support.
            </p>
          </div>
        </div>
      </section>

      {/* Training Methodology */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
              Teaching Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Training Approach
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We emphasize structured curriculum delivery and sustained practice over passive lecturing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-blue-700 flex items-center justify-center font-bold">
                <BookOpenCheck className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Concept Explanation First</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every topic begins with lucid, jargon-free explanations of core principles, followed by instructor demonstrations on live systems.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-blue-700 flex items-center justify-center font-bold">
                <Monitor className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Immediate Hands-on Lab Time</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students immediately reproduce workflows on individual computers to build procedural memory, test edge cases, and ask questions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-blue-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Continuous Assessment & Review</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Periodic practical assessments, typing speed drills, and module assignments ensure that students master each unit before progressing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
            Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learning Environment & Facilities
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A quiet, organized study setting designed for focused computer practice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2">1:1 Workstation Allocation</h4>
            <p className="text-sm text-slate-600">
              Each registered learner is assigned a dedicated system during lab time to guarantee undivided practice.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2">Current Software Installations</h4>
            <p className="text-sm text-slate-600">
              Systems are configured with updated operating systems, productivity suites, accounting software, and code editors.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2">Reliable Power Backup</h4>
            <p className="text-sm text-slate-600">
              UPS power backup systems to ensure uninterrupted practice and prevent loss of student project work.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2">Comfortable Study Space</h4>
            <p className="text-sm text-slate-600">
              Air-ventilated, well-lit classrooms equipped with ergonomic seating and instructional projection screens.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 p-8 bg-blue-50 border border-blue-100 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-blue-950">Visit the Center or Discuss Courses</h3>
            <p className="text-sm text-blue-800 mt-1">
              Have questions about batch schedules or syllabus details? Contact our team.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPage('contact')}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm"
          >
            <span>Submit Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
