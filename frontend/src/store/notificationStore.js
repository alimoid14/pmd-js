import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  latestPopup: null, // for toast popup

  addNotification: (noti) =>
    set((state) => ({
      notifications: [...state.notifications, noti],
      unreadCount: state.unreadCount + 1,
      latestPopup: noti, // triggers toast popup
    })),

  markAllRead: () =>
    set(() => ({
      unreadCount: 0,
    })),

  clearPopup: () =>
    set(() => ({ latestPopup: null })),
}));
