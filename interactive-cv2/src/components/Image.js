import React from "react";

const Image = ({ src, alt, link, className="" }) => {
    return (
        <a href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`img-container ${className}`}
            >
            <img src={src} alt={alt}/>
        </a>
    );
}

export default Image;