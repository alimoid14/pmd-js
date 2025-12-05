import { create } from "zustand";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/projects/"
    : "/api/projects/";

export const useProjectStore = create((set) => ({
  projects: null,
  project: null,
  isLoading: false,
  error: null,
  getProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      set({ projects: data.projects, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createProject: async (title, description, deadline) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, deadline }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      set({ projects: data.projects, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  getProjectById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL + id, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      set({ project: data.project, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  inviteUserToProject : async (projectId, targetUserId) => {
  const res = await fetch(API_URL + "invite", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, targetUserId }),
  });

  return res.json();
}

}));