// TechnologiesList.js
// This file contains the TechnologiesList component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";

/**
 * The TechnologiesList component.
 * @param {*} technologies - The technologies for the TechnologiesList component
 * @returns {JSX.Element} The TechnologiesList component
 */
const TechnologiesList = ({ technologies }) => {
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
}

// ----------------- Export -----------------
export default React.memo(TechnologiesList);