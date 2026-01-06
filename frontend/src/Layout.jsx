import React from "react";
import Navbar from "./components/layout/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Navbar />
      <main className="mt-16 min-h-[calc(100vh-64px)] bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
