import { AuthProvider } from 'react-admin';

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    // Simulation d'authentification - remplacez par votre API
    if (username === 'admin@ferme.mg' && password === 'admin123') {
      localStorage.setItem('admin_token', 'admin_jwt_token');
      localStorage.setItem('admin_user', JSON.stringify({
        id: 1,
        name: 'Jean Rakoto',
        email: 'admin@ferme.mg',
        role: 'admin'
      }));
      return Promise.resolve();
    }
    return Promise.reject(new Error('Identifiants incorrects'));
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    return Promise.resolve();
  },

  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem('admin_token')
      ? Promise.resolve()
      : Promise.reject();
  },

  getPermissions: () => {
    const user = localStorage.getItem('admin_user');
    if (user) {
      const userData = JSON.parse(user);
      return Promise.resolve(userData.role);
    }
    return Promise.reject();
  },

  getIdentity: () => {
    const user = localStorage.getItem('admin_user');
    if (user) {
      const userData = JSON.parse(user);
      return Promise.resolve({
        id: userData.id,
        fullName: userData.name,
        avatar: undefined,
      });
    }
    return Promise.reject();
  },
};