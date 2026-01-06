import React from "react";
import { Link } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";

function ContributingTo() {
  const { contributions } = useProjectStore();
  return (
    <div className="h-[50vh] bg-white border border-slate-200 p-4 rounded-xl">
      <h1 className="text-xl font-bold mb-2">Contributing to</h1>
      <div className="flex flex-col gap-4 h-[90%] overflow-auto">
        {contributions?.length > 0 ? (
          contributions?.map((project) => (
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
            <p className="text-lg">No current contributions</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContributingTo;
