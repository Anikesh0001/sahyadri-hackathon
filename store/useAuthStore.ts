import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (name, role) => {
    // Simulated login
    set({
      user: {
        id: `user-${Date.now()}`,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        role,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      },
      isAuthenticated: true,
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
