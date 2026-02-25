'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImagePreviewProps {
  src?: string;
  images?: string[];
  initialIndex?: number;
  alt?: string;
  onClose: () => void;
}

export default function ImagePreview({ src, images, initialIndex = 0, alt = '', onClose }: ImagePreviewProps) {
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(initialIndex);

  const gallery = images ?? (src ? [src] : []);
  const hasMany = gallery.length > 1;

  const prev = useCallback(() => setIndex(i => (i - 1 + gallery.length) % gallery.length), [gallery.length]);
  const next = useCallback(() => setIndex(i => (i + 1) % gallery.length), [gallery.length]);

  useEffect(() => { setMounted(true) }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  if (!mounted || gallery.length === 0) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes previewBackdropIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes previewBackdropOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes previewImageIn  {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes previewImageOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.88); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99998] bg-black/80 backdrop-blur-sm cursor-zoom-out"
        style={{ animation: `${closing ? 'previewBackdropOut' : 'previewBackdropIn'} 0.28s ease forwards` }}
        onClick={handleClose}
      />

      {/* Image container */}
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none"
        style={{ animation: `${closing ? 'previewImageOut' : 'previewImageIn'} 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards` }}
      >
        <div className="relative pointer-events-auto rounded-2xl overflow-hidden max-w-[90vw] max-h-[90vh]"
          style={{ boxShadow: '0 0 0 1.5px rgba(0,210,255,0.4), 0 0 60px rgba(0,180,255,0.2), 0 32px 80px rgba(0,0,0,0.8)' }}
        >
          <Image
            key={gallery[index]}
            src={gallery[index]}
            alt={`${alt} ${index + 1}`}
            width={1200}
            height={900}
            className="block max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
          />
          {/* Neon tone overlay */}
          <div
            className="absolute inset-0 mix-blend-overlay pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.2) 0%, rgba(180,0,255,0.12) 100%)' }}
          />
        </div>

        {/* Prev button */}
        {hasMany && (
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,210,255,0.3)', color: '#b8e8ff', boxShadow: '0 0 12px rgba(0,180,255,0.2)' }}
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
        )}

        {/* Next button */}
        {hasMany && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,210,255,0.3)', color: '#b8e8ff', boxShadow: '0 0 12px rgba(0,180,255,0.2)' }}
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        )}

        {/* Dot indicators */}
        {hasMany && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className="rounded-full transition-all cursor-pointer"
                style={{ width: i === index ? 20 : 7, height: 7, padding: 0, border: 'none', background: i === index ? 'rgba(0,210,255,0.9)' : 'rgba(255,255,255,0.35)' }}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {hasMany && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,210,255,0.3)', color: '#b8e8ff', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
            {index + 1} / {gallery.length}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,210,255,0.3)', color: '#b8e8ff', boxShadow: '0 0 12px rgba(0,180,255,0.2)' }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </>,
    document.body
  );
}
