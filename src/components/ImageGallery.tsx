"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { GemImage } from "@/types/database";

interface ImageGalleryProps {
  images: GemImage[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-card-bg border border-card-border rounded-xl flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="text-card-border mx-auto mb-2" size={64} />
          <p className="text-sm text-muted">No images available</p>
        </div>
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square bg-card-bg border border-card-border rounded-xl overflow-hidden group">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt_text || title}
          fill
          className={`object-contain transition-transform duration-300 ${zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`}
          onClick={() => setZoomed(!zoomed)}
          priority
        />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 p-1.5 bg-background/80 rounded-lg text-muted opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={14} />
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 text-xs bg-background/80 text-foreground px-2 py-1 rounded">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                i === activeIndex
                  ? "border-gold"
                  : "border-card-border hover:border-gold/50 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text || `${title} ${i + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
