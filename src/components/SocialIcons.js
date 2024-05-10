import React from "react";

function SocialIcons( { links } ) {
    return (
        <div className="social-icons">
            {links.map((link) => (
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <i className={"social-icon " + link.icon}></i>
                </a>
            ))}
        </div>
    );
}

export default SocialIcons;