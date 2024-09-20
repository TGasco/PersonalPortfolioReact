import React, { useEffect, useRef } from 'react';
import '../styles/components/Project.css'
import Image from './Image';

function Project({ projectObj, pos="" }) {
    const textPanelStyle = {
        '--background-image': `url(${projectObj.image})`
    };

    return (
        <div className={"project "}>
            <div className={"project-content"}>
                <div className='project-img'>
                    <Image src={projectObj.image} alt={projectObj.title}
                    link={projectObj.source}/>
                </div>
                <div className={"text-content " + pos}>
                    <div>
                        {projectObj.featured ? <p className='featured'>Featured</p> : null}
                        <a href={projectObj.source} target="_blank" rel="noopener noreferrer" className='project-title'>
                            <h2 className="project-title">{projectObj.title}</h2>
                        </a>
                    </div>
                    <div className="text-panel" style={textPanelStyle}>
                        <p>{projectObj.description}</p>
                    </div>
                    <div className={`technologies-pill ${pos}`}>
                        {projectObj.technologies.map((tech, idx) => {
                            return <p key={idx} id={`${tech}-${idx}`} className="pill">{tech}</p>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Project;