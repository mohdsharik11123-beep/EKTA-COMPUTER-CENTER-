import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Inbox,
  Bell,
  Image as ImageIcon,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    courses,
    enquiries,
    notices,
    gallery,
    adminUser,
    puterConnected,
    setAdminTab,
    updateEnquiryStatus
  } = useApp();

  // Genuine calculated real numbers only
  const activeCoursesCount = courses.filter((c) => c.status === 'active').length;
  const totalEnquiriesCount = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const publishedNoticesCount = notices.filter((n) => n.status === 'published').length;
  const galleryCount = gallery.length;

  const recentEnquiries = enquiries.slice(0, 5);
  const recentNotices = notices.slice(0, 4);

  return (
    <div id="admin-dashboard-view" className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & Status Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Admin Session Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ekta Computer Center Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Authenticated via Puter account: <strong className="text-slate-800">{adminUser?.username || 'Primary Administrator'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block">Cloud Storage</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{puterConnected ? 'Puter.js Live' : 'Puter Ready (Cache Active)'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Summary Metrics Cards (100% real calculated data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={() => setAdminTab('courses')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-400">Total: {courses.length}</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{activeCoursesCount}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Active Courses</div>
        </div>

        <div
          onClick={() => setAdminTab('enquiries')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <Inbox className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
            {newEnquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 animate-pulse">
                {newEnquiriesCount} New
              </span>
            )}
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalEnquiriesCount}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Total Enquiries</div>
        </div>

        <div
          onClick={() => setAdminTab('enquiries')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <AlertCircle className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-400">Pending</span>
          </div>
          <div className="text-3xl font-extrabold text-rose-600">{newEnquiriesCount}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Uncontacted Enquiries</div>
        </div>

        <div
          onClick={() => setAdminTab('notices')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <Bell className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-400">Total: {notices.length}</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{publishedNoticesCount}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Published Notices</div>
        </div>

        <div
          onClick={() => setAdminTab('gallery')}
          className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <ImageIcon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-400">Photos</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{galleryCount}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Gallery Images</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-2">
          Quick Actions:
        </span>
        <button
          type="button"
          onClick={() => setAdminTab('courses')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Course</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('notices')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish Notice</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('gallery')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Image</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('enquiries')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>View Student Enquiries</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('settings')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors ml-auto"
        >
          <span>Center Settings & Contacts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Recent Enquiries + Recent Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Student Enquiries</h2>
              <p className="text-xs text-slate-500">Private enquiries received via website forms</p>
            </div>
            <button
              type="button"
              onClick={() => setAdminTab('enquiries')}
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              <span>View all ({totalEnquiriesCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{enquiry.name}</span>
                      <span
                        className={`text-2xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          enquiry.status === 'new'
                            ? 'bg-rose-100 text-rose-800'
                            : enquiry.status === 'contacted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>Phone: <strong className="text-slate-700">{enquiry.phone}</strong></span>
                      <span>•</span>
                      <span>Course: <strong className="text-slate-700">{enquiry.course}</strong></span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 italic">
                      "{enquiry.message}"
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {enquiry.status === 'new' && (
                      <button
                        type="button"
                        onClick={() => updateEnquiryStatus(enquiry.id, 'contacted')}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        Mark Contacted
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No student enquiries submitted yet.</p>
            </div>
          )}
        </div>

        {/* Recent Notices */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Notices</h2>
              <p className="text-xs text-slate-500">Announcements displayed on website</p>
            </div>
            <button
              type="button"
              onClick={() => setAdminTab('notices')}
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentNotices.length > 0 ? (
            <div className="space-y-3">
              {recentNotices.map((notice) => (
                <div key={notice.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold uppercase text-2xs px-2 py-0.5 rounded-md ${
                        notice.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : notice.priority === 'important'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {notice.priority}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {notice.publishedAt || 'Current'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{notice.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No notices created yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
