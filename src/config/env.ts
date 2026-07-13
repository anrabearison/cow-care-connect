/**
 * Validation des variables d'environnement
 * Utilise Zod pour valider toutes les variables au démarrage
 */

import { z } from 'zod';

// Schéma de validation des variables d'environnement
const envSchema = z.object({
  // API Configuration
  VITE_API_URL: z.string().url('VITE_API_URL doit être une URL valide').min(1, 'VITE_API_URL est requis'),
  VITE_ADMIN_API_URL: z.string().url('VITE_ADMIN_API_URL doit être une URL valide').min(1, 'VITE_ADMIN_API_URL est requis'),

  // Front Office Configuration
  VITE_FRONT_OFFICE_URL: z.string().url('VITE_FRONT_OFFICE_URL doit être une URL valide').min(1, 'VITE_FRONT_OFFICE_URL est requis'),

  // Google OAuth Configuration
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, 'VITE_GOOGLE_CLIENT_ID est requis'),

  // Mode (optionnel, déduit de NODE_ENV)
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

type EnvSchema = z.infer<typeof envSchema>;

/**
 * Valide et retourne les variables d'environnement
 * Arrête l'application si une variable est manquante ou invalide
 */
export function validateEnv(envVars: Record<string, string | undefined> = import.meta.env): EnvSchema {
  try {
    const env = envSchema.parse({
      VITE_API_URL: envVars.VITE_API_URL,
      VITE_ADMIN_API_URL: envVars.VITE_ADMIN_API_URL,
      VITE_FRONT_OFFICE_URL: envVars.VITE_FRONT_OFFICE_URL,
      VITE_GOOGLE_CLIENT_ID: envVars.VITE_GOOGLE_CLIENT_ID,
      NODE_ENV: envVars.NODE_ENV,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');

      console.error('❌ Configuration invalide - Variables d\'environnement manquantes ou incorrectes:');
      console.error(errors);
      console.error('\nVeuillez vérifier votre fichier .env ou .env.local');

      // Arrêter l'application avec un code d'erreur
      throw new Error(`Configuration invalide:\n${errors}`);
    }

    throw error;
  }
}

/**
 * Variables d'environnement validées
 * À utiliser dans toute l'application au lieu de import.meta.env direct
 */
export const env = validateEnv();

/**
 * Helper pour vérifier si on est en mode développement
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Helper pour vérifier si on est en mode production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper pour vérifier si on est en mode test
 */
export const isTest = env.NODE_ENV === 'test';
