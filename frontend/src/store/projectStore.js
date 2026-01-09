import { create } from "zustand";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/projects/"
    : "/api/projects/";

export const useProjectStore = create((set) => ({
  projects: null,
  contributions: null,
  previousContributions: null,
  project: null,
  tasks: null,
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

  getContributions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL + "contributions", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      set({ contributions: data.projects, isLoading: false });
      console.log(data.projects);
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  getPreviousContributions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL + "previous-contributions", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      set({ previousContributions: data.projects, isLoading: false });
      console.log(data.projects);
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

  inviteUserToProject: async (projectId, targetUserEmail) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_URL + `${projectId}/` + "invite", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, targetUserEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  acceptProjectInvite: async (projectId, inviteId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_URL + `${projectId}/` + "invite/accept", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log(data.message);
      return data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  rejectProjectInvite: async (projectId, inviteId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_URL + `${projectId}/` + "invite/reject", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log(data.message);

      return data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addProjectTask: async (projectId, task) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_URL + `${projectId}/` + "tasks", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  getProjectTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_URL + `${projectId}/` + "tasks", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      set({ tasks: data.tasks, isLoading: false });
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  assignTaskToUser: async (projectId, taskId, assignToEmail) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(
        API_URL + `${projectId}/tasks/` + `${taskId}/` + "assign",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignToEmail }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  unassignTaskFromUser: async (projectId, taskId, assignedToId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(
        API_URL + `${projectId}/tasks/` + `${taskId}/` + "unassign",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignedToId }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeFromProject: async (projectId, emailToRemove) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_URL + `${projectId}/` + "remove-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailToRemove }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateTask: async (projectId, taskId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_URL + `${projectId}/tasks/` + `${taskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
