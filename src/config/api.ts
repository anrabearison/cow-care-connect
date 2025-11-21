// Configuration centralisée des APIs
export const API_CONFIG = {
  // Mode de développement: utilise les données mockées
  // Mode production: utilise les vraies APIs
  // Par défaut à true si non défini
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK === 'true',

  // URLs des vraies APIs
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

  ENDPOINTS: {
    CATTLE: '/api/cattle',
    USERS: '/api/users',
    AUTH: '/api/auth',
    EVENTS: '/api/events',
    TREATMENTS: '/api/treatments'
  },

  // Configuration pour React Admin
  ADMIN_API_URL: import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3000/admin'
};

// Helper pour construire les URLs complètes
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};