const DEFAULT_FRONT_OFFICE_URL = 'http://localhost:8085';

export const FRONT_OFFICE_URL = (import.meta.env.VITE_FRONT_OFFICE_URL || DEFAULT_FRONT_OFFICE_URL).replace(/\/+$/, '');
