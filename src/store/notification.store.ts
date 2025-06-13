import { create } from 'zustand';
import { Notification, NotificationStore } from '@/types';

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  setNotifications: (notifications: Notification[]) => set({ notifications }),

  getNotifications: (): Notification[] => {
    return useNotificationStore.getState().notifications;
  },

  addNotification: (notification: Notification): void =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  clearNotifications: (): void => set({ notifications: [] }),
}));

export default useNotificationStore;
