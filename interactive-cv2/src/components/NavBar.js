// NavBar.js
// This file contains the NavBar component that renders the navigation bar.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useState, useEffect, useCallback } from 'react';
import "../styles/components/NavBar.css";
import { fetchFromS3 } from '../api/fetchData';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

/**
 * The NavBar component. Renders the navigation bar.
 * @param {Array} sections - The sections of the page
 * @param {Array} sectionRefs - The refs for the sections
 * @returns {JSX.Element} The NavBar component
 */
const NavBar = ({ sections, sectionRefs }) => {
    // ----------------- State Hooks -----------------
    const [shadow, setShadow] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);
    const [visibleSections, setVisibleSections] = useState([]);
    const [activeSection, setActiveSection] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [pdfUri, setPdfUri] = useState(null);

    // Use custom hook to observe section visibility
    useIntersectionObserver(sectionRefs, setActiveSection, [0.33], '-25%', false);


    // ----------------- Constants -----------------
    const bucket = process.env.REACT_APP_AWS_BUCKET;
    const region = process.env.REACT_APP_AWS_REGION;
    const key = process.env.REACT_APP_AWS_RESUME_KEY;

    // ----------------- Custom Functions -----------------

    /**
     * Fetch the PDF URI from S3 or fallback to local PDF.
     * @returns {Promise<void>} A promise that resolves when the PDF URI is fetched
     * @throws {Error} An error if the PDF URI cannot be fetched or loaded locally
     */
    const fetchPdfUri = useCallback(async () => {
        try {
            const resumeBlob = await fetchFromS3(bucket, region, key);
            setPdfUri(URL.createObjectURL(resumeBlob));
        } catch (error) {
            console.warn('Failed to fetch PDF from S3:', error);
            // Fallback to local PDF (if available)
            try {
                const localPdf = require(`../assets/Thomas-Gascoyne-CV-rev2024-2.pdf`);
                setPdfUri(localPdf);
            } catch (error) {
                console.error('Failed to load local PDF:', error);
            }
        }
    }, [bucket, region, key]);

    /**
     * Handle scroll event to show/hide the navbar.
     * @returns {void}
     */
    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        const visible = prevScrollPos > currentScrollPos;

        setPrevScrollPos(currentScrollPos);
        
        const scroll = window.scrollY > 150;
        if (scroll !== shadow) {
            setShadow(scroll);
        }
        
        if (scroll) {
            setVisible(visible);
        }
    };

    // ----------------- Effects -----------------

    // Use Effect to fetch the PDF URI
    useEffect(() => {
        fetchPdfUri();
    }, []);

    // Use Effect to fade in navbar items
    useEffect(() => {
        sections.forEach((section, idx) => {
            setTimeout(() => {
                setVisibleSections((prev) => [...prev, idx]);
            }, 100 * idx);
        });
    
        setTimeout(() => {
            setVisibleSections((prev) => [...prev, sections.length]);
        }, 100 * sections.length);
    }, []); // Empty dependency array ensures this runs only once



    // Use Effect to handle scroll event
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    // ----------------- Render -----------------
    return (
        <nav className={`navbar ${shadow ? 'shadow' : ''} ${visible ? '' : 'navbar-hidden'}`}>
            <ul className={`menu ${showMenu ? 'show' : ''}`}>
                {sections.map((section, idx) => (
                    <li key={section}
                        className={`${visibleSections.includes(idx) ? 'visible' : ''}`}>
                        {/* <a className={`code ${section === activeSection?.first ? 'active' : ''}`} href={"#" + section.toLowerCase()}>{section}</a> */}
                        <a className={`code ${section === activeSection ? 'active' : ''}`} href={"#" + section.toLowerCase()}>{section}</a>
                    </li>
                ))}
                <li className={`resume-button button ${visibleSections.includes(sections.length) ? 'visible' : ''}`}>
                    <a className='code'
                        href={pdfUri || 'https://thomasgascoyne.com'}
                        target='_blank'
                        rel='noreferrer'
                    >Resume</a>
                </li>
            </ul>
        </nav>
    );
}

// ----------------- Export -----------------
export default React.memo(NavBar);