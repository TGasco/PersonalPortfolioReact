import React from "react";
import "../styles/components/Section.css";

function Section({ title, children }) {
    return (
        <section id={title.toLowerCase()} className="section">
            <h1 className="section-title">{title}</h1>
            {children}
        </section>
    );
}

export default Section;