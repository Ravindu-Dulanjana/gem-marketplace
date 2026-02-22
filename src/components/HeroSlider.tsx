"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "A Wide Range of High-Quality Gems",
    subtitle: "Discover rare and exquisite gemstones from certified sellers around the world",
    cta: { label: "Browse Collection", href: "/shop" },
  },
  {
    title: "Mine to Market",
    subtitle: "Direct from source — authentic gems with full provenance and certification",
    cta: { label: "Learn More", href: "/about" },
  },
  {
    title: "Trusted Sellers, Verified Quality",
    subtitle: "Every seller is vetted and approved. Every gem is described with precision",
    cta: { label: "Start Selling", href: "/seller/register" },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-surface">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #d4af37 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, #d4af37 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />

      {/* Slide Content */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="text-center max-w-3xl mx-auto px-4 animate-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-6 leading-tight">
              {slide.title}
            </h1>
            <p className="text-base md:text-lg text-muted mb-8 max-w-2xl mx-auto">
              {slide.subtitle}
            </p>
            <Link
              href={slide.cta.href}
              className="inline-block px-8 py-3 bg-gold text-background font-semibold text-sm uppercase tracking-wider rounded hover:bg-gold-light transition-colors"
            >
              {slide.cta.label}
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-gold transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-gold transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === current
                ? "bg-gold w-8"
                : "bg-muted/40 hover:bg-muted"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
