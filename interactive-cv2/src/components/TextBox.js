// TextBox.js
// This file contains the TextBox component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";

/**
 * The TextBox component.
 * @param {*} text - The text for the TextBox component
 * @param {string} styling - The styling for the TextBox component
 * @returns {JSX.Element} The TextBox component
 */
const TextBox = ({ text, styling="" }) => {

    // ----------------- Custom Functions -----------------

    /**
     * Get the type of text and return the appropriate JSX.
     * @param {*} text 
     * @returns {JSX.Element} The JSX element
     */
    const getTextType = (text) => {
        // 3 Cases:
        // 1. text is a string - return a single paragraph
        // 2. text is an array of strings - return multiple paragraphs, one for each string
        // 3. text is an (nested) array of objects - outer array is an array of paragraphs, inner array is an array of objects, used for styling text in a paragraph
        switch (typeof text) {
            case "string":
                return <p className={styling}>{text}</p>;
            case "object":
                // text is an array
                // Map over the outer array
                return text.map((paragraph, index) => {
                    // Map over the inner array
                    return (
                        <p key={index} className={styling}>
                            {paragraph.map((span, index) => {
                                // Provide empty string when span.style is undefined
                                span.style = span.style || "";
                                // If style is includes 'highlight', return an anchor tag
                                return <span key={index} className={span.style}>
                                    {span.style.includes("highlight") ? <a href={span.link} target="_blank" rel="noreferrer">{span.text}</a> : span.text}
                                </span>;
                            })}
                        </p>
                    );
                });
            default:
                return <p>{text}</p>;
        }
    }

    // ----------------- Render -----------------
    return (
        <React.Fragment>
            {getTextType(text)}
        </React.Fragment>
    );
}

// ----------------- Export -----------------
export default React.memo(TextBox);