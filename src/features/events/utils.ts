import { TypeEvenement } from './types';

/** Libellé d'un type d'événement (API: `name`, ancien mock: `nom`) */
export const getEventTypeLabel = (
  eventType: Pick<TypeEvenement, 'id' | 'name'> & { nom?: string },
): string => eventType.name ?? eventType.nom ?? eventType.id;

/**
 * Table de correspondance : noms d'icônes textuels (stockés en base)
 * → vrais caractères emoji. Assure la rétro-compatibilité avec les anciennes
 * données seedées avant l'adoption des emojis natifs.
 */
const ICON_NAME_TO_EMOJI: Record<string, string> = {
  baby:    '👶',
  syringe: '💉',
  scale:   '⚖️',
  heart:   '❤️',
  home:    '🏠',
  medkit:  '🩺',
  cart:    '🛒',
  pill:    '💊',
  stethoscope: '🩺',
  thermometer: '🌡️',
};

/**
 * Résout une valeur `icone` stockée en base vers un emoji affichable.
 * - Si la valeur est déjà un emoji (ou contient un caractère non-ASCII), elle
 *   est retournée telle quelle.
 * - Si la valeur correspond à un nom connu dans ICON_NAME_TO_EMOJI, l'emoji
 *   correspondant est retourné.
 * - Sinon, l'emoji par défaut est retourné.
 */
export const resolveIconEmoji = (icone: string | null | undefined, defaultEmoji = '📝'): string => {
  if (!icone) return defaultEmoji;
  // Si la chaîne contient au moins un caractère non-ASCII, c'est déjà un emoji
  if (/[^\x00-\x7F]/.test(icone)) return icone;
  return ICON_NAME_TO_EMOJI[icone.toLowerCase()] ?? defaultEmoji;
};

// Types d'événements (fallback local si l'API est indisponible)
export const typeEvenements: TypeEvenement[] = [
  { id: 'TE001', name: 'Naissance', description: 'Naissance d\'un veau', icone: '🐄' },
  { id: 'TE002', name: 'Vaccination', description: 'Vaccination du bétail', icone: '💉' },
  { id: 'TE003', name: 'Vente', description: 'Vente d\'un bovin', icone: '💰' },
  { id: 'TE004', name: 'Achat', description: 'Achat d\'un bovin', icone: '🛒' },
  { id: 'TE005', name: 'Maladie', description: 'Diagnostic d\'une maladie', icone: '🤒' },
  { id: 'TE006', name: 'Sevrage', description: 'Sevrage d\'un veau', icone: '🍼' },
  { id: 'TE007', name: 'Saillie', description: 'Reproduction', icone: '❤️' },
  { id: 'TE008', name: 'Pesée', description: 'Pesée du bétail', icone: '⚖️' },
];

export const getTypeEvenementName = (typeId: string): string => {
  const type = typeEvenements.find(t => t.id === typeId);
  return type ? getEventTypeLabel(type) : typeId;
};

export const getTypeEvenementIcon = (typeId: string): string => {
  const type = typeEvenements.find(t => t.id === typeId);
  return resolveIconEmoji(type?.icone, '📋');
};
