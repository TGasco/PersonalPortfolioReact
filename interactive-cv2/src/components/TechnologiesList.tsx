// TechnologiesList.tsx
// This file contains the TechnologiesList component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";

// ----------------- Types -----------------
interface TechnologiesListProps {
    technologies: string[];
}

/**
 * The TechnologiesList component.
 * @param {TechnologiesListProps} props - The props for the TechnologiesList component
 * @returns {JSX.Element} The TechnologiesList component
 */
const TechnologiesList: React.FC<TechnologiesListProps> = ({ technologies }) => {
    // ----------------- Render -----------------
    return (
        <React.Fragment>
            <ul className="technologies-pill">
                {technologies.map((tech, idx) => (
                    <li key={idx} id={`${tech}-${idx}`} className="pill">
                        {tech}
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
};

// ----------------- Export -----------------
export default React.memo(TechnologiesList);