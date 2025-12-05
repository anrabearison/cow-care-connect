// Configuration centralisée des APIs
export const API_CONFIG = {
  // Mode de développement: utilise les données mockées
  // Mode production: utilise les vraies APIs
  // Par défaut à true si non défini


  // URLs des vraies APIs
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

  ENDPOINTS: {
    CATTLE: '/api/v1/cattle',
    USERS: '/api/v1/users',
    AUTH: '/api/v1/auth',
    EVENTS: '/api/v1/events',
    TREATMENTS: '/api/v1/treatments'
  },

  // Configuration pour React Admin
  ADMIN_API_URL: import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3000/api/v1'
};

// Helper pour construire les URLs complètes
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};