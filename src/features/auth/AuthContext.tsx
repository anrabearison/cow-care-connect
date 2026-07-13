import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/features/cattle/types';
import { toast } from 'sonner';
import { clearOwnerSelection } from '@/contexts/OwnerSelectionContext';
import { useQueryClient } from '@tanstack/react-query';
import { refreshManager } from '@/utils/refreshManager';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (code: string, invitationToken?: string) => Promise<boolean>;
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
  const queryClient = useQueryClient();

  // Unique function to check session via GET /auth/me
  const checkSession = useCallback(async (): Promise<User | null> => {
    try {
      const { apiClient } = await import('@/utils/apiClient');
      const { API_ENDPOINTS } = await import('@/config/api');
      
      // Call /me endpoint to verify session via cookies
      const userData = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
      setUser(userData);
      return userData;
    } catch (error) {
      // Session not valid or expired - user is not logged in
      // Clean up any legacy localStorage data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    // Check session on mount
    checkSession().finally(() => {
      setIsLoading(false);
    });
  }, [checkSession]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { authService } = await import('./services');
      const response = await authService.login({ email, password });

      if (response.success) {
        // Verify session via GET /auth/me instead of using response.user directly
        const userData = await checkSession();
        
        // Invalidate user-specific queries after successful login
        if (userData) {
          queryClient.invalidateQueries({ queryKey: ['user', userData.id] });
          queryClient.invalidateQueries({ queryKey: ['user'] });
          // Mark session as active for refreshManager
          refreshManager.markSessionAsActive();
        }
        
        setIsLoading(false);
        return userData !== null;
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

    const loginWithGoogle = async (code: string, invitationToken?: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { authService } = await import('./services');
      const response = await authService.loginWithGoogle(code, invitationToken);

      if (response.success) {
        // Verify session via GET /auth/me instead of using response.user directly
        const userData = await checkSession();
        
        // Invalidate user-specific queries after successful login
        if (userData) {
          queryClient.invalidateQueries({ queryKey: ['user', userData.id] });
          queryClient.invalidateQueries({ queryKey: ['user'] });
        }
        
        setIsLoading(false);
        return userData !== null;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Erreur lors de la connexion avec Google');
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
      // Clean up legacy localStorage data (migration cleanup)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      clearOwnerSelection();
      setUser(null);
      // Clear all queries on logout
      queryClient.clear();
      // Mark session as inactive for refreshManager
      refreshManager.markSessionAsInactive();
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};