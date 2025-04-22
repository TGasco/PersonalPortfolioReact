// TextBox.tsx
// This file contains the TextBox component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { JSX } from "react";

// ----------------- Types -----------------
interface Span {
    text: string;
    style?: string;
    link?: string;
}

type TextType = string | string[] | Span[][];

interface TextBoxProps {
    text: TextType;
    styling?: string;
}

/**
 * The TextBox component.
 * @param {TextBoxProps} props - The props for the TextBox component
 * @returns {JSX.Element} The TextBox component
 */
const TextBox: React.FC<TextBoxProps> = ({ text, styling = "" }) => {
    // ----------------- Custom Functions -----------------

    /**
     * Get the type of text and return the appropriate JSX.
     * @param {TextType} text - The text to render
     * @returns {JSX.Element | JSX.Element[]} The JSX element(s)
     */
    const getTextType = (text: TextType): JSX.Element | JSX.Element[] => {
        // 3 Cases:
        // 1. text is a string - return a single paragraph
        // 2. text is an array of strings - return multiple paragraphs, one for each string
        // 3. text is a (nested) array of objects - outer array is an array of paragraphs, inner array is an array of objects, used for styling text in a paragraph
        if (typeof text === "string") {
            return <p className={styling}>{text}</p>;
        } else if (Array.isArray(text)) {
            if (typeof text[0] === "string") {
                // text is an array of strings
                return (text as string[]).map((paragraph, index) => (
                    <p key={index} className={styling}>
                        {paragraph}
                    </p>
                ));
            } else {
                // text is a nested array of objects
                return (text as Span[][]).map((paragraph, index) => (
                    <p key={index} className={styling}>
                        {paragraph.map((span, spanIndex) => (
                            <span key={spanIndex} className={span.style || ""}>
                                {span.style?.includes("highlight") && span.link ? (
                                    <a href={span.link} target="_blank" rel="noreferrer">
                                        {span.text}
                                    </a>
                                ) : (
                                    span.text
                                )}
                            </span>
                        ))}
                    </p>
                ));
            }
        } else {
            return <p>{text}</p>;
        }
    };

    // ----------------- Render -----------------
    return <React.Fragment>{getTextType(text)}</React.Fragment>;
};

// ----------------- Export -----------------
export default React.memo(TextBox);