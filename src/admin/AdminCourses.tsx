import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course, CourseLevel } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  BookOpen,
  X,
  PlusCircle,
  MinusCircle
} from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const { courses, saveCourse, removeCourse } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Computer Fundamentals');
  const [level, setLevel] = useState<CourseLevel>('Beginner');
  const [duration, setDuration] = useState('3 Months');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [feeNotes, setFeeNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [featured, setFeatured] = useState(false);
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');

  // Delete modal state
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const categories = [
    'Computer Fundamentals',
    'Office Productivity',
    'Financial Accounting',
    'Programming & Web',
    'Design & Multimedia',
    'Hardware & Networking'
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setTitle('');
    setCategory('Computer Fundamentals');
    setLevel('Beginner');
    setDuration('3 Months');
    setShortDescription('');
    setDescription('');
    setFeeNotes('');
    setStatus('active');
    setFeatured(false);
    setCurriculum(['Introduction to Operating Systems & File Management', 'Practical Typing & Document Creation']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setCategory(course.category);
    setLevel(course.level);
    setDuration(course.duration);
    setShortDescription(course.shortDescription);
    setDescription(course.description);
    setFeeNotes(course.feeNotes || '');
    setStatus(course.status);
    setFeatured(course.featured);
    setCurriculum(course.curriculum || []);
    setIsModalOpen(true);
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setCurriculum([...curriculum, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index: number) => {
    setCurriculum(curriculum.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDescription.trim()) return;

    await saveCourse({
      id: editingCourse?.id,
      title: title.trim(),
      category: category.trim(),
      level,
      duration: duration.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim() || shortDescription.trim(),
      feeNotes: feeNotes.trim(),
      status,
      featured,
      curriculum
    });

    setIsModalOpen(false);
  };

  const handleToggleStatus = (course: Course) => {
    saveCourse({
      ...course,
      status: course.status === 'active' ? 'inactive' : 'active'
    });
  };

  const handleToggleFeatured = (course: Course) => {
    saveCourse({
      ...course,
      featured: !course.featured
    });
  };

  return (
    <div id="admin-courses-view" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Course Management
          </h2>
          <p className="text-xs text-slate-500">
            Create, update curriculum, toggle visibility, or delete training courses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Courses Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Course Name</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Duration & Level</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{course.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 max-w-sm">
                        {course.shortDescription}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800">{course.duration}</div>
                      <div className="text-slate-500">{course.level}</div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(course)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          course.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {course.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(course)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          course.featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-400'
                        }`}
                        title={course.featured ? 'Featured on Home' : 'Not featured'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(course)}
                          className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label="Edit course"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCourseToDelete(course)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          aria-label="Delete course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    No courses match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div
          id="course-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            id="course-modal-content"
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <h3 className="font-extrabold text-lg">
                {editingCourse ? 'Edit Course Details' : 'Create New Course'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Course Title *
                  </label>
                  <input
                    id="course-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Certificate in Financial Accounting (Tally Prime)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="course-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    id="course-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="course-duration" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Duration *
                  </label>
                  <input
                    id="course-duration"
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Months / 90 Hours"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="course-level" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Level
                  </label>
                  <select
                    id="course-level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as CourseLevel)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="course-status" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Visibility Status
                  </label>
                  <select
                    id="course-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="course-short-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Summary (Cards & Previews) *
                </label>
                <textarea
                  id="course-short-desc"
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Concise 1-2 sentence overview shown on course cards..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                ></textarea>
              </div>

              <div>
                <label htmlFor="course-full-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Course Description
                </label>
                <textarea
                  id="course-full-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive explanation of what students will achieve in this program..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                ></textarea>
              </div>

              {/* Curriculum Modules */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Curriculum Topics & Modules
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    placeholder="e.g. Master GST Invoicing & Reconciliation"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
                  >
                    Add Topic
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {curriculum.map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <span className="truncate">{topic}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {curriculum.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No topics added yet.</p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input
                  id="course-featured-chk"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="course-featured-chk" className="text-xs font-semibold text-slate-700">
                  Feature this course prominently on the homepage
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete Course"
          message={`Are you sure you want to permanently delete "${courseToDelete.title}"? This action removes it from the course database.`}
          confirmLabel="Delete Course"
          isDestructive={true}
          onConfirm={() => removeCourse(courseToDelete.id)}
          onCancel={() => setCourseToDelete(null)}
        />
      )}
    </div>
  );
};
