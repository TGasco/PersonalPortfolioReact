// Profile.tsx
// This file contains the Profile component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import SocialIcons from "./SocialIcons";
import "../styles/components/Profile.css";

interface ProfileProps {
    greeting: string;
    name: string;
    subtitle: string;
    hook: string;
    socialIcons: { url: string; icon: string }[];
}

/**
 * The Profile component.
 * @param {string} greeting - The greeting for the Profile component
 * @param {string} name - The name for the Profile component
 * @param {string} subtitle - The subtitle for the Profile component
 * @param {string} hook - The hook for the Profile component
 * @param {Array} socialIcons - The socialIcons for the Profile component
 * @returns {JSX.Element} The Profile component
 */
const Profile: React.FC<ProfileProps> = ({ greeting, name, subtitle, hook, socialIcons }) => {
    // ----------------- Render -----------------
    return (
        <div className="profile">
            <div className="profile-content">
                <p className="code greeting">{greeting}</p>
                <h1 className="title">{name}</h1>
                <h2 className="subtitle">{subtitle}</h2>
                <p className="hook">{hook}</p>
                <SocialIcons links={socialIcons} isVisible={true} />
            </div>
        </div>
    );
};

// ----------------- Export -----------------
export default React.memo(Profile);