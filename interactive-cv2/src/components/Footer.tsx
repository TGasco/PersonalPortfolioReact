// Footer.tsx
// This file contains the Footer component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import "../styles/components/Footer.css";

// Define the props interface for the Footer component
interface FooterProps {
    text: string;
    license: string;
    sourceUrl: string;
}

/**
 * The Footer component.
 * @returns {JSX.Element} The Footer component.
 */
const Footer: React.FC<FooterProps> = ({ text, license, sourceUrl }) => {
    // ----------------- Constants -----------------
    const date = new Date();
    const year = date.getFullYear();

    // ----------------- Render -----------------
    return (
        <footer className="footer">
            <p>{text}</p>
            <p>
                Operating under the {license} © {year}
            </p>
            <a href={sourceUrl} target="_blank" rel="noreferrer" className="highlight">
                <p>view source</p>
            </a>
        </footer>
    );
};

// ----------------- Export -----------------
export default React.memo(Footer);