import { z } from 'zod';

/**
 * Schéma de validation pour le formulaire d'import initial HerdBook
 * Correspond au DTO backend InitialImportHerdBookDto
 */
export const initialImportSchema = z.object({
  reference: z
    .string()
    .min(1, 'La référence est requise')
    .max(100, 'La référence ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-Z0-9-_]+$/, 'La référence ne peut contenir que des lettres, chiffres, tirets et underscores'),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  year: z
    .number()
    .int('L\'année doit être un entier')
    .min(2000, 'L\'année doit être supérieure ou égale à 2000')
    .max(2100, 'L\'année doit être inférieure ou égale à 2100'),
});

export type InitialImportFormData = z.infer<typeof initialImportSchema>;

/**
 * Schéma de validation pour les résultats de dry-run
 * Correspond au DTO backend DryRunResultDto
 */
export const dryRunResultSchema = z.object({
  valid: z.boolean(),
  totalRows: z.number(),
  validRowsCount: z.number(),
  errors: z.array(
    z.object({
      rowNumber: z.number(),
      field: z.string(),
      message: z.string(),
    })
  ),
});

export type DryRunResult = z.infer<typeof dryRunResultSchema>;

/**
 * Schéma de validation pour le résultat de confirmation
 * Correspond au DTO backend ImportConfirmResultDto
 */
export const importConfirmResultSchema = z.object({
  herdBookId: z.string(),
  cattleCount: z.number(),
});

export type ImportConfirmResult = z.infer<typeof importConfirmResultSchema>;
