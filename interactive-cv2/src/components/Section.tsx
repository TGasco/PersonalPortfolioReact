// Section.tsx
// This file contains the Section component that renders a section of the page.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useEffect, forwardRef, useRef } from "react";
import "../styles/components/Section.css";

// ----------------- Types -----------------
interface SectionProps {
    title?: string;
    sectionId?: string;
    children?: React.ReactNode;
    isVisible?: boolean;
}

// ----------------- Component -----------------
const Section = forwardRef<HTMLElement, SectionProps>(function Section(
    { title = "", sectionId = "about", children, isVisible },
    ref) {
    // Use an internal ref if the parent doesn’t pass one
    const innerRef = useRef<HTMLElement>(null);
    const sectionRef = (ref as React.RefObject<HTMLElement>) || innerRef;
  
    // ----------------- Effects -----------------
    useEffect(() => {
      if (!isVisible || !sectionRef.current) return;
  
      // Grab all descendants
      const elems = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>(
            "*:not(.img-container *)"
            // "*"
          )
      );
      elems.forEach((el, idx) => {
        // Add class that runs the fade-in animation
        el.classList.add("stagger-fade");
        // Stagger by 100ms per item, base delay 200ms
        el.style.animationDelay = `${200 + idx * 40}ms`;
      });
    }, [isVisible]);
  
    // ----------------- Render -----------------
    return (
      <section id={sectionId} ref={sectionRef} className="section">
        {title && <h1 className="section-title">{title}</h1>}
        {children}
      </section>
    );
  });

// ----------------- Export -----------------
export default React.memo(Section);