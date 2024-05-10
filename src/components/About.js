import React from "react";
import "../styles/components/About.css"

function About({ text, profileImg }) {
    return (
        <div className="about">
            <p>
                {text}
            </p>
            <img src={profileImg} alt="Profile Image"
            className="profile-img" />
        </div>
    );
}

export default About;