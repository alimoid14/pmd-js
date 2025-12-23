import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';

function Project() {
    const {projectId} = useParams();
    const {getProjectById, project, inviteUserToProject, addProjectTask, assignTaskToUser, unassignTaskFromUser} = useProjectStore();   
    const {user} = useAuthStore();
    const [email, setEmail] = React.useState('');
    const [taskName, setTaskName] = React.useState('');
    const [taskDescription, setTaskDescription] = React.useState('');
    const [taskDeadline, setTaskDeadline] = React.useState('');
    const [assignTo, setAssignTo] = React.useState('');
    const [taskId, setTaskId] = React.useState({});

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

    const addTask = async () => {
      try{
        await addProjectTask(projectId, {title: taskName, description: taskDescription, deadline: taskDeadline});
        await getProjectById(projectId);
        setTaskName('');
        setTaskDescription('');
        setTaskDeadline('');
      } catch (error) {
        console.log(error);
      }
    }

    const handleAssign = async () => {
      try {
        console.log(projectId, taskId, assignTo);
        await assignTaskToUser(projectId, taskId, assignTo);
        await getProjectById(projectId);
        setAssignTo('');
        setTaskId('');
        alert('Task assigned successfully');
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }

    const handleUnsassign = async (taskId, assignedToId) => {
      try {
        await unassignTaskFromUser(projectId, taskId, assignedToId);
        await getProjectById(projectId);
        setAssignTo('');
        setTaskId('');
        alert('Task unassigned successfully');
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
  return (
    <section className='w-full min-h-[calc(100vh-44px)] bg-teal-800'>
    <div className='max-w-7xl h-full mx-auto p-4 lg:px-6 text-white'>
      {project && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-bold'><span className='text-black'>Project:</span> {project.title}</h1>
          <div className='text-teal-200'>
            <p>Created by: <span className='text-white'>{project.owner.name}</span></p>
            <p>Description: <span className='text-white'>{project.description}</span></p> 
            <p>Deadline: <span className='text-white'>{project.deadline.split('T')[0]}</span></p>
            </div>
            <div className='border-b pb-4 border-white'> 
            {project.owner._id === user._id && <div className='flex flex-row w-full justify-between bg-white/40 rounded-full p-2'>
              <input type="search" placeholder='Email of target user' className='flex-1 outline-none' value={email} onChange={(e) => setEmail(e.target.value)}/>
              <button className='hover:cursor-pointer' onClick={handleClick}>Invite</button>
            </div>}
            </div>

            <div>
              
              <div>
              <h2 className='text-xl font-bold text-teal-200'>Members</h2>
              <div>
                {project.members.map((member) => (
                  <div key={member._id} className='flex flex-row gap-2'>
                    <p>{member.name}</p>
                  </div>
                ))}
              </div>
              </div>
              <div>
                <h2 className='text-xl font-bold text-teal-200'>Admins</h2>
                <div>
                  {project.admins.map((admin) => (
                    <div key={admin._id} className='flex flex-row gap-2'>
                      <p>{admin.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <h2 className='text-xl font-bold text-teal-200'>Tasks</h2>
                {project.owner._id === user._id && <div className='flex flex-col bg-gray-100/50 w-60 sm:w-96 mx-auto rounded-xl p-4 m-6'>
                  <input type="text" placeholder='Task title' className='flex-1 outline-none' value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                  <textarea placeholder='Task description' className='flex-1 outline-none' value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}></textarea>
                  <input type='date' className='flex-1 outline-none' value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)}/>
                  <button onClick={addTask} className='bg-cyan-600 px-4 font-bold rounded-full hover:cursor-pointer hover:bg-cyan-700 text-white'>Add task</button>
                </div>}
                
                <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4'>
                  {project.tasks.length > 0 ? project.tasks.map((task) => (
                    <div key={task._id} className='flex flex-col gap-2 bg-gray-100/30 rounded-xl p-4 text-teal-200'>
                      <p className='text-black font-bold'>{task.title}</p>
                      <p>Description: <span className='text-white font-bold'>{task.description}</span></p>
                      <p>Deadline: <span className='text-white font-bold'>{task.deadline.split('T')[0]}</span></p>
                      <p className={`${task.completed && "line-through"}`}>{project.owner._id === user._id && <input type='checkbox' checked={task.completed} className='my-auto'/>} Status: <span className='text-white font-bold'>{`${task.completed ? "Completed" : "Not completed"}`}</span></p>
                      <p className=''>Assigned To: {<span className='text-white font-bold'>{task.assignedTo[1]?.name}</span> || <span className='text-red-300 font-bold'>No user assigned</span>}</p>
                      
                      {project.owner._id === user._id && task.assignedTo.length === 1 && <div className='flex flex-col gap-2'>
                      <input type='text' className='outline-0 bg-black/50 rounded-full px-4' placeholder='user email' value={assignTo} onChange={(e) => {
                        setAssignTo(e.target.value);
                        setTaskId(task._id);
                      }}/>
                      <button onClick={handleAssign} className='bg-cyan-600 px-4 text-white rounded-full hover:cursor-pointer hover:bg-cyan-700'>Asign above user</button>
                      </div>}
                      {
                        project.owner._id === user._id && task.assignedTo.length === 2 && <button onClick={() => handleUnsassign(task._id, task.assignedTo[1]._id)} className='bg-red-600 px-4 text-white rounded-full hover:cursor-pointer hover:bg-red-700'>Unassign user</button>
                      }
                    </div>
                  )) : <p>No tasks</p>}
                </div>
              </div>
              
            </div>
        </div>
      )}
    </div>
    </section>
  )
}

export default Project
