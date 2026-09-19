import React from 'react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';
import { Clock, GraduationCap, Folder, CheckCircle, ArrowRight, X } from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose }) => {
  const { setPage, setEnquiryPreselectedCourse } = useApp();

  if (!course) return null;

  const handleEnquire = () => {
    setEnquiryPreselectedCourse(course.title);
    onClose();
    setPage('contact');
  };

  return (
    <div
      id="course-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="course-detail-modal"
        className="w-full max-w-3xl my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="relative bg-slate-900 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-600 text-white">
              {course.category}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {course.level}
            </span>
            {course.featured && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Featured Program
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {course.title}
          </h2>
          <p className="mt-2 text-slate-300 text-base leading-relaxed max-w-2xl">
            {course.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Duration: <strong className="text-white">{course.duration}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Level: <strong className="text-white">{course.level}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-blue-400" />
              <span>Category: <strong className="text-white">{course.category}</strong></span>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Course Overview</h3>
            <p className="text-slate-600 leading-relaxed text-base">
              {course.description}
            </p>
          </div>

          {/* Curriculum Modules */}
          {course.curriculum && course.curriculum.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Curriculum & Topics Covered</h3>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {course.curriculum.length} Core Modules
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.curriculum.map((topic, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700 leading-snug">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Administrative notes / Fee note if entered by admin */}
          {course.feeNotes && (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-sm text-blue-900">
              <strong className="block font-semibold mb-1">Tuition & Batch Information:</strong>
              {course.feeNotes}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Back to Courses
          </button>
          <button
            type="button"
            onClick={handleEnquire}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md transition-all"
          >
            <span>Enquire for this Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
