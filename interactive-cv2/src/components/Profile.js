// Profile.js
// This file contains the Profile component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import SocialIcons from "./SocialIcons";
import "../styles/components/Profile.css"


/**
 * The Profile component.
 * @param {*} greeting - The greeting for the Profile component
 * @param {*} name - The name for the Profile component
 * @param {*} subtitle - The subtitle for the Profile component
 * @param {*} hook - The hook for the Profile component
 * @param {*} socialIcons - The socialIcons for the Profile component
 * @returns {JSX.Element} The Profile component
 */
const Profile = ({ greeting, name, subtitle, hook, socialIcons }) => {
    // ----------------- State and Ref Hooks -----------------
    const [fadeIn, setFadeIn] = React.useState([]);

    // ----------------- useEffect Hooks -----------------
    // Use Effect to fade in each profile element
    React.useEffect(() => {
        const profileElements = document.querySelectorAll(".profile-content > *");
        profileElements.forEach((element, idx) => {
            setTimeout(() => {
                setFadeIn(prevState => [...prevState, idx]);
            }, 1000 + (100 * idx));
        });
    }, []);

    // ----------------- Render -----------------
    return (
        <div className={`profile`}>
            <div className="profile-content">
                <p className={`code greeting ${fadeIn.includes(0) ? "fade-in" : ""}`}>{greeting}</p>
                <h1 className={`title ${fadeIn.includes(1) ? "fade-in" : ""}`}>{name}</h1>
                <h2 className={`subtitle ${fadeIn.includes(2) ? "fade-in" : ""}`}>{subtitle}</h2>
                <p className={`hook ${fadeIn.includes(3) ? "fade-in" : ""}`}>{hook}</p>
                <SocialIcons links={socialIcons} isVisible={fadeIn.includes(4)} />
            </div>
        </div>
    );
}

// ----------------- Export -----------------
export default React.memo(Profile);