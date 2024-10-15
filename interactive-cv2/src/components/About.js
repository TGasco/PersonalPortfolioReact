// About.js
// This file contains the About component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import "../styles/components/About.css"
import Image from './Image';
import TextBox from "./TextBox";

/**
 * The About component.
 * @param {*} props - The props for the About component
 * @param {string} props.content - The content for the About component
 * @param {string} props.image - The image for the About component
 * @param {string} props.url - The url for the About component
 * @returns {JSX.Element} The About component
 */
const About = (props) => {
    const { content, image, url } = props;
    return (
        <div className="about">
            <div className="about-content">
                <TextBox text={content} />
            </div>
            <div className="about-img">
                <Image src={image} alt="Profile image" link={url} className="profile-img" localSrc={true} />
            </div>
        </div>
    );
}

// ----------------- Export -----------------
export default React.memo(About);