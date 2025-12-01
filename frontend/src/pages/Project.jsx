import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';

function Project() {
    const {projectId} = useParams();
    const {getProjectById, project} = useProjectStore();   

    useEffect(() => {
        console.log(projectId);
        getProjectById(projectId);
    }, [projectId, getProjectById]);

    
  return (
    <section className='w-full h-[calc(100vh-44px)]'>
    <div className='max-w-7xl mx-auto p-4 lg:px-6 text-white bg-linear-to-br from-cyan-700 via-cyan-600 to-cyan-700'>
      {project && (
        <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <p>{project.deadline.split('T')[0]}</p>
        </div>
      )}
    </div>
    </section>
  )
}

export default Project
