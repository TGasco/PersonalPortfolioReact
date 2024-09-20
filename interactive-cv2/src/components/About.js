import React from "react";
import "../styles/components/About.css"
import Image from './Image';
import TextBox from "./TextBox";
function About({ text, profileImg }) {
    return (
        <div className="about">
            <div className="about-content">
                <TextBox text={text} />
            </div>
            <div className="about-img">
                <Image src={profileImg} alt="Profile image" className="profile-img" />
            </div>
        </div>
    );
}

export default About;