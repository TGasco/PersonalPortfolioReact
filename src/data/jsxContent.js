import React from "react";

// Stores Dynamic JSX content as an object

const jsxContent = {
    Experience: (title, company, duration, description) => (
        <div>
            <h2>{title}</h2>
            <h3>{company}</h3>
            <p>{duration}</p>
            <p>{description}</p>
        </div>
    ),
};

export default jsxContent;