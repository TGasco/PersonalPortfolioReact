// Project.js
// This file contains the Project component that renders a project card.
// Author: Thomas Gascoyne


// ----------------- Imports -----------------
import React, { useEffect, useState, useRef } from 'react';
import '../styles/components/Project.css';
import TechnologiesList from './TechnologiesList';
import "../styles/components/TechnologiesList.css";
import { getLocalImagePath } from '../api/fetchData';
import Image from './Image';

/**
 * 
 * @param {*} props - The project data
 * @param {string} props.title - The title of the project
 * @param {string} props.description - The description of the project
 * @param {string} props.source - The source URL of the project
 * @param {Object} props.image - The image data for the project
 * @param {Array} props.technologies - The technologies used in the project
 * @param {boolean} props.featured - Whether the project is featured
 * @returns {JSX.Element} The Project component
 */
const Project = (props) => {
    // ----------------- State and Ref Hooks -----------------
    const [textPanelStyle, setTextPanelStyle] = useState({});
    const imageFetched = useRef(false); // Track if image has been fetched

    // Check User Agent for mobile devices
    // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // ----------------- Effects -----------------
    useEffect(() => {
        if (imageFetched.current) return; // Skip if the image has already been fetched
        
        if (props.image?.jpg?.small) {
            const uri = props.image.jpg.small;
            setTextPanelStyle({
                '--background-image': `url(${uri})`
            });
            imageFetched.current = true; // Mark the image as fetched
        } else {
            // Fallback logic in case image data is missing
            console.warn('No image data found for project:', props.title);
            // Set local image as background
            try {
                const image = getLocalImagePath(props.image, 'jpg', 'small');
                setTextPanelStyle({
                    '--background-image': `url(${image})`
                });
                imageFetched.current = true; // Mark the image as fetched
            } catch (error) {
                console.warn('Error loading local image:', error);
            }
        }
    }, [props.image]);

    // ----------------- Render -----------------
    return (
        <div className={"project "}>
            <div className={"project-content"}>
                <div className='project-img'>
                    <Image src={props.image} alt={props.title} link={props.source} />
                </div>
                <div className={"text-content"}>
                    <div>
                        {props.featured ? <p className='featured'>Featured</p> : null}
                        <a href={props.source} target="_blank" rel="noopener noreferrer" className='project-title'>
                            <h2 className="project-title">{props.title}</h2>
                        </a>
                    </div>
                    <div className="text-panel" style={textPanelStyle}>
                        <p>{props.description}</p>
                    </div>
                    <TechnologiesList technologies={props.technologies} />
                </div>
            </div>
        </div>
    );
}

// ----------------- Export -----------------
export default React.memo(Project);