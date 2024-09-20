import React, { useState, useEffect } from 'react';
import "../styles/components/NavBar.css";
import ResumePDF from "../assets/Thomas-Gascoyne-CV-rev2024-1.pdf"

function NavBar({ sections, sectionRefs }) {
    const [shadow, setShadow] = useState(false);
    const [activeSection, setActiveSection] = useState(sections[0]);
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);
    const [visibleSections, setVisibleSections] = useState([]);

    // Fade-in effect for navbar items
    useEffect(() => {
        // Add resume to sections
        sections.forEach((section, idx) => {
            setTimeout(() => {
                setVisibleSections((prev) => [...prev, idx]);
            }, 100 * idx);
        });

        // Set timeout for resume
        setTimeout(() => {
            setVisibleSections((prev) => [...prev, sections.length]);
        }, 100 * sections.length);
    }, [sections]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const visible = prevScrollPos > currentScrollPos;

            setPrevScrollPos(currentScrollPos);
            // setVisible(visible);

            const scroll = window.scrollY > 150;
            if (scroll !== shadow) {
                setShadow(scroll);
            }

            if (scroll) {
                setVisible(visible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos, visible, shadow]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        Object.values(sectionRefs.current).forEach(ref => {
            if (ref.current instanceof Element) {
                observer.observe(ref.current);
            }
        });

        return () => {
            Object.values(sectionRefs.current).forEach(ref => {
                if (ref.current instanceof Element) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);


    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <nav className={`navbar ${shadow ? 'shadow' : ''} ${visible ? '' : 'navbar-hidden'}`}>
            <ul className={`menu ${showMenu ? 'show' : ''}`}>
                {sections.map((section, idx) => (
                    <li key={section}
                    className={`${visibleSections.includes(idx) ? 'visible' : ''}`}>
                        <a className={`code ${section === activeSection ? 'active' : ''}`} href={"#" + section.toLowerCase()}>{section}</a>
                    </li>
                ))}
                <li className={`button ${visibleSections.includes(sections.length) ? 'visible' : ''}`}>
                    <a className='code'
                        href={ResumePDF}
                        target='_blank'
                        rel='noreferrer'
                    >Resume</a>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;