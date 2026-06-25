import { TypeEvenement } from './types';

/** Libellé d'un type d'événement (API: `name`, ancien mock: `nom`) */
export const getEventTypeLabel = (
  eventType: Pick<TypeEvenement, 'id' | 'name'> & { nom?: string },
): string => eventType.name ?? eventType.nom ?? eventType.id;

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
  return type?.icone || '📋';
};
