"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

type Aesthetic = {
  id: string;
  title: string;
  coverImage: string;
  link: string;
};

interface AestheticsSectionProps {
  title: string;
  aesthetics: Aesthetic[];
}

export function AestheticsSection({ title, aesthetics }: AestheticsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Number of items to display per page
  const itemsPerPage = 5;
  // Calculate total number of pages
  const totalPages = Math.ceil(aesthetics.length / itemsPerPage);
  
  // Get all pages of items
  const pages = Array.from({ length: totalPages }, (_, i) => {
    const startIndex = i * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return aesthetics.slice(startIndex, endIndex);
  });

  const handlePrev = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section className="max-w-[1000px] mx-auto px-4 sm:px-6 mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-gascogne font-normal leading-6 text-zinc-950">
          {title}
        </h2>
        <div className="text-sm text-gray-500">
          Page {currentPage + 1} of {totalPages}
        </div>
      </div>
      
      <div className="relative group rounded-xl">
        <button
          onClick={handlePrev}
          className={`absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center z-10 border ${
            currentPage === 0 || isAnimating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          aria-label="Previous items"
          disabled={currentPage === 0 || isAnimating}
        >
          <IoIosArrowRoundBack className="h-6 w-6" />
        </button>

        <div className="overflow-hidden">
          <div 
            className="relative w-full"
            style={{
              height: '280px'
            }}
          >
            {pages.map((pageItems, pageIndex) => (
              <div
                key={`page-${pageIndex}`}
                className="absolute top-0 w-full grid grid-flow-col auto-cols-[minmax(200px,1fr)] gap-5 transition-all duration-500 ease-out"
                style={{
                  transform: `translateX(${(pageIndex - currentPage) * 100}%)`,
                  opacity: pageIndex === currentPage ? 1 : 0.7,
                }}
              >
                {pageItems.map((item, index) => (
                  <Link href={item.link} key={item.id || `${pageIndex}-${index}`}>
                    <div
                      className="snap-start item-card"
                      onMouseEnter={() => setHoveredIndex(pageIndex === currentPage ? index : null)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div
                        className={`aspect-square relative mb-3 bg-gray-50 overflow-hidden group rounded-xl w-full max-w-[200px] transition-transform duration-300 ${
                          hoveredIndex === index && pageIndex === currentPage ? "scale-110" : "scale-100"
                        }`}
                      >
                        <Image
                          src={item.coverImage || "/placeholder.svg?height=400&width=400"}
                          alt={item.title || "Aesthetic"}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col max-w-[200px]">
                        <h3 className="text-sm text-gray-700 line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className={`absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border bg-white flex items-center justify-center z-10 ${
            currentPage >= totalPages - 1 || isAnimating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          aria-label="Next items"
          disabled={currentPage >= totalPages - 1 || isAnimating}
        >
          <IoIosArrowRoundForward className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}