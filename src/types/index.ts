// Form and error types

export interface FormData {
  email: string;
  password: string;
}

export interface RegisterData extends FormData {
  name: string;
  confirmPassword: string;
  role: '' | 'Developer' | 'QA' | 'Manager';
}

export interface Errors {
  email?: string;
  password?: string;
}

export interface RegisterError extends Errors {
  name?: string;
  confirmPassword?: string;
  role?: string;
}

// Project types

export interface Project {
  _id: string;
  title?: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  tasks?: Task[];
  createdBy?: string;
  assignedTo?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Task type

export interface Task {
  _id?: string;
  project?: Project; // Optional
  createdBy?: string; // Optional
  createdAt?: string; // Optional
  updatedAt?: string; // Optional
  title: string;
  description: string;
  status: 'Assigned' | 'In Progress' | 'Completed';
  assignedTo: string;
}

// User type

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Developer' | 'QA';
  password?: string;
  refreshToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User role type

export type UserRole = 'Manager' | 'Developer' | 'QA';

//  User store type
export interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (token: string) => void;
  clearUser: () => void;
  hasRole: (role: UserRole) => boolean;
  getToken: () => string | null; // ✅ Add getToken here
}

// Project form data

export interface ProjectFormData {
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

// Notification

// Notification type
export interface Notification {
  _id: string;
  title: string;
  description: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Notification store

export interface NotificationStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  getNotifications: () => Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}
