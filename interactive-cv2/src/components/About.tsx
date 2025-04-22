// About.tsx
// This file contains the About component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React from "react";
import "../styles/components/About.css";
import Image from "./Image";
import TextBox from "./TextBox";

// Define the props interface for the About component
interface AboutProps {
    content: string;
    image: string;
    url: string;
}

/**
 * The About component.
 * @param {AboutProps} props - The props for the About component
 * @returns {JSX.Element} The About component
 */
const About: React.FC<AboutProps> = ({ content, image, url }) => {
    return (
        <div className="about">
            <div className="about-content">
                <TextBox text={content} />
            </div>
            <div className="about-img">
                <Image
                    src={image}
                    alt="Profile image"
                    link={url}
                    className="about-img"
                    localSrc={true}
                />
            </div>
        </div>
    );
};

// ----------------- Export -----------------
export default React.memo(About);