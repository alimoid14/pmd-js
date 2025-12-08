import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';

function Project() {
    const {projectId} = useParams();
    const {getProjectById, project, inviteUserToProject} = useProjectStore();   
    const {user} = useAuthStore();
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
    <section className='w-full h-[calc(100vh-44px)] bg-linear-to-br from-cyan-700 via-cyan-600 to-cyan-700'>
    <div className='max-w-7xl h-full mx-auto p-4 lg:px-6 text-white'>
      {project && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-bold'><span className='text-amber-500'>Project:</span> {project.title}</h1>
          <div>
            
            <p>{project.description}</p> 
            <p>Deadline: {project.deadline.split('T')[0]}</p>
            </div>
            <div className='border-b pb-4 border-white'> 
            {project.owner._id === user._id && <div className='flex flex-row w-full justify-between bg-white/40 rounded-full p-2'>
              <input type="search" placeholder='Email of target user' className='flex-1 outline-none' value={email} onChange={(e) => setEmail(e.target.value)}/>
              <button className='hover:cursor-pointer' onClick={handleClick}>Invite</button>
            </div>}
            </div>

            <div>
              <h2 className='text-xl font-bold'>Tasks</h2>
              
            </div>
        </div>
      )}
    </div>
    </section>
  )
}

export default Project
