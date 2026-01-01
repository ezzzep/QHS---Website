import Image from "next/image";
import { useTestimonialCarousel } from "@/hooks/useTestimonialCarousel";
import { Testimonial } from "@/types/faculty";

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Engr. Ignacio T. Manlangit",
    position: "President",
    image: "/images/sir.png",
    content: ["BS Geodetic Engineering", "BS Civil Engineering"],
  },
  {
    id: 2,
    name: "Dr. Melinda T. Manlangit",
    position: "Directress",
    image: "/images/dra.png",
    content: [
      "Former Principal - Queen's Row, Gawaran, and Aniban Elementary School",
      "District Supervisor / Mother Supervisor - Bacoor | Ret. Division Supervisor (H.E) DepEd Cavite",
    ],
  },
  {
    id: 3,
    name: "Dr. Ma. Christina M. Soliman",
    position: "Vice - President",
    image: "/images/mam-cristina.png",
    content: ["Registered Nurse", "Doctor of Medicine"],
  },
  {
    id: 4,
    name: "Mrs. Kathlyn Marie Manlangit-Sabio",
    position: "Secretary",
    image: "/images/mam-kath.png",
    content: ["AB Communication Arts"],
  },
  {
    id: 5,
    name: "Engr. Angelique Manlangit-Gamboa",
    position: "Treasurer",
    image: "/images/mam-angelique.png",
    content: ["BS Chemical Engineering"],
  },
  {
    id: 6,
    name: "Mr. Christopher T. Manlangit",
    position: "Business Manager",
    image: "/images/sir-christopher.png",
    content: ["BS Architecture"],
  },
  {
    id: 7,
    name: "Mrs. Karen Manlangit-Orcino",
    position: "School Principal",
    image: "/images/mam-karen.png",
    content: [
      "BS Biology",
      "(LL.B) Bachelor of Laws (3rd Year)",
      "(BECEd) Bachelor of Early Childhood Education",
      "18 Units Methods of Teaching",
    ],
  },
];

export default function TestimonialCarousel() {
  const {
    carouselRef,
    isPaused,
    setIsPaused,
    handleScrollLeft,
    handleScrollRight,
    handleManualScroll,
    toggleCardFlip,
    flippedCards,
  } = useTestimonialCarousel();

  return (
    <div className="w-full mb-8 sm:mb-12 relative">
      <div className="flex items-center">
        <button
          onClick={handleScrollLeft}
          className="absolute left-0 sm:left-2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 sm:p-2 shadow-md"
          aria-label="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide space-x-3 sm:space-x-6 py-4 px-8 sm:px-12 scroll-smooth"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onScroll={handleManualScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex-none w-64 sm:w-80 h-80 sm:h-96 relative"
              style={{ perspective: "1000px" }}
            >
              <div
                className={`absolute inset-0 w-full h-full transition-all duration-700 cursor-pointer transform-gpu hover:scale-105 ${
                  flippedCards.has(testimonial.id) ? "rotate-y-180" : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: flippedCards.has(testimonial.id)
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                }}
                onClick={() => toggleCardFlip(testimonial.id)}
              >
                <div
                  className="absolute inset-0 w-full h-full bg-gray-100 rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4 bg-gray-200">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-center text-base sm:text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-md sm:text-md text-green-600 text-center">
                    {testimonial.position}
                  </p>
                  <div className="flex-grow"></div>
                  <p className="text-xs sm:text-sm text-gray-400/80 text-center mt-4">
                    Click to see more
                  </p>
                </div>

                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center justify-between text-white backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-center">
                      {testimonial.name}
                    </h3>
                    <div className="text-sm sm:text-lg text-center">
                      {testimonial.content.map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < testimonial.content.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-center opacity-80">
                    Click to go back
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleScrollRight}
          className="absolute right-0 sm:right-2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 sm:p-2 shadow-md"
          aria-label="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
