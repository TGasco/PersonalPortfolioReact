// App.js
import React, { useState, useRef, useEffect } from 'react';
import './styles/generic/App.css';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import About from './components/About';
import Section from './components/Section';
import Experience from './components/Experience';
import Project from './components/Project';
import Contact from './components/Contact';
import textData from './data/textData';
import Footer from './components/Footer';
import useIntersectionObserver from './hooks/useIntersectionObserver';

function App() {
  // Retrieve sections by iterating through textData.section
  const sections = Object.keys(textData.section);
  const sectionRefs = useRef(sections.reduce((refs, section) => {
    refs[section] = React.createRef();
    return refs;
  }, {}));

  const [intersecting, setIntersecting] = useState({});
  const [projectData, setProjectData] = useState([]); // Initialize projectData with useState

  useIntersectionObserver(sectionRefs, setIntersecting);

  const server = textData.config.server.https ? 'https://'+textData.config.server.url : 'http://'+textData.config.server.url;
  const endpoints = textData.config.server.endpoints;

  const fetchProjectData = async () => {
    const uri = `${server}${endpoints.v1.get.projects}`;
    try {
      console.log('Fetching project data from the server...');
      const response = await fetch(uri);
      // Check if the response is ok, otherwise fallback to local data
      if (!response.ok) {
        console.error('Failed to fetch project data from the server:', response.statusText);
        console.log('Falling back to local project data...');
        setProjectData(textData.section.projects.projects); // Update projectData state
        return;
      }
      const data = await response.json();
      console.log('Project data:', data);
      setProjectData(data); // Update projectData state
    } catch (error) {
      
      console.error('Network error:', error);
      console.log('Falling back to local project data...');
      
      fetchLocalData();
    }
  };

  const fetchLocalData = () => {
    // Create a context for the images directory
    const imagesContext = require.context('./img', false, /\.(png|jpe?g|svg)$/);
    
    // Import images dynamically using the context
    textData.section.projects.projects.forEach(project => {
      try {
        project.image = imagesContext(`./${project.image}`);
      } catch (err) {
        console.error(`Image not found: ${project.image}`, err);
      }
    });
    
    setProjectData(textData.section.projects.projects); // Update projectData state
  };

  // On load API requests
  // Request project data from the server on component mount
  useEffect(() => {
    // Note: Replace `fetchProjectData()` with the following code to use local data (for static websites):
    // Alternatively, local data is used as a fallback if the server request fails, though this is not recommended for production.
    // fetchLocalData();

      fetchProjectData();
    }, []);


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

        {/* About */}
        <Section title={textData.section.about.title}
        id={textData.section.about.sectionId}
        isVisible={intersecting[textData.section.about.sectionId] || false}
        ref={sectionRefs.current[textData.section.about.sectionId]}
        sectionId={textData.section.about.sectionId}>
          <About text={textData.section.about.content}
          profileImg={require(`./img/${textData.section.about.image}`)}>
          </About>
        </Section>

        {/* Experience */}
        <Section title={textData.section.experience.title}
        id={textData.section.experience.sectionId}
        isVisible={intersecting[textData.section.experience.sectionId] || false}
        ref={sectionRefs.current[textData.section.experience.sectionId]}
        sectionId={textData.section.experience.sectionId}
        children={
          textData.section.experience.jobs.map((job, idx) => (
            <Experience
            key={idx}
            jobsObj={job}
            />
          ))
        }>
        </Section>

        {/* Projects */}
        <Section title={textData.section.projects.title}
        id={textData.section.projects.sectionId}
        isVisible={intersecting[textData.section.projects.sectionId] || false}
        ref={sectionRefs.current[textData.section.projects.sectionId]}
        sectionId={textData.section.projects.sectionId}
        children={
          projectData.map((project, idx) => (
            <Project
            key={idx}
            projectObj={project}
            pos={idx%2===0 ? 'left' : 'right'}
            />
          ))
        }
        >
        </Section>

        {/* Contact */}
        <Section
        id={textData.section.contact.sectionId}
        isVisible={intersecting[textData.section.contact.sectionId] || false}
        ref={sectionRefs.current[textData.section.contact.sectionId]}
        sectionId={textData.section.contact.sectionId}>
          <Contact
          text={textData.section.contact.content}
          email={textData.section.contact.email}></Contact>
        </Section>

        <Footer text={textData.footer}></Footer>
      </div>
    </div>
  );
}

export default App;