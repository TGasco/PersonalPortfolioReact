import React from "react";

function Experience({ title, company, duration, description }) {
    return (
        <div className="experience">
            <h3>
                <span>{title} </span>
                <span className="highlight">@ {company}</span>
            </h3>
            <p>{duration}</p>
            <p className="textBody">{description}</p>
        </div>
    );
}

export default Experience;