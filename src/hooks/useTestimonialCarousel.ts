import { useState, useEffect, useRef } from "react";

export const useTestimonialCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isPaused || !carouselRef.current) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const newPosition = scrollPosition + 1;

        if (newPosition >= maxScroll) {
          carouselRef.current.scrollLeft = 0;
          setScrollPosition(0);
        } else {
          carouselRef.current.scrollLeft = newPosition;
          setScrollPosition(newPosition);
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, scrollPosition, maxScroll]);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (carouselRef.current) {
        setMaxScroll(
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth
        );
      }
    };

    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);
    return () => window.removeEventListener("resize", updateMaxScroll);
  }, []);

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      const newPosition = Math.max(0, scrollPosition - 300);
      carouselRef.current.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      const newPosition = Math.min(maxScroll, scrollPosition + 300);
      carouselRef.current.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  const handleManualScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  const toggleCardFlip = (id: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return {
    carouselRef,
    isPaused,
    setIsPaused,
    scrollPosition,
    maxScroll,
    flippedCards,
    handleScrollLeft,
    handleScrollRight,
    handleManualScroll,
    toggleCardFlip,
  };
};
