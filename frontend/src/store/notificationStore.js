import { create } from "zustand";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/notifications/"
    : "/api/notifications/";

export const useNotificationStore = create((set) => ({
  notifications: [],
  active: 0,
  unreadCount: 0,
  latestPopup: null, // for toast popup
  loading: false,
  error: null,

  getNotifications: async () => {
    try{
      set({loading: true, error: null});
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        set({
          notifications: data.notifications, active: data.notifications.length,
        });
        set({loading: false});
        }catch(error){
        console.log(error);
        set({
          error: error.message,
        });
        throw error;
        }
    },
  

  addNotification: (noti) =>
    set((state) => ({
      notifications: [...state.notifications, noti],
      unreadCount: state.unreadCount + 1,
      latestPopup: noti, // for triggering toast popup
      active: state.active + 1
    })),

  resetNotifications: () =>
    set(() => ({
      notifications: [],
      unreadCount: 0,
      active: 0
    })),

  markAllRead: () =>
    set(() => ({
      unreadCount: 0,
    })),

  clearPopup: () =>
    set(() => ({ latestPopup: null })),
}));
