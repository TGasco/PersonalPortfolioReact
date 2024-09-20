import React from "react";
import "../styles/components/Experience.css";
import { calculateDateRange } from "../helper/dateToStr";
function Experience({ jobsObj }) {
    const duration = calculateDateRange(jobsObj.duration.start, jobsObj.duration.end);
    return (
        <div className="experience">
            <h3>
                <span>{jobsObj.title} </span>
                <a href={jobsObj.link} target="_blank" rel="noreferrer"
                className="highlight">
                    <span>@ {jobsObj.company}</span>
                </a>
            </h3>
            <p className="code duration">{duration}</p>
            {Array.isArray(jobsObj.description) ? (
                    jobsObj.description.map((item, idx) => (
                        <div key={idx} className="textBody">
                            <span className="fa fa-play bullet"></span>
                            <span key={idx}>
                                {item}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>
                        {jobsObj.description}
                    </p>
                )}
            <div className="technologies-pill">
                {jobsObj.technologies.map((tech, idx) => {
                    return <p key={idx} id={`${tech}-${idx}`} className="pill">{tech}</p>
                })}
            </div>
        </div>
    );
}

export default Experience;