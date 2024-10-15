// Section.js
// This file contains the Section component that renders a section of the page.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import "../styles/components/Section.css";

/**
 * The Section component.
 * @param {string} title - The title of the section (default: "")
 * @param {string} sectionId - The ID of the section (default: "about")
 * @param {React.ReactNode} children - The children of the section
 * @param {boolean} isVisible - Whether the section is visible (default: false)
 * @param {React.Ref} ref - The ref object for the section
 * @returns {JSX.Element} The Section component
 */
const Section = React.forwardRef(({ title="", sectionId="about", children, isVisible }, ref) => {

    // ----------------- Effects -----------------
    // Use Effect to fade in each section element when it is visible
    React.useEffect(() => {
        if (isVisible) {
            const sectionElements = document.querySelectorAll(`#${sectionId} > *`);
            // console.log(sectionElements);
            sectionElements.forEach((element, idx) => {
                setTimeout(() => {
                    window.requestAnimationFrame(() => {
                        element.classList.add("fade-in");
                    });
                }, 250 + (100 * idx));
            });
        }
    }, [isVisible, sectionId]);

    // ----------------- Render -----------------
    return (
        <section id={sectionId} ref={ref} className={`section ${isVisible ? 'fade-in' : ''}`}>
            {title !== "" && <h1 className={`section-title`}>{title}</h1>}
            {children}
        </section>
    );
});

// ----------------- Export -----------------
export default React.memo(Section);