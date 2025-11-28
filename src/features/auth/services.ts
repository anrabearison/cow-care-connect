import { User } from '@/features/cattle/types';
import { API_CONFIG } from '@/config/api';
import { apiClient } from '@/utils/apiClient';
import { AuthenticationError, ErrorMessages } from '@/utils/errors';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  success: boolean;
  message?: string;
}

class AuthService {
  private readonly endpoint = API_CONFIG.ENDPOINTS.AUTH;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const result = await apiClient.post<{ access_token: string; user: User }>(
        `${this.endpoint}/login`,
        credentials,
        { skipAuth: true }
      );

      if (result.access_token && result.user) {
        localStorage.setItem('auth_token', result.access_token);
        localStorage.setItem('user_data', JSON.stringify(result.user));

        return {
          user: result.user,
          token: result.access_token,
          success: true,
          message: 'Connexion réussie',
        };
      }

      throw new AuthenticationError(ErrorMessages.LOGIN_ERROR);
    } catch (error: any) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  async refreshToken(): Promise<string | null> {
    try {
      const result = await apiClient.post<{ token: string }>(`${this.endpoint}/refresh`);

      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        return result.token;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUser(): User | null {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getUser() !== null;
  }
}

export const authService = new AuthService();