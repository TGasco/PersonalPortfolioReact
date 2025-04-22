// useIntersectionObserver.ts
// This file contains an improved custom hook to observe section visibility using the Intersection Observer API.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import 'intersection-observer'; // Polyfill for Intersection Observer API
import { useEffect, useState, useRef } from 'react';

export interface IntersectingState {
  [key: string]: boolean;
}

/**
 * A custom hook to observe section visibility using the Intersection Observer API.
 * @param sectionRefs - The refs for the sections to observe
 * @param setIntersectingSections - The function to set the intersecting sections
 * @param threshold - The threshold for intersection (default: 0.5)
 * @param rootMargin - The root margin for intersection (default: '0px')
 * @param returnAll - Whether to return all intersecting sections or just the first (default: true)
 * @returns The scroll direction
 */
const useIntersectionObserver = (
  sectionRefs: React.RefObject<Record<string, React.RefObject<HTMLElement | null>>>,
  setIntersectingSections: React.Dispatch<React.SetStateAction<IntersectingState>>,
  threshold: number | number[] = 0.5,
  rootMargin: string = '0px',
  returnAll: boolean = true
): string => {
  // ----------------- State Hooks -----------------
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState<number>(window.scrollY);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  // ----------------- Custom Functions -----------------
  /**
   * Throttle a function to prevent it from being called too frequently.
   * @param callback - The function to throttle
   * @param delay - The delay between function calls
   * @returns The throttled function
   */
  const throttle = (callback: (...args: any[]) => void, delay: number) => {
    return (...args: any[]) => {
      if (throttleTimeout.current) return;
      throttleTimeout.current = setTimeout(() => {
        callback(...args);
        throttleTimeout.current = null;
      }, delay);
    };
  };

  // ----------------- Effects -----------------

  // Use Effect to track the scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Use Effect to observe section visibility
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visibleSections = entries.filter((entry) => entry.isIntersecting);

      if (visibleSections.length > 0) {
        // Sort sections by visibility when scrolling down, or by position when scrolling up
        visibleSections.sort((a, b) => {
          if (scrollDirection === 'up') {
            return a.boundingClientRect.top - b.boundingClientRect.top; // Closest to top first when scrolling up
          } else {
            // Else closest to bottom first when scrolling down
            return b.boundingClientRect.bottom - a.boundingClientRect.bottom;
          }
        });

        const intersecting = visibleSections.reduce<Record<string, boolean>>((acc, entry) => {
          acc[entry.target.id] = entry.isIntersecting;
          return acc;
        }, {});

        if (returnAll) {
          setIntersectingSections(intersecting);
        } else {
          setIntersectingSections({ [visibleSections[0].target.id]: true });
        }
      }
    };

    // Throttle the observer callback for performance
    const throttledObserverCallback = throttle(observerCallback, 25); // Lower delay for quicker updates

    const observer = new IntersectionObserver(throttledObserverCallback, {
      threshold: threshold, // Multiple thresholds for finer tracking
      rootMargin: scrollDirection === 'down' ? `0px 0px ${rootMargin}` : `${rootMargin} 0px 0px`, // Bias for scrolling direction (top, right, bottom, left)
    });

    const sections = Object.values(sectionRefs.current || {}); // Extract values from the refs object
    sections.forEach((ref) => {
      const section = ref?.current; // Access the current DOM element
      if (section) observer.observe(section);
    });
    
    // Cleanup the observer when the component unmounts
    return () => {
      sections.forEach((ref) => {
        const section = ref?.current; // Access the current DOM element
        if (section) observer.unobserve(section);
      });
    };
  }, [sectionRefs, setIntersectingSections, scrollDirection, threshold, rootMargin, returnAll]);

  return scrollDirection;
};

// ----------------- Export -----------------
export default useIntersectionObserver;