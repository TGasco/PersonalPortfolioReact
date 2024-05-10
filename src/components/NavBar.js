import React, { useState, useEffect } from 'react';
import "../styles/components/NavBar.css";

function NavBar({ sections }) {
    const [shadow, setShadow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const showShadow = window.scrollY > 75;
            if (showShadow !== shadow) {
                console.log("Showing shadow");
                setShadow(showShadow);
            }
        };

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [shadow]);

    return (
        <nav className={`navbar ${shadow ? 'shadow' : ''}`}>
            <ul>
                {sections.map((section, idx) => (
                    <li key={section}>
                        <a className="code" href={"#" + section.toLowerCase()}>{section}</a>
                    </li>
                ))}
                <li className='button'>
                    <a className='code'>Resume</a>
                </li>
            </ul>
        </nav>
    );
}
export default NavBar;
