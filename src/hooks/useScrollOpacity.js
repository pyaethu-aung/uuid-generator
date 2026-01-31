import { useEffect, useState } from "react";

/**
 * Hook to track scroll opacity for background transitions.
 * Logic:
 * - If scrollY < 80: opacity = 0
 * - If scrollY > 500: opacity = 1
 * - Else: linear interpolation between 80 and 500
 */
export default function useScrollOpacity() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const min = 80;
          const max = 500;

          if (scrollY < min) {
            setOpacity(0);
          } else if (scrollY > max) {
            setOpacity(1);
          } else {
            const calculated = (scrollY - min) / (max - min);
            setOpacity(calculated);
          }
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return opacity;
}
