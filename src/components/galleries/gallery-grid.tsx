"use client";

import Image from "next/image";
import { useEffect } from "react";

// Extended gallery type for display purposes
type GalleryDisplay = {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  updateCounter: number | null;
};

interface GalleryGridProps {
  galleries: GalleryDisplay[];
}

export function GalleryGrid({ galleries }: GalleryGridProps) {
  useEffect(() => {
    // Handle ESC key to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.target');
        if (openModal) {
          window.history.replaceState(null, '', window.location.pathname);
          openModal.classList.remove('target');
          openModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openModal = (galleryId: string) => {
    const modal = document.getElementById(`img-${galleryId}`);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('target');
    }
  };

  const closeModal = (galleryId: string) => {
    window.history.replaceState(null, '', window.location.pathname);
    const modal = document.getElementById(`img-${galleryId}`);
    if (modal) {
      modal.classList.remove('target');
      modal.classList.add('hidden');
    }
  };

  return (
    <>
      {/* Responsive thumbnail grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {galleries.map((it) => (
          <button
            key={it.id}
            onClick={() => openModal(it.id)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-border hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-transparent border-none cursor-pointer"
            aria-label={`Buka ${it.title}`}
          >
            <div className="relative w-full h-full">
              <Image
                src={it.src}
                alt={it.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                priority={false}
                unoptimized
              />
            </div>

            {/* corner badge */}
            <div className="absolute top-2 right-2">
              <span className="rounded-md bg-secondary/80 backdrop-blur px-2 py-0.5 text-xs">
                Gallery
              </span>
            </div>

            {/* bottom label */}
            <div className="absolute inset-x-2 bottom-2">
              <span className="inline-block max-w-[90%] truncate rounded-md bg-secondary/80 backdrop-blur px-2 py-0.5 text-xs">
                {it.title}
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* CSS-only lightboxes (one per image) */}
      {galleries.map((it) => (
        <section
          key={`lb-${it.id}`}
          id={`img-${it.id}`}
          className="fixed inset-0 z-50 hidden items-center justify-center bg-black/70 p-4 target:flex"
          aria-labelledby={`img-title-${it.id}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Click outside to close */}
          <div 
            className="absolute inset-0"
            onClick={() => closeModal(it.id)}
          />

          {/* Close button - positioned in top right */}
          <button
            onClick={() => closeModal(it.id)}
            className="absolute top-4 right-4 z-10 text-white hover:text-white/80 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            aria-label="Tutup"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Image container - centered */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <figure className="rounded-xl overflow-hidden bg-white shadow-2xl">
              <div className="relative max-w-[80vw] max-h-[80vh]">
                <Image
                  src={it.src}
                  alt={it.title}
                  width={800}
                  height={600}
                  className="object-contain max-w-full max-h-full"
                  sizes="90vw"
                  priority
                  unoptimized
                />
              </div>
              <figcaption className="p-4 text-sm text-gray-600 bg-white">
                <span id={`img-title-${it.id}`} className="font-medium text-gray-900">{it.title}</span>
                {it.subtitle ? <span className="ml-2 text-gray-500">{it.subtitle}</span> : null}
              </figcaption>
            </figure>
          </div>
        </section>
      ))}
    </>
  );
}
