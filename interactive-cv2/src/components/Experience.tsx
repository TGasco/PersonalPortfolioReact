// Experience.tsx
// This file contains the Experience component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useState, useEffect, useCallback } from 'react';
import "../styles/components/Experience.css";
import TechnologiesList from './TechnologiesList';
import "../styles/components/TechnologiesList.css";
import { calculateDateRange } from "../helper/dateToStr";

// Define the props interface for the Experience component
interface ExperienceProps {
    title: string;
    company: string;
    link: string;
    duration: {
        start: Date | string;
        end?: Date | string;
    };
    description: string | string[];
    technologies: string[];
}

/**
 * The Experience component.
 * @param {ExperienceProps} props - The props for the Experience component
 * @returns {JSX.Element} The Experience component
 */
const Experience: React.FC<ExperienceProps> = (props) => {
    // ----------------- State and Ref Hooks -----------------
    const [duration, setDuration] = useState<string>('Jan 24 - Jan 24 | 0yr 0mo');

    // ----------------- Custom Functions -----------------
    const fetchDuration = useCallback(async () => {
        const calculatedDuration = await calculateDateRange(props.duration.start, props.duration.end);
        setDuration(prevDuration => (prevDuration !== calculatedDuration ? calculatedDuration : prevDuration));
    }, [props.duration.start, props.duration.end]);

    // ----------------- useEffects -----------------
    useEffect(() => {
        fetchDuration();
    }, [fetchDuration]);

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