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
    if (API_CONFIG.USE_MOCK_DATA) {
      return this.mockLogin(credentials);
    }
    
    return this.apiLogin(credentials);
  }

  async logout(): Promise<void> {
    if (!API_CONFIG.USE_MOCK_DATA) {
      // Appel API pour invalider le token côté serveur
      try {
        await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/logout`), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.getToken()}`,
          },
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    // Nettoyage local
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  async refreshToken(): Promise<string | null> {
    if (API_CONFIG.USE_MOCK_DATA) {
      return this.getToken(); // Mock: retourne le token existant
    }
    
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

  // Méthodes pour l'authentification mockée
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Utilisateurs de test
        const mockUsers = [
          {
            id: '1',
            name: 'Jean Rakoto',
            email: 'admin@ferme.mg',
            role: 'admin' as const,
            password: 'admin123'
          },
          {
            id: '2',
            name: 'Livia Raso',
            email: 'livia@ferme.mg',
            role: 'eleveur' as const,
            password: 'secret'
          },
          {
            id: '3',
            name: 'Tiana Andry',
            email: 'tiana@ferme.mg',
            role: 'veterinaire' as const,
            password: 'secret'
          }
        ];
        
        const user = mockUsers.find(u => 
          u.email === credentials.email && u.password === credentials.password
        );
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          const token = `mock_token_${Date.now()}_${user.id}`;
          
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
          
          resolve({
            user: userWithoutPassword,
            token,
            success: true,
            message: 'Connexion réussie'
          });
        } else {
          resolve({
            user: {} as User,
            token: '',
            success: false,
            message: 'Email ou mot de passe incorrect'
          });
        }
      }, 1000); // Simule la latence réseau
    });
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
      
      if (result.success && result.token && result.user) {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        
        return {
          user: result.user,
          token: result.token,
          success: true,
          message: result.message || 'Connexion réussie'
        };
      } else {
        return {
          user: {} as User,
          token: '',
          success: false,
          message: result.message || 'Erreur de connexion'
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