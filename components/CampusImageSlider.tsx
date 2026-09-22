'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface CampusImageSliderProps {
  collegeName: string;
  slug?: string;
  photos?: string[];
  className?: string;
}

export default function CampusImageSlider({
  collegeName,
  photos,
  className = '',
}: CampusImageSliderProps) {

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Curated high-res educational campus imagery as fallbacks
  const defaultImages = [
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80', // University Main Hall
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80', // Campus quad & lawn
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80', // Library & Study spaces
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1000&q=80', // Modern architecture & labs
  ];

  const images = photos && photos.length > 0 ? photos : defaultImages;

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-950 group select-none shadow-md ${className}`}>
      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((imgUrl, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative aspect-16/9 max-h-[260px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={`${collegeName} campus view ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide Counter & Label Pill */}
      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
        <Camera className="w-3 h-3 text-white/80" />
        <span>Campus Tour</span>
        <span className="text-white/60">&middot;</span>
        <span className="font-mono">
          {selectedIndex + 1}/{images.length}
        </span>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all rounded-full ${
              index === selectedIndex ? 'w-5 h-1.5 bg-[#0b53c3]' : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
