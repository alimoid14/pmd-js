import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';

function Project() {
    const {projectId} = useParams();
    const {getProjectById, project, inviteUserToProject} = useProjectStore();   
    const [email, setEmail] = React.useState('');

    useEffect(() => {
        console.log(projectId);
        getProjectById(projectId);
    }, [projectId, getProjectById]);

    const handleClick = async () => {
      console.log('inviting');
      try{
        await inviteUserToProject(projectId, email);
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <section className='w-full h-[calc(100vh-44px)]'>
    <div className='max-w-7xl mx-auto p-4 lg:px-6 text-white bg-linear-to-br from-cyan-700 via-cyan-600 to-cyan-700'>
      {project && (
        <div className='flex flex-col gap-4'>
          <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p> 
            <p>{project.deadline.split('T')[0]}</p>
            </div>
            <div className='flex flex-row w-full justify-between bg-white/40 rounded-full p-2'>
              <input type="search" placeholder='Email of target user' className='flex-1 outline-none' value={email} onChange={(e) => setEmail(e.target.value)}/>
              <button className='hover:cursor-pointer' onClick={handleClick}>Invite</button>
            </div>
        </div>
      )}
    </div>
    </section>
  )
}

export default Project
