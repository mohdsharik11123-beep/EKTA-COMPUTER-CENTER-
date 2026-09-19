import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';
import { Search, Clock, GraduationCap, ArrowRight, Filter, BookOpen } from 'lucide-react';

export const CoursesView: React.FC = () => {
  const { courses, setSelectedCourse, setEnquiryPreselectedCourse, setPage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  // Filter only active courses for public catalog
  const activeCourses = useMemo(() => courses.filter((c) => c.status === 'active'), [courses]);

  // Extract unique categories from active courses
  const categories = useMemo(() => {
    const set = new Set<string>();
    activeCourses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, [activeCourses]);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return activeCourses.filter((course) => {
      const matchesSearch =
        searchQuery === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [activeCourses, searchQuery, selectedCategory, selectedLevel]);

  const handleEnquire = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setEnquiryPreselectedCourse(course.title);
    setPage('contact');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
  };

  return (
    <div id="courses-view" className="py-10 lg:py-16 space-y-10">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Academic Offerings
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Computer Courses & Programs
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore our curriculum of hands-on computer training programs. Click on any course to review module details, duration, and prerequisites.
          </p>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title, topic, or keyword (e.g. Tally, Python, Office, Web)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Category:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Level selection */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level:</span>
              <div className="flex items-center gap-1">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedLevel === lvl
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="cursor-pointer bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {course.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.level}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {course.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-3 text-xs font-medium text-slate-500">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Duration: <strong className="text-slate-700">{course.duration}</strong></span>
                  </div>

                  {course.curriculum && course.curriculum.length > 0 && (
                    <div className="pt-2 text-xs text-slate-500 border-t border-slate-100">
                      <span className="font-semibold text-slate-700 block mb-1">Key Modules:</span>
                      <ul className="space-y-1">
                        {course.curriculum.slice(0, 2).map((m, idx) => (
                          <li key={idx} className="truncate">• {m}</li>
                        ))}
                        {course.curriculum.length > 2 && (
                          <li className="text-blue-600 font-medium">+ {course.curriculum.length - 2} more modules...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 px-6 sm:px-7 py-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 group-hover:underline flex items-center gap-1">
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleEnquire(e, course)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all active:scale-95 shadow-xs"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No courses match your filter</h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
