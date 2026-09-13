"use client";

import { useEffect } from "react";

type VideoModalProps = {
  youtubeId: string | null;
  onClose: () => void;
  title?: string;
};

export function VideoModal({ youtubeId, onClose, title }: VideoModalProps) {
  const isOpen = Boolean(youtubeId);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!youtubeId) return null;

  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-none md:backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Video player"}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 font-sans text-xl leading-none text-white transition hover:bg-white/10"
        aria-label="Close video"
      >
        ×
      </button>

      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl">
          <iframe
            key={youtubeId}
            src={src}
            title={title ?? "YouTube video"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}
