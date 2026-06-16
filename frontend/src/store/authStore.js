import { create } from 'zustand';
import { login as apiLogin, register as apiRegister, getMe } from '../api/properties';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('propspace_user') || 'null'),
  token: localStorage.getItem('propspace_token') || null,
  loading: false,
  isAuthenticated: !!localStorage.getItem('propspace_token'),

  login: async (credentials) => {
    set({ loading: true });
    try {
      const { data } = await apiLogin(credentials);
      localStorage.setItem('propspace_token', data.token);
      localStorage.setItem('propspace_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
      return { success: true };
    } catch (err) {
      set({ loading: false });
      const msg = err.response?.data?.error || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  register: async (userData) => {
    set({ loading: true });
    try {
      const { data } = await apiRegister(userData);
      localStorage.setItem('propspace_token', data.token);
      localStorage.setItem('propspace_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
      toast.success(`Welcome to PropSpace, ${data.user.name.split(' ')[0]}! 🏡`);
      return { success: true };
    } catch (err) {
      set({ loading: false });
      const msg = err.response?.data?.error || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('propspace_token');
    localStorage.removeItem('propspace_user');
    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Logged out successfully');
  },

  refreshUser: async () => {
    try {
      const { data } = await getMe();
      localStorage.setItem('propspace_user', JSON.stringify(data.data));
      set({ user: data.data });
    } catch {
      get().logout();
    }
  },

  updateUser: (updates) => {
    const updated = { ...get().user, ...updates };
    localStorage.setItem('propspace_user', JSON.stringify(updated));
    set({ user: updated });
  }
}));

export default useAuthStore;
