import React from 'react'
import { useProjectStore } from '../../store/projectStore'
import { Link } from 'react-router-dom';
function MyProjects() {
    const {projects} = useProjectStore();
    
  return (
    <div className='h-[50vh] bg-white p-4 '>
      <h1>My Projects</h1>
      <div className='flex flex-col gap-4 h-[90%] overflow-auto'>
        {projects?.map((project) => (
          <div key={project._id} className='flex flex-col gap-2 p-4 bg-gray-100 rounded-2xl'>
            <Link to={`/projects/${project._id}`} className='font-bold text-cyan-500 border-b border-cyan-700'>
              {project.title}
            </Link>
            <p>{project.description}</p>
            <p>{project.deadline.split('T')[0]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyProjects
