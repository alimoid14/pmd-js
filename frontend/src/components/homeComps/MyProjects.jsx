import React from "react";
import { useProjectStore } from "../../store/projectStore";
import { Link } from "react-router-dom";
function MyProjects() {
  const { projects } = useProjectStore();

  return (
    <div className="h-[50vh] bg-white border border-slate-200 p-4 rounded-xl">
      <h1>My Projects</h1>
      <div className="flex flex-col gap-4 h-[90%] overflow-auto">
        {projects?.map((project) => (
          <div
            key={project._id}
            className="flex flex-col gap-2 p-4 shadow-sm rounded-2xl border border-slate-200"
          >
            <Link
              to={`/projects/${project._id}`}
              className="font-bold text-black border-b border-cyan-700"
            >
              {project.title}
            </Link>
            <p>{project.description}</p>
            <p>{project.deadline.split("T")[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProjects;
