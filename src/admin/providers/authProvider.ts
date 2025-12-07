import { AuthProvider } from 'react-admin';
import { API_CONFIG } from '@/config/api';

const API_URL = API_CONFIG.BASE_URL;

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await fetch(`${API_CONFIG.ADMIN_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Identifiants incorrects');
      }

      const data = await response.json();

      // Stocker le token et les informations utilisateur
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return Promise.resolve();
  },

  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem('auth_token')
      ? Promise.resolve()
      : Promise.reject();
  },

  getPermissions: () => {
    const user = localStorage.getItem('user_data');
    if (user) {
      const userData = JSON.parse(user);
      return Promise.resolve(userData.role);
    }
    return Promise.reject();
  },

  getIdentity: () => {
    const user = localStorage.getItem('user_data');
    if (user) {
      const userData = JSON.parse(user);
      return Promise.resolve({
        id: userData.id,
        fullName: userData.name,
        avatar: undefined,
        owner: userData.owner?.name,
        owner_id: userData.owner_id,
      });
    }
    return Promise.reject();
  },
};