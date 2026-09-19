import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, Calendar, AlertCircle, Info, Megaphone } from 'lucide-react';

export const NoticesView: React.FC = () => {
  const { notices } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const publishedNotices = useMemo(
    () => notices.filter((n) => n.status === 'published'),
    [notices]
  );

  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) return publishedNotices;
    const query = searchQuery.toLowerCase();
    return publishedNotices.filter(
      (n) => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
    );
  }, [publishedNotices, searchQuery]);

  return (
    <div id="notices-view" className="py-10 lg:py-16 space-y-10">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Announcements & Circulars
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Center Notices & Updates
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Stay informed with the latest official announcements, admission schedules, exam dates, and holiday circulars from Ekta Computer Center.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements & circulars..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs transition-all"
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
        </div>
      </section>

      {/* Notices List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredNotices.length > 0 ? (
          <div className="space-y-4">
            {filteredNotices.map((notice) => {
              const isUrgent = notice.priority === 'urgent';
              const isImportant = notice.priority === 'important';

              return (
                <div
                  key={notice.id}
                  className={`bg-white p-6 sm:p-7 rounded-3xl border transition-all ${
                    isUrgent
                      ? 'border-rose-200 bg-rose-50/20 shadow-xs'
                      : isImportant
                      ? 'border-amber-200 bg-amber-50/20 shadow-xs'
                      : 'border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {isUrgent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3" />
                          <span>Urgent Notice</span>
                        </span>
                      )}
                      {isImportant && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <Bell className="w-3 h-3" />
                          <span>Important</span>
                        </span>
                      )}
                      {!isUrgent && !isImportant && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          <Info className="w-3 h-3" />
                          <span>Official Notice</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Published: {notice.publishedAt || 'Current'}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{notice.title}</h3>
                  <div className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Megaphone className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No notices found</h3>
            <p className="text-xs text-slate-500">
              There are currently no active announcements matching your query.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
