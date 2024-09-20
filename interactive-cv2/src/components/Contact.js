import React from "react";
import "../styles/components/Contact.css";
function Contact({ text, email }) {
    return (
        <div className="contact">
            <h1 className="heading">Get in Touch</h1>
            <p>{text}</p>
            <a className="button" href={'mailto:' + email}>Say Hi! <span className="wave">👋</span></a>
        </div>
    );
}

export default Contact;