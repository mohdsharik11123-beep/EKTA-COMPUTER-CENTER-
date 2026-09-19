import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Enquiry } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Search,
  Inbox,
  Clock,
  Phone,
  Mail,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  FileText,
  X,
  ExternalLink
} from 'lucide-react';

export const AdminEnquiries: React.FC = () => {
  const { enquiries, updateEnquiryStatus, removeEnquiry } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  // Inspection Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Delete Modal
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);

  const filteredEnquiries = enquiries.filter((e) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === '' ||
      e.name.toLowerCase().includes(query) ||
      e.phone.toLowerCase().includes(query) ||
      (e.email && e.email.toLowerCase().includes(query)) ||
      e.course.toLowerCase().includes(query) ||
      e.message.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setNotes(enquiry.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsSavingNotes(true);
    try {
      await updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, notes);
      setSelectedEnquiry({ ...selectedEnquiry, notes });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleChangeStatus = async (status: 'new' | 'contacted' | 'closed') => {
    if (!selectedEnquiry) return;
    await updateEnquiryStatus(selectedEnquiry.id, status, notes);
    setSelectedEnquiry({ ...selectedEnquiry, status });
  };

  return (
    <div id="admin-enquiries-view" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student & Admission Enquiries
          </h2>
          <p className="text-xs text-slate-500">
            Confidential enquiries submitted via public website. Never exposed to public users.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Total Enquiries: <strong className="text-slate-900">{enquiries.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, course..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'new', 'contacted', 'closed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Applicant Name</th>
                <th className="py-4 px-4">Contact Details</th>
                <th className="py-4 px-4">Course of Interest</th>
                <th className="py-4 px-4">Date Received</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{enquiry.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 italic max-w-xs mt-0.5">
                        "{enquiry.message}"
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>{enquiry.phone}</span>
                      </div>
                      {enquiry.email && (
                        <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{enquiry.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-100 inline-block">
                        {enquiry.course}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {new Date(enquiry.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          enquiry.status === 'new'
                            ? 'bg-rose-100 text-rose-800'
                            : enquiry.status === 'contacted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(enquiry)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEnquiryToDelete(enquiry)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          aria-label="Delete enquiry"
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
                    No enquiries match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Inspection Modal */}
      {selectedEnquiry && (
        <div
          id="enquiry-detail-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            id="enquiry-detail-modal"
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-lg">Enquiry Inspection</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Applicant Header */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-lg">{selectedEnquiry.name}</h4>
                  <span className="text-xs text-slate-500">
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-semibold">PHONE</span>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{selectedEnquiry.phone}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">WHATSAPP QUICK CHAT</span>
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Send Message</span>
                    </a>
                  </div>
                  {selectedEnquiry.email && (
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-semibold">EMAIL</span>
                      <a
                        href={`mailto:${selectedEnquiry.email}`}
                        className="text-slate-800 hover:text-blue-700 hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{selectedEnquiry.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Course & Message */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">
                    Course / Service
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {selectedEnquiry.course}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Processing Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChangeStatus('new')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      selectedEnquiry.status === 'new'
                        ? 'bg-rose-100 border-rose-300 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    New (Uncontacted)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeStatus('contacted')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      selectedEnquiry.status === 'contacted'
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Contacted
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeStatus('closed')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      selectedEnquiry.status === 'closed'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Closed / Enrolled
                  </button>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label htmlFor="enquiry-notes" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Internal Administrative Notes (Private)
                </label>
                <textarea
                  id="enquiry-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record call logs, preferred batch timings, follow-up dates..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEnquiryToDelete(selectedEnquiry);
                  setSelectedEnquiry(null);
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Delete Enquiry Record
              </button>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete Enquiry Record"
          message={`Are you sure you want to delete the enquiry from "${enquiryToDelete.name}"? This record will be permanently removed from the cloud database.`}
          confirmLabel="Delete Enquiry"
          isDestructive={true}
          onConfirm={() => removeEnquiry(enquiryToDelete.id)}
          onCancel={() => setEnquiryToDelete(null)}
        />
      )}
    </div>
  );
};
