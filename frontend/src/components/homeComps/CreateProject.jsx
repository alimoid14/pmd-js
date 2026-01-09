import React, { useState } from "react";
import { useProjectStore } from "../../store/projectStore";

function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const { createProject, getProjects } = useProjectStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(title, description, deadline);

    try {
      await createProject(title, description, deadline);
      await getProjects();
      console.log("Project created successfully");
      setTitle("");
      setDescription("");
      setDeadline("");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
    <div className="h-[45vh] bg-white border border-slate-200 p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-2">Create project</h2>
      <form className="flex flex-col gap-4 h-[90%]">
        <input
          type="text"
          placeholder="Project title"
          className="shadow-sm rounded-sm outline-none px-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="outline-none shadow-sm rounded-xl px-2 min-h-0 flex-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="flex flex-col">
          <label>Deadline</label>
          <input
            type="date"
            className="outline-0 shadow-sm rounded-full px-2"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <button
          className="border border-cyan-600 text-slate-500 hover:bg-cyan-700 hover:text-white p-2 rounded-xl hover:rounded-full transition-all duration-300 ease-in-out"
          onClick={handleSubmit}
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
