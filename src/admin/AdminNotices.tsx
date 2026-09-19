import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Calendar
} from 'lucide-react';

export const AdminNotices: React.FC = () => {
  const { notices, saveNotice, removeNotice } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [publishedAt, setPublishedAt] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  // Delete modal
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  const filteredNotices = notices.filter((n) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === '' ||
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query);
    const matchesStatus = filterStatus === 'All' || n.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setTitle('');
    setContent('');
    setPriority('normal');
    setPublishedAt(new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }));
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setContent(notice.content);
    setPriority(notice.priority);
    setPublishedAt(notice.publishedAt || '');
    setStatus(notice.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await saveNotice({
      id: editingNotice?.id,
      title: title.trim(),
      content: content.trim(),
      priority,
      publishedAt: publishedAt.trim() || new Date().toLocaleDateString(),
      status
    });

    setIsModalOpen(false);
  };

  const handleToggleStatus = (notice: Notice) => {
    saveNotice({
      ...notice,
      status: notice.status === 'published' ? 'draft' : 'published'
    });
  };

  return (
    <div id="admin-notices-view" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notices & Circulars
          </h2>
          <p className="text-xs text-slate-500">
            Publish official announcements, batch schedules, holidays, and urgent circulars.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Notice</span>
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
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Notice Title & Content</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Publish Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{notice.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-2 mt-0.5 max-w-md">
                        {notice.content}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          notice.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : notice.priority === 'important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {notice.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600">
                      {notice.publishedAt || 'Current'}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(notice)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          notice.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {notice.status === 'published' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(notice)}
                          className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeToDelete(notice)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    No notices match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="notice-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            id="notice-modal-content"
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <h3 className="font-extrabold text-lg">
                {editingNotice ? 'Edit Notice' : 'Publish Notice'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label htmlFor="notice-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notice Title *
                </label>
                <input
                  id="notice-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Batch Admissions Open for Tally & Web Development"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="notice-priority" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Priority Level
                  </label>
                  <select
                    id="notice-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important (Featured)</option>
                    <option value="urgent">Urgent Circular</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notice-status" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    id="notice-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="notice-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Publication Date Display
                </label>
                <input
                  id="notice-date"
                  type="text"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  placeholder="e.g. Oct 1, 2026"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="notice-content" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notice Details & Instructions *
                </label>
                <textarea
                  id="notice-content"
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full text of the announcement..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                ></textarea>
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
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {noticeToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete Notice"
          message={`Are you sure you want to delete the notice "${noticeToDelete.title}"? This announcement will be removed.`}
          confirmLabel="Delete Notice"
          isDestructive={true}
          onConfirm={() => removeNotice(noticeToDelete.id)}
          onCancel={() => setNoticeToDelete(null)}
        />
      )}
    </div>
  );
};
