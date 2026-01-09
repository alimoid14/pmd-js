import React from "react";
import { Link } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";

function PreviousContributions() {
  const { previousContributions } = useProjectStore();
  return (
    <div className="overflow-y-auto bg-white border border-slate-200 p-4 rounded-xl">
      <h1 className="text-xl font-bold mb-2">Previous Contributions</h1>
      <div className="flex flex-col gap-4 h-[90%] overflow-auto">
        {previousContributions?.length > 0 ? (
          previousContributions?.map((project) => (
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
          ))
        ) : (
          <div className="text-center text-slate-500 flex h-[90%] items-center justify-center">
            <p className="text-lg">No previous contributions</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviousContributions;
