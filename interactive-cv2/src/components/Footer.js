// Footer.js
// This file contains the Footer component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import "../styles/components/Footer.css";

/**
 * The Footer component.
 * @param {*} props - The props for the Footer component
 * @param {string} props.text - The text for the Footer component
 * @param {string} props.license - The license type for the Footer component
 * @param {string} props.sourceUrl - The source URL for the Footer component
 * @returns {JSX.Element} The Footer component.
 */
const Footer = ({ props }) => {
    // ----------------- Constants -----------------
    const {text, license, sourceUrl} = props;
    const date = new Date();
    const year = date.getFullYear();

    // ----------------- Render -----------------
    return (
        <footer className="footer">
            <p>{text}</p>
            <p>
                Operating under the {license} © {year}
            </p>
            <a href={sourceUrl} target="_blank" rel="noreferrer"
            className="highlight">
                <p>view source</p>
            </a>
        </footer>
    );
}

// ----------------- Export -----------------
export default React.memo(Footer);