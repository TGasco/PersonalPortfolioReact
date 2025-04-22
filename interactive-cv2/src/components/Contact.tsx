// Contact.tsx
// This file contains the Contact component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import "../styles/components/Contact.css";

// Define the props interface for the Contact component
interface ContactProps {
    title: string;
    content: string;
    email: string;
}

/**
 * The Contact component.
 * @param {ContactProps} props - The props for the Contact component
 * @returns {JSX.Element} The Contact component
 */
const Contact: React.FC<ContactProps> = ({ title, content, email }) => {
    return (
        <div className="contact">
            <h1 className="heading">{title}</h1>
            <p>{content}</p>
            <a className="button" href={`mailto:${email}`}>Say Hi! <span className="wave">👋</span></a>
        </div>
    );
};

// ----------------- Export -----------------
export default React.memo(Contact);