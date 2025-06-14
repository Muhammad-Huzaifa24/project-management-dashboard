import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { UserStore, UserRole } from '../types';

const useStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (token: string) => {
    try {
      const decodedToken = jwtDecode<{
        _id: string;
        name: string;
        email: string;
        role: 'Manager' | 'Developer' | 'QA';
      }>(token);

      const user = {
        _id: decodedToken._id,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
      };

      set({ user, isAuthenticated: true });
      localStorage.setItem('userRole', decodedToken.role);
      localStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      set({ user: null, isAuthenticated: false });
    }
  },
  clearUser: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('statusCount')
  },
  hasRole: (role: UserRole): boolean => {
    const state = useStore.getState();
    return state.user?.role === role;
  },
  getToken: () => {
    return localStorage.getItem('accessToken') || null;
  },
  isUserAuthenticated : () => {
    const token =  localStorage.getItem('accessToken');
    if(token){
    }
  }
}));

const token = localStorage.getItem('accessToken');
if (token) {
  useStore.getState().setUser(token);
}

export default useStore;
