import { User } from '@/features/cattle/types';
import { API_CONFIG, buildApiUrl } from '@/config/api';

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
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.apiLogin(credentials);
  }

  async logout(): Promise<void> {


    // Nettoyage local
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  async refreshToken(): Promise<string | null> {


    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/refresh`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const result = await response.json();
      const newToken = result.token;

      if (newToken) {
        localStorage.setItem('auth_token', newToken);
        return newToken;
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



  // Méthodes pour la vraie authentification API
  private async apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/login`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.access_token && result.user) {
        localStorage.setItem('auth_token', result.access_token);
        localStorage.setItem('user_data', JSON.stringify(result.user));

        return {
          user: result.user,
          token: result.access_token,
          success: true,
          message: 'Connexion réussie'
        };
      } else {
        return {
          user: {} as User,
          token: '',
          success: false,
          message: 'Erreur de connexion'
        };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return {
        user: {} as User,
        token: '',
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  }
}

export const authService = new AuthService();