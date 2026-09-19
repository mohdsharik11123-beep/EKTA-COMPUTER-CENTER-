import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminGallery: React.FC = () => {
  const { gallery, uploadGalleryImage, saveGalleryItem, removeGalleryItem } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete modal
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Image size must be under 8MB.');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select an image file to upload.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please provide a title for this photograph.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const result = await uploadGalleryImage(selectedFile, {
        title: title.trim(),
        description: description.trim(),
        altText: altText.trim() || title.trim(),
        status
      });

      if (result.success) {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl('');
        setTitle('');
        setDescription('');
        setAltText('');
      } else {
        setErrorMsg(result.message || 'Failed to upload photo.');
      }
    } catch {
      setErrorMsg('Error saving photo to Puter storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleStatus = (item: GalleryItem) => {
    saveGalleryItem({
      ...item,
      status: item.status === 'published' ? 'draft' : 'published'
    });
  };

  return (
    <div id="admin-gallery-view" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Photo Gallery Management
          </h2>
          <p className="text-xs text-slate-500">
            Upload and organize real facility photos directly using Puter.js cloud file storage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setPreviewUrl('');
            setTitle('');
            setDescription('');
            setAltText('');
            setErrorMsg('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photograph</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-xs ${
                        item.status === 'published'
                          ? 'bg-emerald-900/80 text-emerald-200'
                          : 'bg-slate-900/80 text-slate-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className="text-slate-600 hover:text-blue-700 font-semibold"
                    >
                      {item.status === 'published' ? 'Set as Draft' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      aria-label="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-sm space-y-3">
            <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-700">No photos in gallery</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload photographs of your classrooms, computer workstations, and certificate distributions.
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div
          id="upload-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => !isUploading && setIsModalOpen(false)}
        >
          <div
            id="upload-modal-content"
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <h3 className="font-extrabold text-lg">Upload Facility Photo</h3>
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* File Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Image File (Puter File Storage) *
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-xl object-contain border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                        }}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Remove and select another file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="gallery-file-input"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="gallery-file-input"
                        className="cursor-pointer inline-flex flex-col items-center gap-2 py-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          Click to browse or drag and drop image
                        </span>
                        <span className="text-2xs text-slate-400">
                          PNG, JPG, WebP up to 8MB
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="photo-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Photo Title *
                </label>
                <input
                  id="photo-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Primary Computer Lab - Workstations"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="photo-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Caption (Optional)
                </label>
                <textarea
                  id="photo-desc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short context about the facility or student activity..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile || !title.trim()}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  {isUploading ? 'Uploading to Puter...' : 'Save & Publish Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete Photograph"
          message={`Are you sure you want to permanently delete "${itemToDelete.title}"?`}
          confirmLabel="Delete Photo"
          isDestructive={true}
          onConfirm={() => removeGalleryItem(itemToDelete.id)}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  );
};
