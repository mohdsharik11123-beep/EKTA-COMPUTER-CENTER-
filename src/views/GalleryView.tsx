import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { gallery } = useApp();
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const publishedGallery = gallery.filter((item) => item.status === 'published');

  return (
    <div id="gallery-view" className="py-10 lg:py-16 space-y-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Visual Tour
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Center Photos & Facilities
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Take a look inside our computer labs, classrooms, and student project workshops at Ekta Computer Center.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {publishedGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 bg-white/90 backdrop-blur-xs text-slate-900 rounded-full shadow-md">
                      <ZoomIn className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No photos published yet</h3>
            <p className="text-xs text-slate-500">
              Photos uploaded through Puter storage by the administrator will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          id="gallery-lightbox-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div
            id="gallery-lightbox-content"
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white transition-colors"
              aria-label="Close image preview"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[70vh] flex items-center justify-center bg-black/40">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.altText || activeImage.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-6 bg-slate-900 text-white border-t border-slate-800">
              <h3 className="text-lg font-bold">{activeImage.title}</h3>
              {activeImage.description && (
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  {activeImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
