import React from "react";
import "../styles/components/Footer.css";
function Footer({ text }) {
    const date = new Date();
    const year = date.getFullYear();
    return (
        <footer className="footer">
            <p>{text}</p>
            <p>
                Operating under the MIT License © {year}
            </p>
            <a href="https://github.com/TGasco" target="_blank" rel="noreferrer"
            className="highlight">
                <p>view source</p>
            </a>
        </footer>
    );
}

export default Footer;