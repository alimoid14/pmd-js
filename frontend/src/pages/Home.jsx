import React, { useState } from "react";
import Profile from "../components/homeComps/Profile";
import CreateProject from "../components/homeComps/CreateProject";
import ContributingTo from "../components/homeComps/ContributingTo";
import MyProjects from "../components/homeComps/MyProjects";
import PreviousContributions from "../components/homeComps/PreviousContributions";

function Home() {
  const [myProject, setMyProject] = useState(true);
  const [contributingTo, setContributingTo] = useState(false);
  const [create, setCreate] = useState(false);
  return (
    <section className="">
      <section className="max-w-7xl mx-auto p-4 lg:px-6 flex flex-col gap-6">
        <Profile />
        <div className="flex flex-row sm:flex-row gap-4 lg:hidden">
          <button
            className="px-4 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white"
            onClick={() => {
              setMyProject(true);
              setContributingTo(false);
              setCreate(false);
            }}
          >
            My Projects
          </button>
          <button
            className="px-4 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white"
            onClick={() => {
              setMyProject(false);
              setContributingTo(true);
              setCreate(false);
            }}
          >
            Contributing to
          </button>
          <button
            className="px-4 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white"
            onClick={() => {
              setMyProject(false);
              setContributingTo(false);
              setCreate(true);
            }}
          >
            Create Project
          </button>
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className={`${myProject ? "block" : "hidden"} lg:block`}>
            <MyProjects />
          </div>
          <div className={`${contributingTo ? "block" : "hidden"} lg:block`}>
            <ContributingTo />
          </div>
          <div className={`${create ? "block" : "hidden"} lg:block`}>
            <CreateProject />
          </div>
        </div>
        <PreviousContributions />
      </section>
    </section>
  );
}

export default Home;
