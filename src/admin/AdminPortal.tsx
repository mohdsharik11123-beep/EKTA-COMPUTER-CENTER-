import React, { useState } from 'react';
import { useApp, AdminTab } from '../context/AppContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminCourses } from './AdminCourses';
import { AdminEnquiries } from './AdminEnquiries';
import { AdminNotices } from './AdminNotices';
import { AdminGallery } from './AdminGallery';
import { AdminServices } from './AdminServices';
import { AdminHomepage } from './AdminHomepage';
import { AdminSettings } from './AdminSettings';
import {
  LayoutDashboard,
  BookOpen,
  Inbox,
  Bell,
  Image as ImageIcon,
  Wrench,
  Globe,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  UserCheck
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    isAuthenticated,
    isAuthorizedAdmin,
    adminTab,
    setAdminTab,
    setPage,
    logoutAdmin,
    adminUser,
    enquiries,
    courses
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not authenticated or not authorized, show login screen
  if (!isAuthenticated || !isAuthorizedAdmin) {
    return <AdminLogin />;
  }

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen, badge: courses.length },
    { id: 'enquiries', label: 'Enquiries', icon: Inbox, badge: newEnquiriesCount },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'homepage', label: 'Homepage Copy', icon: Globe },
    { id: 'settings', label: 'Center Settings', icon: Settings }
  ];

  const handleTabSelect = (tab: AdminTab) => {
    setAdminTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div id="admin-portal" className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand + Badge */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 lg:hidden"
                aria-label="Toggle admin sidebar"
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div
                onClick={() => handleTabSelect('dashboard')}
                className="cursor-pointer flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  ECC
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-sm tracking-tight text-white block">
                    Ekta Computer Center
                  </span>
                  <span className="text-2xs text-blue-400 font-semibold block uppercase">
                    Admin Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Right: User + Actions */}
            <div className="flex items-center gap-3">
              {/* Authenticated user badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Admin:</span>
                <strong className="text-white">{adminUser?.username || 'Puter Admin'}</strong>
              </div>

              {/* View Public Website */}
              <button
                type="button"
                onClick={() => setPage('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span>View Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* Sign Out */}
              <button
                type="button"
                onClick={logoutAdmin}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Sign out of Admin Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
            <nav className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xs space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = adminTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-2xs font-extrabold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.id === 'enquiries'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-500 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Puter Cloud Security</span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed">
                All data is synchronized with your Puter Key-Value database and file system.
              </p>
            </div>
          </aside>

          {/* Mobile Sidebar Drawer */}
          {mobileSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <div
                className="w-72 bg-white h-full p-4 space-y-2 shadow-2xl animate-in slide-in-from-left duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                  <span className="font-bold text-sm text-slate-900">Admin Navigation</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-700 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-2xs font-extrabold bg-rose-100 text-rose-700">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content Area */}
          <main className="lg:col-span-9 w-full min-w-0">
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'courses' && <AdminCourses />}
            {adminTab === 'enquiries' && <AdminEnquiries />}
            {adminTab === 'notices' && <AdminNotices />}
            {adminTab === 'gallery' && <AdminGallery />}
            {adminTab === 'services' && <AdminServices />}
            {adminTab === 'homepage' && <AdminHomepage />}
            {adminTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    </div>
  );
};
