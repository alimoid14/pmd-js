import React, { useState } from 'react'
import Profile from '../components/homeComps/Profile'

function Home() {
  const [myProject, setMyProject] = useState(true);
  const [contributingTo, setContributingTo] = useState(false);
  const [create, setCreate] = useState(false);
  return (
    <section className='bg-gray-200 h-[calc(100vh-44px)]'>
    <section className='max-w-7xl mx-auto p-4 lg:px-6 flex flex-col gap-6'>
      <Profile />
      <div className='flex flex-row sm:flex-row gap-4'>
        <button className='px-4 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white' onClick={() => {
          setMyProject(true); 
          setContributingTo(false);
          setCreate(false);
        }}>My Projects</button>
        <button className='px-4 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white' onClick={() => {
          setMyProject(false); 
          setContributingTo(true);
          setCreate(false);
        }}>Contributing to</button>
        <button className='px-4 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white' onClick={() => {
          setMyProject(false); 
          setContributingTo(false);
          setCreate(true);
        }}>Create Project</button>
      </div>
      <div className='grid lg:grid-cols-3 gap-4'>
        <div className={`h-[50vh] bg-white p-4 ${myProject ? 'block' : 'hidden'} lg:block`}>My Projects</div>
        <div className={`h-[50vh] bg-white p-4 ${contributingTo ? 'block' : 'hidden'} lg:block`}>Contributing to</div>
        <div className={`h-[50vh] bg-white p-4 ${create ? 'block' : 'hidden'} lg:block`}>Creat project</div>
      </div>
      <div  className='bg-white p-4 h-[20vh]'>Previous Contributions</div>
    </section>
    </section>
  )
}

export default Home
