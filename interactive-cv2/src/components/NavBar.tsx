// NavBar.tsx
// This file contains the NavBar component that renders the navigation bar.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useState, useEffect, useCallback } from 'react';
import "../styles/components/NavBar.css";
import useIntersectionObserver, { IntersectingState } from '../hooks/useIntersectionObserver';

interface NavBarProps {
    sections: string[];
    sectionRefs: React.RefObject<Record<string, React.RefObject<HTMLElement | null>>>;
    links?: { [key: string]: string };
}

/**
 * The NavBar component. Renders the navigation bar.
 * @returns {JSX.Element} The NavBar component
 */
const NavBar: React.FC<NavBarProps> = ({ sections, sectionRefs, links }) => {
    // ----------------- State Hooks -----------------
    const [shadow, setShadow] = useState<boolean>(false);
    const [prevScrollPos, setPrevScrollPos] = useState<number>(window.pageYOffset);
    const [visible, setVisible] = useState<boolean>(true);
    const [visibleSections, setVisibleSections] = useState<number[]>([]);
    const [activeSection, setActiveSection] = useState<IntersectingState>({});

    // Use custom hook to observe section visibility
    useIntersectionObserver(sectionRefs, setActiveSection, [0.33], '-25%', false);

    // ----------------- Custom Functions -----------------

    /**
     * Handle scroll event to show/hide the navbar.
     * @returns {void}
     */
    const handleScroll = useCallback(() => {
        const currentScrollPos = window.pageYOffset;
        const isVisible = prevScrollPos > currentScrollPos;

        setPrevScrollPos(currentScrollPos);

        const scroll = window.scrollY > 150;
        if (scroll !== shadow) {
            setShadow(scroll);
        }

        if (scroll) {
            setVisible(isVisible);
        }
    }, [prevScrollPos, shadow]);

    // ----------------- Effects -----------------
    // Use Effect to fade in navbar items
    useEffect(() => {
        sections.forEach((_, idx) => {
            setTimeout(() => {
                setVisibleSections((prev) => [...prev, idx]);
            }, 100 * idx);
        });

        setTimeout(() => {
            setVisibleSections((prev) => [...prev, sections.length]);
        }, 100 * sections.length);
    }, [sections]);

    // Use Effect to handle scroll event
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // ----------------- Render -----------------
    return (
        <nav className={`navbar ${shadow ? 'shadow' : ''} ${visible ? '' : 'navbar-hidden'}`}>
            <ul className={`menu`}>
                {sections.map((section, idx) => (
                    <li
                        key={section}
                        className={`${visibleSections.includes(idx) ? 'visible' : ''}`}
                    >
                        <a
                            className={`code ${activeSection && activeSection[section] ? 'active' : ''}`}
                            href={"#" + section.toLowerCase()}
                        >
                            {section}
                        </a>
                    </li>
                ))}
                {links && Object.entries(links).map(([key, value], idx) => (
                    <li
                        key={key}
                        className={`resume-button button ${visibleSections.includes(sections.length + idx) ? 'visible' : ''}`}
                    >
                        <a
                            className="code"
                            href={value}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {key}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

// ----------------- Export -----------------
export default React.memo(NavBar);