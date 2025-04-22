// SocialIcons.tsx
// This file contains the SocialIcons component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";

// ----------------- Types -----------------
interface SocialLink {
    url: string;
    icon: string;
}

interface SocialIconsProps {
    links: SocialLink[];
    isVisible: boolean;
}

/**
 * The SocialIcons component.
 * @param {SocialIconsProps} props - The props for the SocialIcons component
 * @returns {JSX.Element} The SocialIcons component
 */
const SocialIcons: React.FC<SocialIconsProps> = ({ links, isVisible }) => {
    // ----------------- Render -----------------
    return (
        <div className={`social-icons ${isVisible ? 'fade-in' : ''}`}>
            {links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                    <img
                        src={require(`../assets/icons/${link.icon}.svg`)}
                        alt={link.icon}
                        className="icon"
                    />
                </a>
            ))}
        </div>
    );
};

export default React.memo(SocialIcons);