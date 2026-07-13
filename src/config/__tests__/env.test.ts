/**
 * Tests de validation des variables d'environnement
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { validateEnv } from '../env';

describe('Environment Variables Validation Tests', () => {
  describe('Scénario 1: Toutes les variables présentes', () => {
    it('doit valider avec succès toutes les variables présentes', () => {
      const envVars = {
        VITE_API_URL: 'http://localhost:3000',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
        NODE_ENV: 'development',
      };

      const validatedEnv = validateEnv(envVars);

      expect(validatedEnv.VITE_API_URL).toBe('http://localhost:3000');
      expect(validatedEnv.VITE_ADMIN_API_URL).toBe('http://localhost:3000/api/v1');
      expect(validatedEnv.VITE_FRONT_OFFICE_URL).toBe('http://localhost:8085');
      expect(validatedEnv.VITE_GOOGLE_CLIENT_ID).toBe('test-google-client-id');
      expect(validatedEnv.NODE_ENV).toBe('development');
    });
  });

  describe('Scénario 2: Variable absente', () => {
    it('doit rejeter si VITE_API_URL est absent', () => {
      const envVars = {
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
      };

      expect(() => validateEnv(envVars)).toThrow(/VITE_API_URL/);
    });

    it('doit rejeter si VITE_GOOGLE_CLIENT_ID est absent', () => {
      const envVars = {
        VITE_API_URL: 'http://localhost:3000',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
      };

      expect(() => validateEnv(envVars)).toThrow(/VITE_GOOGLE_CLIENT_ID/);
    });
  });

  describe('Scénario 3: Variable vide', () => {
    it('doit rejeter si VITE_API_URL est vide', () => {
      const envVars = {
        VITE_API_URL: '',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
      };

      expect(() => validateEnv(envVars)).toThrow('VITE_API_URL est requis');
    });

    it('doit rejeter si VITE_GOOGLE_CLIENT_ID est vide', () => {
      const envVars = {
        VITE_API_URL: 'http://localhost:3000',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: '',
      };

      expect(() => validateEnv(envVars)).toThrow('VITE_GOOGLE_CLIENT_ID est requis');
    });
  });

  describe('Scénario 4: URL invalide', () => {
    it('doit rejeter si VITE_API_URL n\'est pas une URL valide', () => {
      const envVars = {
        VITE_API_URL: 'not-a-valid-url',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
      };

      expect(() => validateEnv(envVars)).toThrow('VITE_API_URL doit être une URL valide');
    });

    it('doit rejeter si VITE_FRONT_OFFICE_URL n\'est pas une URL valide', () => {
      const envVars = {
        VITE_API_URL: 'http://localhost:3000',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'invalid-url',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
      };

      expect(() => validateEnv(envVars)).toThrow('VITE_FRONT_OFFICE_URL doit être une URL valide');
    });
  });

  describe('Scénario 5: Mode production', () => {
    it('doit détecter le mode production', () => {
      const envVars = {
        VITE_API_URL: 'https://api.ombiko.mg',
        VITE_ADMIN_API_URL: 'https://api.ombiko.mg/api/v1',
        VITE_FRONT_OFFICE_URL: 'https://ombiko.mg',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
        NODE_ENV: 'production',
      };

      const validatedEnv = validateEnv(envVars);
      expect(validatedEnv.NODE_ENV).toBe('production');
    });
  });

  describe('Scénario 6: Mode développement', () => {
    it('doit détecter le mode développement', () => {
      const envVars = {
        VITE_API_URL: 'http://localhost:3000',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
        NODE_ENV: 'development',
      };

      const validatedEnv = validateEnv(envVars);
      expect(validatedEnv.NODE_ENV).toBe('development');
    });
  });

  describe('Scénario 7: Mode test', () => {
    it('doit détecter le mode test', () => {
      const envVars = {
        VITE_API_URL: 'http://localhost:3000',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
        NODE_ENV: 'test',
      };

      const validatedEnv = validateEnv(envVars);
      expect(validatedEnv.NODE_ENV).toBe('test');
    });
  });

  describe('Scénario 8: NODE_ENV optionnel', () => {
    it('doit valider sans NODE_ENV (optionnel)', () => {
      const envVars = {
        VITE_API_URL: 'http://localhost:3000',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
      };

      const validatedEnv = validateEnv(envVars);
      expect(validatedEnv.NODE_ENV).toBeUndefined();
    });
  });

  describe('Scénario 9: Structure de l\'objet validé', () => {
    it('doit retourner un objet avec toutes les propriétés requises', () => {
      const envVars = {
        VITE_API_URL: 'http://localhost:3000',
        VITE_ADMIN_API_URL: 'http://localhost:3000/api/v1',
        VITE_FRONT_OFFICE_URL: 'http://localhost:8085',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
        NODE_ENV: 'development',
      };

      const validatedEnv = validateEnv(envVars);

      expect(validatedEnv).toHaveProperty('VITE_API_URL');
      expect(validatedEnv).toHaveProperty('VITE_ADMIN_API_URL');
      expect(validatedEnv).toHaveProperty('VITE_FRONT_OFFICE_URL');
      expect(validatedEnv).toHaveProperty('VITE_GOOGLE_CLIENT_ID');
      expect(validatedEnv).toHaveProperty('NODE_ENV');
    });
  });
});
