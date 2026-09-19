import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Monitor,
  Calculator,
  Code,
  Keyboard,
  Laptop,
  X
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, saveService, removeService } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Monitor');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const icons = ['Monitor', 'Calculator', 'Code', 'Keyboard', 'Laptop'];

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle('');
    setDescription('');
    setIconName('Monitor');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setTitle(srv.title);
    setDescription(srv.description);
    setIconName(srv.iconName);
    setStatus(srv.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await saveService({
      id: editingService?.id,
      title: title.trim(),
      description: description.trim(),
      iconName,
      status
    });

    setIsModalOpen(false);
  };

  const handleToggleStatus = (srv: Service) => {
    saveService({
      ...srv,
      status: srv.status === 'active' ? 'inactive' : 'active'
    });
  };

  return (
    <div id="admin-services-view" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Services & Offerings
          </h2>
          <p className="text-xs text-slate-500">
            Manage educational services, assessment programs, and specialized training cards.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Grid of services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Icon: {srv.iconName}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(srv)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    srv.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {srv.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(srv)}
                className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setServiceToDelete(srv)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="service-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            id="service-modal-content"
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <h3 className="font-extrabold text-lg">
                {editingService ? 'Edit Service' : 'Add Service'}
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
                <label htmlFor="service-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service Title *
                </label>
                <input
                  id="service-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Practical Typing & Speed Assessment"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="service-icon" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Icon
                </label>
                <select
                  id="service-icon"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                >
                  {icons.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="service-status" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  id="service-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div>
                <label htmlFor="service-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service Description *
                </label>
                <textarea
                  id="service-desc"
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the service entails for students or clients..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {serviceToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete Service"
          message={`Are you sure you want to delete "${serviceToDelete.title}"?`}
          confirmLabel="Delete"
          isDestructive={true}
          onConfirm={() => removeService(serviceToDelete.id)}
          onCancel={() => setServiceToDelete(null)}
        />
      )}
    </div>
  );
};
