const API_PREFIX = '/api/v1';

const createResourceEndpoints = (resource: string) => {
  const base = `${API_PREFIX}/${resource}`;

  return {
    BASE: base,
    byId: (id: string | number) => `${base}/${id}`,
  };
};

const CATTLE = createResourceEndpoints('cattle');
const HERD_BOOKS = createResourceEndpoints('herd-books');
const HERD_BOOK_CATTLE = createResourceEndpoints('herd-book-cattle');
const PASSPORT = createResourceEndpoints('passport');

export const API_ENDPOINTS = {
  CATTLE: {
    ...CATTLE,
    STATISTICS: `${CATTLE.BASE}/statistics`,
    BIRTH: (motherId: string | number) => `${CATTLE.BASE}/${motherId}/birth`,
  },
  USERS: createResourceEndpoints('users'),
  AUTH: {
    BASE: `${API_PREFIX}/auth`,
    LOGIN: `${API_PREFIX}/auth/login`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
  },
  EVENTS: createResourceEndpoints('events'),
  TREATMENTS: createResourceEndpoints('treatments'),
  CHARACTERS: createResourceEndpoints('characters'),
  CATEGORIES: createResourceEndpoints('categories'),
  EVENT_TYPES: createResourceEndpoints('event-types'),
  HERD_BOOKS: {
    ...HERD_BOOKS,
    CATTLE: (herdBookId: string | number) => `${HERD_BOOKS.BASE}/${herdBookId}/cattle`,
  },
  HERD_BOOK_CATTLE: {
    ...HERD_BOOK_CATTLE,
    BY_HERD_BOOK: (herdBookId: string | number) => `${HERD_BOOK_CATTLE.BASE}/herd-book/${herdBookId}`,
    CATTLE_HISTORY: (cattleId: string | number) => `${HERD_BOOK_CATTLE.BASE}/cattle/${cattleId}/history`,
    CATTLE_REGISTRATION: (registrationId: string | number) => `${HERD_BOOK_CATTLE.BASE}/cattle/${registrationId}`,
  },
  MEDICAMENTS: createResourceEndpoints('medicaments'),
  OWNERS: createResourceEndpoints('owners'),
  PASSPORT: {
    ...PASSPORT,
    GENERATE: (id: string | number) => `${PASSPORT.BASE}/${id}/generate`,
    DOWNLOAD: (id: string | number) => `${PASSPORT.BASE}/${id}/download`,
    PREVIEW: (id: string | number) => `${PASSPORT.BASE}/${id}/preview`,
  },
  PURCHASES: createResourceEndpoints('purchases'),
  STATUS: createResourceEndpoints('status'),
  SUPPLIERS: createResourceEndpoints('suppliers'),
  UPLOAD: {
    BASE: `${API_PREFIX}/upload`,
  },
  VETERINARIANS: createResourceEndpoints('veterinarians'),
  INVITATIONS: createResourceEndpoints('invitations'),
  DASHBOARD: {
    BASE: `${API_PREFIX}/dashboard`,
    STATS: `${API_PREFIX}/dashboard/stats`,
  },
  SANTE_ANIMALE: {
    BASE: `${API_PREFIX}/sante-animale`,
    CHAT: `${API_PREFIX}/sante-animale/chat`,
  },
} as const;

export const EXTERNAL_URLS = {
  UI_AVATARS_API: 'https://ui-avatars.com/api/',
} as const;

// Configuration centralisée des APIs
export const API_CONFIG = {
  // Mode de développement: utilise les données mockées
  // Mode production: utilise les vraies APIs
  // Par défaut à true si non défini


  // URLs des vraies APIs
  BASE_URL: (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, ''),

  ENDPOINTS: {
    CATTLE: API_ENDPOINTS.CATTLE.BASE,
    USERS: API_ENDPOINTS.USERS.BASE,
    AUTH: API_ENDPOINTS.AUTH.BASE,
    EVENTS: API_ENDPOINTS.EVENTS.BASE,
    TREATMENTS: API_ENDPOINTS.TREATMENTS.BASE,
  },

  // Configuration pour React Admin
  ADMIN_API_URL: import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3000/api/v1'
};

// Helper pour construire les URLs complètes
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, '');
  return `${baseUrl}${endpoint}`;
};
