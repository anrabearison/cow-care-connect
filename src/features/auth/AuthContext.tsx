import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/features/cattle/types';
import { toast } from 'sonner';
import { setOwnerIdGetter } from '@/utils/apiClient';
import { clearOwnerSelection } from '@/contexts/OwnerSelectionContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize owner ID getter
  useEffect(() => {
    setOwnerIdGetter(() => {
      // Get user from state or localStorage as fallback
      if (user?.owner?.id) return user.owner.id;

      try {
        const storedData = localStorage.getItem('user_data');
        if (storedData) {
          const parsedUser = JSON.parse(storedData);
          return parsedUser?.owner?.id || null;
        }
      } catch (e) {
        return null;
      }
      return null;
    });
  }, [user]);

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        toast.error('Session invalide, veuillez vous reconnecter');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { authService } = await import('./services');
      const response = await authService.login({ email, password });

      if (response.success) {
        setUser(response.user);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur lors de la connexion');
      setIsLoading(false);
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      const { authService } = await import('./services');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      // Toujours nettoyer localement
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      clearOwnerSelection();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};