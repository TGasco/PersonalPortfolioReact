import React from "react";
import "../styles/components/Contact.css";
function Contact({ text, email }) {
    return (
        <div className="contact">
            <p>{text}</p>
            <a className="button" href={'mailto:' + email}>Say Hi!</a>
        </div>
    );
}

export default Contact;