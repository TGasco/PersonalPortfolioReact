// App.js
// This file contains the main App component that renders the entire application.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/generic/App.css';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Section from './components/Section';
import textData from './data/textData';
import Footer from './components/Footer';
import useIntersectionObserver from './hooks/useIntersectionObserver';
import { getImageUris, fetchFromS3 } from './api/fetchData';


/**
 * The main App component.
 * @returns {JSX.Element} The main App component
 */
const App = () => {
  // ----------------- State and Ref Hooks -----------------

  // Use state hooks
  const [intersecting, setIntersecting] = useState({});
  const [isVisible, setIsVisible] = useState({});
  const [appData, setTextData] = useState(textData);
  
  
  // Use ref hooks
  const sections = Object.keys(textData.section);
  const sectionRefs = useRef(sections.reduce((refs, section) => {
    refs[section] = React.createRef();
    return refs;
  }, {}));
  const prevIntersectingRef = useRef(intersecting);
  
  // Use custom hook to observe section visibility
  useIntersectionObserver(sectionRefs, setIntersecting, 0.1);

  // ----------------- Custom Functions -----------------

  /**
   * Checks if all sections are visible.
   * @returns {boolean} True if all sections are visible, false otherwise
   */
  const allSectionsVisible = useCallback(() => {
    return sections.every(section => isVisible[section]);
  }, [isVisible, sections]);

  /**
   * Fetch project data from S3 bucket.
   * Fallback to local data if the request fails.
   * @returns {Promise<void>} A promise that resolves when the data is fetched
   */
  const fetchProjectData = async () => {
    const bucket = process.env.REACT_APP_AWS_BUCKET;
    const region = process.env.REACT_APP_AWS_REGION;
    const key = process.env.REACT_APP_AWS_DATA_KEY;
    try {
      const data = await fetchFromS3(bucket, region, key);
      if (!data) {
        console.error('Failed to fetch project data from S3');
        console.log('Falling back to local project data...');
        return;
      }
      
      // Prefetch image metadata
      const updatedData = await Promise.all(data.map(async project => {
        const urls = getImageUris(project.image);
        return {
            ...project,
            image: { ...urls } // Create a new object reference for image
        };
    }));
    textData.section.projects.props = updatedData;
    setTextData(textData); // Update projectData state
    } catch (error) {
      
      console.error('Network error:', error);
      console.log('Falling back to local project data...');
      return null;
    }
  };

  // ----------------- useEffect Hooks -----------------

  // Use effect hook to update section visibility
  useEffect(() => {
    if (allSectionsVisible()) {
      return; // Skip if all sections are visible
    }

    if (prevIntersectingRef.current !== intersecting) {
      // If all sections are visible, return early
        setIsVisible(prevState => ({
          ...prevState,
          ...intersecting
        }));
      prevIntersectingRef.current = intersecting;
    }
      
  }, [intersecting, sections]);


  // On load API requests
  // Request project data from the server on component mount
  useEffect(() => {
      fetchProjectData();
  }, []);

  // ----------------- Render -----------------

  /**
   * Render the sections based on the text data.
   * @returns {JSX.Element[]} An array of JSX elements representing the sections
   */
  const renderSections = useCallback(() => {
    return sections.map((section, idx) => {
      const sectionData = appData.section[section];
      
      if (!sectionData) return null; // Skip if section data is missing
      
      const { sectionId, title, Component, props } = sectionData;
      try {
        // Dynamically import the component
        const component = require(`./components/${Component}`).default;
  
        return (
          <Section key={idx} 
            id={sectionId}
            title={title}
            ref={sectionRefs.current[sectionId]}
            isVisible={isVisible[sectionId] || false}
            sectionId={sectionId}
          >
            {/* Handle array or single props */}
            {Array.isArray(props) ? props.map((prop, idx) => {
              return React.createElement(component, { ...prop, key: idx });
            }) : React.createElement(component, { ...props })}
          </Section>
        );
      } catch (error) {
        console.error(`Failed to render section ${sectionId}:`, error);
        return null; // Return null to prevent crashing if an error occurs
      }
    });
  }, [appData, isVisible]);


  return (
    <div className="App">
      <NavBar sections={sections} sectionRefs={sectionRefs} />
      <div className='main-body'>

        {/* Profile */}
        <Profile greeting={textData.profile.greeting}
        name={textData.profile.name}
        subtitle={textData.profile.subtitle}
        hook={textData.profile.description}
        socialIcons={textData.profile.socialIcons} />
        {/* Render the Sections */}
        {renderSections()}

        <Footer props={textData.footer}></Footer>
      </div>
    </div>
  );
}

// ----------------- Export -----------------
export default App;