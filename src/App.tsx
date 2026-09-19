/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { CourseDetailModal } from './views/CourseDetailModal';

// Public Views
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { CoursesView } from './views/CoursesView';
import { ServicesView } from './views/ServicesView';
import { GalleryView } from './views/GalleryView';
import { NoticesView } from './views/NoticesView';
import { ContactView } from './views/ContactView';

// Admin Portal
import { AdminPortal } from './admin/AdminPortal';

const AppContent: React.FC = () => {
  const { page, setPage, selectedCourse, setSelectedCourse, isDataLoaded } = useApp();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-base shadow-sm animate-pulse mb-4">
          ECC
        </div>
        <h2 className="text-lg font-bold text-slate-900">Ekta Computer Center</h2>
        <p className="text-xs text-slate-500 mt-1">Connecting to Puter cloud database...</p>
      </div>
    );
  }

  // If user is on the admin page
  if (page === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased">
        <AdminPortal />
        <ToastContainer />
      </div>
    );
  }

  // Public Website Layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Header />

      <main className="flex-1">
        {page === 'home' && <HomeView />}
        {page === 'about' && <AboutView />}
        {page === 'courses' && <CoursesView />}
        {page === 'services' && <ServicesView />}
        {page === 'gallery' && <GalleryView />}
        {page === 'notices' && <NoticesView />}
        {page === 'contact' && <ContactView />}
      </main>

      <Footer />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

