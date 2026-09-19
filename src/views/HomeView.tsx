import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Clock,
  GraduationCap,
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { settings, courses, notices, services, gallery, setPage, setSelectedCourse, setEnquiryPreselectedCourse } = useApp();

  const activeCourses = courses.filter((c) => c.status === 'active');
  const featuredCourses = activeCourses.filter((c) => c.featured);
  const displayCourses = featuredCourses.length > 0 ? featuredCourses.slice(0, 4) : activeCourses.slice(0, 4);

  const publishedNotices = notices.filter((n) => n.status === 'published');
  const latestNotice = publishedNotices.length > 0 ? publishedNotices[0] : null;

  const activeServices = services.filter((s) => s.status === 'active').slice(0, 4);
  const previewGallery = gallery.filter((g) => g.status === 'published').slice(0, 3);

  const handleCourseClick = (course: (typeof courses)[0]) => {
    setSelectedCourse(course);
  };

  const handleEnquireCourse = (e: React.MouseEvent, course: (typeof courses)[0]) => {
    e.stopPropagation();
    setEnquiryPreselectedCourse(course.title);
    setPage('contact');
  };

  return (
    <div id="home-view" className="space-y-16 lg:space-y-24 pb-16">
      {/* Notice Ticker / Banner if published notices exist */}
      {latestNotice && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-amber-900 truncate">
              <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded text-xs shrink-0">
                <Bell className="w-3 h-3 text-amber-700" />
                <span>Notice</span>
              </span>
              <strong className="truncate font-semibold">{latestNotice.title}</strong>
              <span className="hidden md:inline text-amber-700 truncate">— {latestNotice.content}</span>
            </div>
            <button
              type="button"
              onClick={() => setPage('notices')}
              className="text-amber-900 font-bold hover:underline shrink-0 flex items-center gap-1 text-xs"
            >
              <span>View all notices</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Computer Training & Practical Skills Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {settings.heroHeading || 'Practical Computer Education & Technical Skill Development'}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {settings.heroSubtitle ||
                'Build real-world digital proficiency through structured, hands-on computer courses designed for students, job seekers, and working professionals.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setPage('courses')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-700 hover:bg-blue-800 active:scale-95 shadow-md shadow-blue-700/20 transition-all"
              >
                <span>{settings.heroCtaPrimary || 'Explore Courses'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all"
              >
                <span>{settings.heroCtaSecondary || 'Contact & Enquiry'}</span>
              </button>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-left">
              <div>
                <span className="block text-2xl font-extrabold text-slate-900">
                  {activeCourses.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">Active Courses</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-slate-900">100%</span>
                <span className="text-xs text-slate-500 font-medium">Hands-on Labs</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-slate-900">Flexible</span>
                <span className="text-xs text-slate-500 font-medium">Batch Schedules</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 bg-linear-to-br from-slate-900 to-blue-950 text-white shadow-2xl border border-slate-800">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-sm tracking-wide">Course Highlights</span>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                    Admissions Open
                  </span>
                </div>

                <div className="space-y-3">
                  {activeCourses.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleCourseClick(c)}
                      className="cursor-pointer p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {c.title}
                        </h4>
                        <span className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                          <span>{c.duration}</span>
                          <span>•</span>
                          <span>{c.level}</span>
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setPage('courses')}
                    className="w-full py-2.5 px-4 text-xs font-bold text-center text-blue-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    View Complete Course Catalog &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
              About The Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dedicated to Practical Computer Education
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              {settings.aboutPreview ||
                'Ekta Computer Center provides comprehensive hands-on training in computer fundamentals, office software, financial accounting, coding, and digital design. Our goal is to equip learners with verifiable skills for academic and workplace success.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setPage('about')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline"
              >
                <span>Read more about our teaching approach & facilities</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
              Programs & Training
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Computer Courses
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Only active courses managed directly by Ekta Computer Center administration.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPage('courses')}
            className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className="cursor-pointer bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {course.category}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {course.shortDescription}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Duration: {course.duration}</span>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 group-hover:underline">
                  View Syllabus
                </span>
                <button
                  type="button"
                  onClick={(e) => handleEnquireCourse(e, course)}
                  className="px-3 py-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  Enquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
              Why Learn With Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Practical Training Focused on Real Competence
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Clear learning objectives, experienced guidance, and comprehensive workstation access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.whyChooseUs &&
              settings.whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-4">
                    <CheckCircle2 className="w-5 h-5 text-blue-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      {activeServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                Our Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Computer Education & Training Services
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPage('services')}
              className="text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>Explore All Services</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{srv.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{srv.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEnquiryPreselectedCourse(srv.title);
                      setPage('contact');
                    }}
                    className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Enquire about this service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Preview Section */}
      {previewGallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                Center Facilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Learning Environment & Labs
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPage('gallery')}
              className="text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>View Full Gallery</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setPage('gallery')}
                className="cursor-pointer group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-4/3 shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent p-5 flex flex-col justify-end text-white">
                  <h4 className="font-bold text-base">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-slate-300 line-clamp-1 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Get Started Today
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have Questions or Want to Enroll?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Submit an online enquiry or visit Ekta Computer Center during open hours. Our instructors will assist you in selecting the right course.
            </p>
          </div>
          <div className="shrink-0 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPage('contact')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 active:scale-95 shadow-md transition-all"
            >
              Submit Admission Enquiry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
