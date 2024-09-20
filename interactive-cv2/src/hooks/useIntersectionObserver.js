// hooks/useIntersectionObserver.js
import { useEffect } from 'react';

const useIntersectionObserver = (sectionRefs, setIntersectingSections) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIntersectingSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = Object.values(sectionRefs.current);
    sections.forEach((section) => {
      if (section.current) {
        observer.observe(section.current);
      }
    });

    return () => {
      if (sections.length) {
        sections.forEach((section) => {
          if (section.current) {
            observer.unobserve(section.current);
          }
        });
      }
    };
  }, [sectionRefs, setIntersectingSections]);
};

export default useIntersectionObserver;