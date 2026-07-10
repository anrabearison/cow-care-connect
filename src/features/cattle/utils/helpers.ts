/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate: string): string => {
    if (!birthDate) return 'Âge inconnu';
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return 'Date invalide';

    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth());

    if (ageInMonths < 0) return 'Nouveau-né';

    if (ageInMonths < 12) {
        return `${ageInMonths} mois`;
    } else {
        const years = Math.floor(ageInMonths / 12);
        return `${years} an${years > 1 ? 's' : ''}`;
    }
};

/**
 * Get color class for character badge
 */
export const getCharacterColor = (character: string): string => {
    switch (character) {
        case 'Docile':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Agressif':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'Timide':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Energique':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

/**
 * Get gender icon
 */
export const getGenderIcon = (gender: string): string => {
    return gender === 'M' ? '♂' : '♀';
};

/**
 * Get color class for status badge
 */
export const getStatusColor = (statusIdentifier: string): string => {
    // Handle both IDs and names for backward compatibility if needed, but prefer IDs
    switch (statusIdentifier) {
        case 'STAT001': // Vivant
        case 'Vivant':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'STAT002': // Mort
        case 'Mort':
        case 'Décédé':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'STAT003': // Vendu
        case 'Vendu':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'STAT004': // En bonne santé
        case 'En bonne santé':
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
