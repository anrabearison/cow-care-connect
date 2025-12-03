import { Treatment } from '../types';

/**
 * Format a dosage value for display.
 * Handles both string and structured object formats.
 * 
 * @param dosage - The dosage value (string or object)
 * @returns Formatted dosage string
 */
export const formatDosage = (dosage: Treatment['dosage']): string => {
    if (typeof dosage === 'string') return dosage;
    if (!dosage) return '-';

    let text = `${dosage.quantite}${dosage.unite}`;
    if (dosage.animal_poids) {
        text += ` (pour ${dosage.animal_poids}kg)`;
    }
    return text;
};
