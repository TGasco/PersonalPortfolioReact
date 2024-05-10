import React from "react";
import SocialIcons from "./SocialIcons";
import "../styles/components/Profile.css"

function Profile({ greeting, name, subtitle, hook }) {
    const socialIcons = [
        { url: "https://www.linkedin.com/in/thomas-gascoyne", icon: "fab fa-linkedin" },
        { url: "https://github.com/TGasco", icon: "fab fa-github" },
        { url: "mailto:email@thomasgascoyne.com", icon: "fas fa-envelope" }
    ]
    return (
        <div className="profile">
            <div className="profile-content">
                <p className="code greeting">{greeting}</p>
                <h1 className="title">{name}</h1>
                <h3 className="subtitle">{subtitle}</h3>
                <p className="hook">{hook}</p>
                <SocialIcons links={socialIcons} />
            </div>
        </div>
    );
}

export default Profile;