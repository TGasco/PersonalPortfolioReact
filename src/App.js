import './styles/generic/App.css';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import About from './components/About';
import Section from './components/Section';
import Experience from './components/Experience';
import Project from './components/Project';
import Contact from './components/Contact';
import textData from './data/textData';
import profileImg from './img/profilePic.jpeg';
function App() {
  return (
    <div className="App">
      <NavBar sections={textData.navbar.sections} />
      <Profile greeting={textData.profile.greeting}
      name={textData.profile.name}
      subtitle={textData.profile.subtitle}
      hook={textData.profile.description} />
      <Section title={textData.section.about.title}>
        <About text={textData.section.about.content}
        profileImg={profileImg}>
        </About>
      </Section>
      <Section title={textData.section.experience.title}
      children={
        textData.section.experience.jobs.map((job, index) => (
          <Experience
          key={index}
          title={job.title}
          company={job.company}
          duration={job.duration}
          description={job.description}
          />
        ))
      }>
      </Section>
      <Section title={textData.section.projects.title}
      children={
        textData.section.projects.projects.map((project, index) => (
          <Project
          key={index}
          title={project.title}
          description={project.description}
          technologies={project.technologies}
          />
        ))
      }
      >
      </Section>
      <Section title={textData.section.contact.title}>
        <Contact
        text={textData.section.contact.content}
        email={textData.section.contact.email}></Contact>
      </Section>
    </div>
  );
}

export default App;
