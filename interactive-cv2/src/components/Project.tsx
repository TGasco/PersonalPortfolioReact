// Project.tsx
// This file contains the Project component that renders a project card.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useEffect, useState, useRef, CSSProperties } from 'react';
import '../styles/components/Project.css';
import TechnologiesList from './TechnologiesList';
import "../styles/components/TechnologiesList.css";
import { getLocalImagePath } from '../api/fetchData';
import Image from './Image';

interface ProjectProps {
    title: string;
    description: string;
    source: string;
    image: 
        | string 
        | {
            avif?: { small: string; medium: string; large: string };
            webp?: { small: string; medium: string; large: string };
            jpg?: { small: string; medium: string; large: string };
        };
    technologies: string[];
    featured: boolean;
}

/**
 * The Project component.
 * @param {ProjectProps} props - The project data
 * @returns {JSX.Element} The Project component
 */
const Project: React.FC<ProjectProps> = (props) => {
    // ----------------- State and Ref Hooks -----------------
    const [textPanelStyle, setTextPanelStyle] = useState<CSSProperties>({});
    const imageFetched = useRef<boolean>(false); // Track if image has been fetched

    // ----------------- Effects -----------------
    useEffect(() => {
        if (typeof props.image !== 'string' && props.image?.jpg?.small) {
            const uri = props.image.jpg.small;
            setTextPanelStyle({
                '--background-image': `url(${uri})`,
            } as React.CSSProperties);
            imageFetched.current = true; // Mark the image as fetched
        } else {
            // Fallback logic in case image data is missing
            console.warn('No image data found for project:', props.title);
            // Set local image as background
            try {
                const image = getLocalImagePath(props.image as string, 'jpg', 'small');
                if (!image) return;
                setTextPanelStyle({
                    '--background-image': `url(${image})`,
                } as React.CSSProperties);
                imageFetched.current = true; // Mark the image as fetched
            } catch (error) {
                console.warn('Error loading local image:', error);
            }
        }
    }, [props.image, props.title]);

    // ----------------- Render -----------------
    return (
        <div className="project">
            <div className="project-content">
                <div className="project-img">
                    <Image src={props.image} alt={props.title} link={props.source} className='' />
                </div>
                <div className="text-content">
                    <div>
                        {props.featured ? <p className="featured">Featured</p> : null}
                        <a href={props.source} target="_blank" rel="noopener noreferrer" className="project-title">
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
};

// ----------------- Export -----------------
export default React.memo(Project);