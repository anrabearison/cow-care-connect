const DEFAULT_FRONT_OFFICE_URL = 'http://localhost:8085';

export const FRONT_OFFICE_URL = (import.meta.env.VITE_FRONT_OFFICE_URL || DEFAULT_FRONT_OFFICE_URL).replace(/\/+$/, '');

export const APP_ROUTE_PATHS = {
  INVITATION: '/invitation',
  GOOGLE_CALLBACK: '/auth/google/callback',
};

export const APP_URLS = {
  INVITATION: `${FRONT_OFFICE_URL}${APP_ROUTE_PATHS.INVITATION}`,
  GOOGLE_CALLBACK: `${FRONT_OFFICE_URL}${APP_ROUTE_PATHS.GOOGLE_CALLBACK}`,
};
