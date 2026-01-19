import { create } from "zustand";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth/"
    : "/api/auth/";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL + "login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL + "logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL + "signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      //console.log(data);
      set({
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  checkAuth: async () => {
    if (get().user) return;
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await fetch(API_URL + "check-auth", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      set({
        user: data.user,
        isCheckingAuth: false,
        error: null,
      });
      if (response.ok) set({ isAuthenticated: true });
    } catch (error) {
      set({
        error: error.message,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      throw error;
    } finally {
      set({
        isLoading: false,
        isCheckingAuth: false,
      });
    }
  },

  getCloudinarySignature: async () => {
    try {
      const response = await fetch(API_URL + "cloudinary/signature", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  saveAvatar: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL + "user/save-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      set({ user: result.user, isLoading: false });
      return result;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
