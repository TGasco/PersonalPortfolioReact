// Experience.js
// This file contains the Experience component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useState, useEffect, useCallback } from 'react';
import "../styles/components/Experience.css";
import TechnologiesList from './TechnologiesList';
import "../styles/components/TechnologiesList.css";
import { calculateDateRange } from "../helper/dateToStr";

/**
 * The Experience component.
 * @param {*} props - The props for the Experience component
 * @param {string} props.title - The title for the Experience component
 * @param {string} props.company - The company for the Experience component
 * @param {string} props.link - The link for the Experience component
 * @param {string} props.duration - The duration for the Experience component
 * @param {string} props.description - The description for the Experience component
 * @param {string[]} props.technologies - The technologies for the Experience component
 * @returns {JSX.Element} The Experience component
 */
const Experience = (props) => {
    // ----------------- State and Ref Hooks -----------------
    const [duration, setDuration] = useState('Jan 24 - Jan 24 | 0yr 0mo');

    // ----------------- Custom Functions -----------------
    const fetchDuration = useCallback(async () => {
        const calculatedDuration = await calculateDateRange(props.duration.start, props.duration.end);
        setDuration(prevDuration => (prevDuration !== calculatedDuration ? calculatedDuration : prevDuration));
    }, [props.duration.start, props.duration.end]);

    // -----------------  useEffects -----------------
    useEffect(() => {
        fetchDuration();
    }, []);

    // ----------------- Render -----------------
    return (
        <div className="experience">
            <p className='experience-title'>
                <span>{props.title} </span>
                <a href={props.link} target="_blank" rel="noreferrer" className="highlight">
                    <span>@ {props.company}</span>
                </a>
            </p>
            <p className="code duration">{duration}</p>
            {Array.isArray(props.description) ? (
                props.description.map((item, idx) => (
                    <div key={idx} className="textBody">
                        <span>{item}</span>
                    </div>
                ))
            ) : (
                <p>{props.description}</p>
            )}

            <TechnologiesList technologies={props.technologies} />
        </div>
    );
};

// ----------------- Export -----------------
export default React.memo(Experience);