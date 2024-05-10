import React from "react";

function Project({ title, description, technologies }) {
    return (
        <React.Fragment>
            <h2>{title}</h2>
            <p>{description}</p>
            <p>{technologies}</p>
        </React.Fragment>
    );
}

export default Project;