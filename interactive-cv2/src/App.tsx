// App.tsx
// This file contains the main App component that renders the entire application.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useState, useRef, useEffect, useCallback, JSX } from 'react';
import './styles/generic/App.css';
import NavBar from './components/NavBar';
import DefaultComponent from './components/DefaultComponent';
import Section from './components/Section';
import textData from './data/textData.json';
import useIntersectionObserver from './hooks/useIntersectionObserver';
import { getImageUris, fetchFromS3 } from './api/fetchData';
// ----------------- Types -----------------

interface IntersectingState {
  [key: string]: boolean;
}

// ----------------- Main Component -----------------
const App: React.FC = () => {
  // ----------------- State and Ref Hooks -----------------

  // Use state hooks
  const [intersecting, setIntersecting] = useState<IntersectingState>({});
  const [isVisible, setIsVisible] = useState<IntersectingState>({});
  const [appData, setTextData] = useState<any>(textData); // Initialize with local data
  const [pdfUri, setPdfUri] = useState<string>('');

  // Use ref hooks
  const sections = Object.keys(textData.section) as Array<keyof typeof textData.section>;
  // Navbar sections are sections which contain the property navbar: true
  const navbarSections = sections.filter(
    (section) => textData.section[section].navbar
  );
  const sectionRefs = useRef(
    sections.reduce((refs, section) => {
      refs[section] = React.createRef<HTMLElement>();
      return refs;
    }, {} as Record<string, React.RefObject<HTMLElement | null>>)
  );
  const prevIntersectingRef = useRef<IntersectingState>(intersecting);

  // Use custom hook to observe section visibility
  useIntersectionObserver(sectionRefs, setIntersecting, 0.1);

  // ----------------- Constants -----------------
  const bucket = process.env.REACT_APP_AWS_BUCKET || '';
  const region = process.env.REACT_APP_AWS_REGION || '';
  const key = process.env.REACT_APP_AWS_RESUME_KEY || '';

  // Local resume PDF path - get last modified file from assets/resume/
  const localResumePath = process.env.REACT_APP_LOCAL_RESUME_PATH || '';

  // ----------------- Custom Functions -----------------

  /**
   * Checks if all sections are visible.
   * @returns {boolean} True if all sections are visible, false otherwise
   */
  const allSectionsVisible = useCallback((): boolean => {
    return sections.every((section) => isVisible[section]);
  }, [isVisible, sections]);

  /**
   * Fetch project data from S3 bucket.
   * Fallback to local data if the request fails.
   * @returns {Promise<void>} A promise that resolves when the data is fetched
   */
  const fetchProjectData = async (): Promise<void> => {
    const bucket = process.env.REACT_APP_AWS_BUCKET!;
    const region = process.env.REACT_APP_AWS_REGION!;
    const key = process.env.REACT_APP_AWS_DATA_KEY!;
    try {
      const data = await fetchFromS3(bucket, region, key);
      if (!data) {
        console.error('Failed to fetch project data from S3');
        console.log('Falling back to local project data...');
        return;
      }

      // Prefetch image metadata
      const updatedData = await Promise.all(
        data.map(async (project: any) => {
          const urls = getImageUris(project.image);
          return {
            ...project,
            image: { ...urls }, // Create a new object reference for image
          };
        })
      );
      textData.section.projects.props = updatedData;
      setTextData(textData); // Update projectData state
    } catch (error) {
      console.error('Network error:', error);
      console.log('Falling back to local project data...');
    }
  };

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
              const localPdf = require(`./${localResumePath}`);
              setPdfUri(localPdf);
          } catch (error) {
              console.error('Failed to load local PDF:', error);
          }
      }
  }, [bucket, region, key, localResumePath]);

  // ----------------- useEffect Hooks -----------------

  // Use effect hook to update section visibility
  useEffect(() => {
    if (allSectionsVisible()) {
      return; // Skip if all sections are visible
    }

    if (prevIntersectingRef.current !== intersecting) {
      setIsVisible((prevState) => ({
        ...prevState,
        ...intersecting,
      }));
      prevIntersectingRef.current = intersecting;
    }
  }, [intersecting, sections, allSectionsVisible]);

  // On load API requests
  // Request project data from the server on component mount
  useEffect(() => {
    fetchProjectData();
    fetchPdfUri();
  }, []);

  // ----------------- Render -----------------

  /**
   * Render the sections based on the text data.
   * @returns {JSX.Element[]} An array of JSX elements representing the sections
   */
  const renderSections = useCallback((): (JSX.Element | null)[] => {
    return sections.map((section, idx) => {
      const sectionData = appData.section[section];

      if (!sectionData) return null; // Skip if section data is missing

      const { sectionId, title, Component, props } = sectionData;
      try {
        // Dynamically import the component
        let component: React.FC<any>;
        try {
          component = require(`./components/${Component}`).default;
        } catch (error) {
          console.error(`Component "${Component}" not found. Falling back to DefaultComponent.`);
          component = DefaultComponent;
        }

        return (
          <Section
            key={idx}
            title={title}
            ref={sectionRefs.current[sectionId]}
            isVisible={isVisible[sectionId] || false}
            sectionId={sectionId}
          >
            {/* Handle array or single props */}
            {Array.isArray(props)
              ? props.map((prop, idx) => {
                  return React.createElement(component, { ...prop, key: idx });
                })
              : React.createElement(component, { ...props })}
          </Section>
        );
      } catch (error) {
        console.error(`Failed to render section ${sectionId}:`, error);
        return null; // Return null to prevent crashing if an error occurs
      }
    });
  }, [appData, isVisible, sections]);

  return (
    <div className="App">
      <NavBar sections={navbarSections} sectionRefs={sectionRefs} links={{'Resume': pdfUri}} /> 
      <div className="main-body">
        {/* Render the Sections */}
        {renderSections()}
      </div>
    </div>
  );
};

// ----------------- Export -----------------
export default App;