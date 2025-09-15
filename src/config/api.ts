// Configuration centralisée des APIs
export const API_CONFIG = {
  // Mode de développement: utilise les données mockées
  // Mode production: utilise les vraies APIs
  USE_MOCK_DATA: true, // Force l'utilisation des données mockées pour éviter les erreurs de fetch
  
  // URLs des vraies APIs
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.ferme-mg.com',
  
  ENDPOINTS: {
    CATTLE: '/api/cattle',
    USERS: '/api/users',
    AUTH: '/api/auth',
    EVENTS: '/api/events',
    TREATMENTS: '/api/treatments'
  },
  
  // Configuration pour React Admin
  ADMIN_API_URL: import.meta.env.VITE_ADMIN_API_URL || 'https://api.ferme-mg.com/admin'
};

// Helper pour construire les URLs complètes
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};