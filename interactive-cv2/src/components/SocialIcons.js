// SocialIcons.js
// This file contains the SocialIcons component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";

/**
 * The SocialIcons component.
 * @param {*} links - The links for the SocialIcons component
 * @param {string} links.url - The url for the SocialIcons component
 * @param {string} links.icon - The icon for the SocialIcons component
 * @param {boolean} isVisible - The isVisible for the SocialIcons component
 * @returns {JSX.Element} The SocialIcons component
 */
const SocialIcons = ({ links, isVisible }) => {

    // ----------------- Render -----------------
    return (
        <div className={`social-icons ${isVisible ? 'fade-in' : ''}`}>
            {links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                    <img src={require(`../assets/icons/${link.icon}.svg`)} alt={link.icon}
                    className="icon"
                    />
                </a>
            ))}
        </div>

    );
}

export default React.memo(SocialIcons);