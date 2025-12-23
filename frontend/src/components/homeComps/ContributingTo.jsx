import React from 'react'
import { Link } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';

function ContributingTo() {
  const {contributions} = useProjectStore();
  return (
    <div className='h-[50vh] bg-[#c7b198]/63 p-4 rounded-xl'>
      <h1>Contributing to</h1>
      <div className='flex flex-col gap-4 h-[90%] overflow-auto'>
        {contributions?.map((project) => (
          <div key={project._id} className='flex flex-col gap-2 p-4 bg-[#f0ece2]/50 rounded-2xl'>
            <Link to={`/projects/${project._id}`} className='font-bold text-black border-b border-cyan-700'>
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

export default ContributingTo
