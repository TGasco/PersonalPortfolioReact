import React from "react";

function SocialIcons( { links, isVisible } ) {
    return (
        <div className={`social-icons ${isVisible ? 'fade-in' : ''}`}>
            {links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                    <i className={`social-icon ${link.icon}`}></i>
                </a>
            ))}
        </div>
    );
}

export default SocialIcons;