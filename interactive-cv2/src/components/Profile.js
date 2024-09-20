import React from "react";
import SocialIcons from "./SocialIcons";
import "../styles/components/Profile.css"

function Profile({ greeting, name, subtitle, hook, socialIcons }) {
    const [fadeIn, setFadeIn] = React.useState([]);

    // Use Effect to fade in each profile element
    React.useEffect(() => {
        const profileElements = document.querySelectorAll(".profile-content > *");
        profileElements.forEach((element, idx) => {
            setTimeout(() => {
                setFadeIn(prevState => [...prevState, idx]);
            }, 1000 + (100 * idx));
        });
    }, []);

    return (
        <div className={`profile`}>
            <div className="profile-content">
                <p className={`code greeting ${fadeIn.includes(0) ? "fade-in" : ""}`}>{greeting}</p>
                <h1 className={`title ${fadeIn.includes(1) ? "fade-in" : ""}`}>{name}</h1>
                <h3 className={`subtitle ${fadeIn.includes(2) ? "fade-in" : ""}`}>{subtitle}</h3>
                <p className={`hook ${fadeIn.includes(3) ? "fade-in" : ""}`}>{hook}</p>
                <SocialIcons links={socialIcons} isVisible={fadeIn.includes(4)} />
            </div>
        </div>
    );
}

export default Profile;