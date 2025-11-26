import { TypeEvenement } from './types';

// Types d'événements
export const typeEvenements: TypeEvenement[] = [
  { id: 'TE001', nom: 'Naissance', description: 'Naissance d\'un veau', icone: '🐄' },
  { id: 'TE002', nom: 'Vaccination', description: 'Vaccination du bétail', icone: '💉' },
  { id: 'TE003', nom: 'Vente', description: 'Vente d\'un bovin', icone: '💰' },
  { id: 'TE004', nom: 'Achat', description: 'Achat d\'un bovin', icone: '🛒' },
  { id: 'TE005', nom: 'Maladie', description: 'Diagnostic d\'une maladie', icone: '🤒' },
  { id: 'TE006', nom: 'Sevrage', description: 'Sevrage d\'un veau', icone: '🍼' },
  { id: 'TE007', nom: 'Saillie', description: 'Reproduction', icone: '❤️' },
  { id: 'TE008', nom: 'Pesée', description: 'Pesée du bétail', icone: '⚖️' },
];

export const getTypeEvenementName = (typeId: string): string => {
  const type = typeEvenements.find(t => t.id === typeId);
  return type?.nom || typeId;
};

export const getTypeEvenementIcon = (typeId: string): string => {
  const type = typeEvenements.find(t => t.id === typeId);
  return type?.icone || '📋';
};
