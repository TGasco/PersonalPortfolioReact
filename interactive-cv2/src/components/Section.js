import React from "react";
import "../styles/components/Section.css";

const Section = React.forwardRef(({ title="", sectionId="about", children, isVisible }, ref) => {

    // Use Effect to fade in each section element when it is visible
    React.useEffect(() => {
        if (isVisible) {
            const sectionElements = document.querySelectorAll(`#${sectionId} > *`);
            // console.log(sectionElements);
            sectionElements.forEach((element, idx) => {
                setTimeout(() => {
                    element.classList.add("fade-in");
                }, 250 + (100 * idx));
            });
        }
    }, [isVisible, sectionId]);

    return (
        <section id={sectionId} ref={ref} className={`section ${isVisible ? 'fade-in' : ''}`}>
            {title !== "" && <h1 className={`section-title`}>{title}</h1>}
            {children}
        </section>
    );
});

export default Section;