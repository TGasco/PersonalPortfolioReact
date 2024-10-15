// Contact.js
// This file contains the Contact component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import "../styles/components/Contact.css";

/**
 * The Contact component.
 * @param {*} props - The props for the Contact component
 * @param {string} props.title - The title for the Contact component
 * @param {string} props.content - The content for the Contact component
 * @param {string} props.email - The email for the Contact component
 * @returns {JSX.Element} The Contact component
 */
const Contact = (props) => {
    const { title, content, email } = props;
    return (
        <div className="contact">
            <h1 className="heading">{title}</h1>
            <p>{content}</p>
            <a className="button" href={`mailto:${email}`}>Say Hi! <span className="wave">👋</span></a>
        </div>
    );
}

// ----------------- Export -----------------
export default React.memo(Contact);