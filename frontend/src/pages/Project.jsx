import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { useAuthStore } from "../store/authStore";

function Project() {
  const { projectId } = useParams();
  const {
    getProjectById,
    project,
    inviteUserToProject,
    addProjectTask,
    assignTaskToUser,
    unassignTaskFromUser,
    removeFromProject,
  } = useProjectStore();
  const { user } = useAuthStore();
  const [email, setEmail] = React.useState("");
  const [taskName, setTaskName] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");
  const [taskDeadline, setTaskDeadline] = React.useState("");
  const [assignTo, setAssignTo] = React.useState("");
  const [taskId, setTaskId] = React.useState({});

  useEffect(() => {
    console.log(projectId);
    getProjectById(projectId);
  }, [projectId, getProjectById]);

  const handleClick = async () => {
    console.log("inviting");
    try {
      await inviteUserToProject(projectId, email);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const addTask = async () => {
    try {
      await addProjectTask(projectId, {
        title: taskName,
        description: taskDescription,
        deadline: taskDeadline,
      });
      await getProjectById(projectId);
      setTaskName("");
      setTaskDescription("");
      setTaskDeadline("");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleAssign = async () => {
    try {
      console.log(projectId, taskId, assignTo);
      await assignTaskToUser(projectId, taskId, assignTo);
      await getProjectById(projectId);
      setAssignTo("");
      setTaskId("");
      alert("Task assigned successfully");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleUnsassign = async (taskId, assignedToId) => {
    try {
      await unassignTaskFromUser(projectId, taskId, assignedToId);
      await getProjectById(projectId);
      setAssignTo("");
      setTaskId("");
      alert("Task unassigned successfully");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleRemove = async (email) => {
    try {
      await removeFromProject(projectId, email);
      await getProjectById(projectId);
      alert("User removed successfully");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
    <section className="w-full min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="max-w-7xl h-full mx-auto p-4 lg:px-6 text-slate-900">
        {project && (
          <div className="flex flex-col gap-4 mt-2">
            <h1 className="text-2xl font-bold">
              <span className="text-slate-500">Project:</span> {project.title}
            </h1>
            <div className="text-slate-500">
              <p>
                Created by:{" "}
                <span className="text-slate-900">{project.owner.name}</span>
              </p>
              <p>
                Description:{" "}
                <span className="text-slate-900">{project.description}</span>
              </p>
              <p>
                Deadline:{" "}
                <span className="text-slate-900">
                  {project.deadline.split("T")[0]}
                </span>
              </p>
            </div>
            <div className="border-b pb-4">
              {project.owner._id === user._id && (
                <div className="flex flex-row w-full justify-between bg-white shadow-sm border-slate-200 rounded-full p-2">
                  <input
                    type="search"
                    placeholder="Email of target user"
                    className="flex-1 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    className="hover:cursor-pointer"
                    onClick={handleClick}
                  >
                    Invite
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <h2 className="text-xl font-bold">Members</h2>
                <div className="w-full flex flex-row gap-4 overflow-x-auto my-4">
                  {project.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex flex-col gap-2 w-80 shrink-0 bg-white border-slate-200 shadow-sm p-2 rounded-xl text-slate-500"
                    >
                      <p>{member.name}</p>
                      <p>{member.email}</p>
                      {project.owner._id === user._id &&
                        project.owner._id !== member._id && (
                          <button
                            onClick={() => handleRemove(member.email)}
                            className="px-4 border border-red-500 hover:bg-red-500 hover:text-white rounded-full"
                          >
                            Remove
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <h2 className="text-xl font-bold text-slate-900">Admins</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {project.admins.map((admin) => (
                    <div
                      key={admin._id}
                      className="flex flex-col gap-2 w-80 shrink-0 bg-white border-slate-200 shadow-sm p-2 rounded-xl text-slate-500"
                    >
                      <p>{admin.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <h2 className="text-xl font-bold text-slate-900">Tasks</h2>
                {project.owner._id === user._id && (
                  <div className="flex flex-col bg-gray-100/50 w-60 sm:w-96 mx-auto rounded-xl p-4 m-6">
                    <input
                      type="text"
                      placeholder="Task title"
                      className="flex-1 outline-none"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                    <textarea
                      placeholder="Task description"
                      className="flex-1 outline-none"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    ></textarea>
                    <input
                      type="date"
                      className="flex-1 outline-none"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                    />
                    <button
                      onClick={addTask}
                      className="border border-cyan-600 px-4 font-bold rounded-full hover:cursor-pointer text-slate-500 hover:bg-cyan-700 hover:text-white"
                    >
                      Add task
                    </button>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4">
                  {project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex flex-col gap-2 border border-slate-200 shadow-sm rounded-xl p-4 text-slate-500"
                      >
                        <p className="text-black font-bold">{task.title}</p>
                        <p>
                          Description:{" "}
                          <span className="text-slate-900 font-bold">
                            {task.description}
                          </span>
                        </p>
                        <p>
                          Deadline:{" "}
                          <span className="text-slate-900 font-bold">
                            {task.deadline.split("T")[0]}
                          </span>
                        </p>
                        <p className={`${task.completed && "line-through"}`}>
                          {project.owner._id === user._id && (
                            <input
                              type="checkbox"
                              checked={task.completed}
                              className="my-auto"
                            />
                          )}{" "}
                          Status:{" "}
                          <span className="text-slate-900 font-bold">{`${
                            task.completed ? "Completed" : "Not completed"
                          }`}</span>
                        </p>
                        <p className="">
                          Assigned To:{" "}
                          {
                            <span className="text-slate-900 font-bold">
                              {task.assignedTo[1] ? (
                                task.assignedTo[1].name
                              ) : (
                                <span className="text-slate-500 font-normal">
                                  No user assigned
                                </span>
                              )}
                            </span>
                          }
                        </p>

                        {project.owner._id === user._id &&
                          task.assignedTo.length === 1 && (
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                className="outline-slate-200 rounded-full px-4"
                                placeholder="user email"
                                value={assignTo}
                                onChange={(e) => {
                                  setAssignTo(e.target.value);
                                  setTaskId(task._id);
                                }}
                              />
                              <button
                                onClick={handleAssign}
                                className="border border-cyan-600 px-4 text-slate-500 hover:text-white rounded-full hover:cursor-pointer hover:bg-cyan-700"
                              >
                                Asign above user
                              </button>
                            </div>
                          )}
                        {project.owner._id === user._id &&
                          task.assignedTo.length === 2 && (
                            <button
                              onClick={() =>
                                handleUnsassign(
                                  task._id,
                                  task.assignedTo[1]._id
                                )
                              }
                              className="border border-red-600 px-4 text-slate-500 hover:text-white rounded-full hover:cursor-pointer hover:bg-red-700"
                            >
                              Unassign user
                            </button>
                          )}
                      </div>
                    ))
                  ) : (
                    <p>No tasks</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Project;
