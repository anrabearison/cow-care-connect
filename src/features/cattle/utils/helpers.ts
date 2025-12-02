/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth());

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
 * Get color class for category badge
 */
export const getCategoryColor = (name: string): string => {
    switch (name) {
        case 'Taureau':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Vache':
            return 'bg-pink-100 text-pink-800 border-pink-200';
        case 'Veau':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Zébu':
            return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

/**
 * Get gender icon
 */
export const getGenderIcon = (gender: string): string => {
    return gender === 'M' ? '♂️' : '♀️';
};

/**
 * Get color class for status badge
 */
export const getStatusColor = (statusName: string): string => {
    switch (statusName) {
        case 'Vivant':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Décédé':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'Vendu':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
