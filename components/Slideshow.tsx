// components/Slideshow.tsx

"use client";

import Image from "next/image";
import { Slide } from "@/utils/Slideshow";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link"; // <<< PERBAIKAN DI SINI: IMPORT Link

interface SlideshowProps {
  slides: Slide[];
}

const Slideshow = ({ slides }: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(goToNext, 5000);
      return () => clearInterval(interval);
    }
  }, [goToNext, slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 h-64 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Tidak ada slide tersedia.</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <div className="relative w-full" style={{ paddingBottom: "40%" }}>
        {" "}
        {/* Rasio aspek 16:9 (9/16 * 100% = 56.25%), 40% untuk rasio yang lebih lebar */}
        <Image
          src={currentSlide.imageUrl}
          alt={currentSlide.alt}
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Navigasi Dot */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Navigasi Panah */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? slides.length - 1 : prevIndex - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors duration-200"
            aria-label="Previous slide"
          >
            &lt;
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors duration-200"
            aria-label="Next slide"
          >
            &gt;
          </button>
        </>
      )}

      {/* Link untuk Slide */}
      {currentSlide.link && currentSlide.link !== "#" && (
        <Link
          href={currentSlide.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 block"
          aria-label={currentSlide.title}
        ></Link>
      )}
    </div>
  );
};

export default Slideshow;
