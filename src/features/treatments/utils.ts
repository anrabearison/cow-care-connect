import { Veterinarian } from './types/veterinarian';
import { Medicament } from './types/medicament';

// Mock data des intervenants
export const mockVeterinarians: Veterinarian[] = [
  { 
    id: 'VET001', 
    nom: 'Dr. Marie Razafy',
    specialite: 'Vétérinaire généraliste',
    telephone: '+261 34 12 345 67',
    email: 'marie.razafy@vet.mg',
    adresse: 'Antananarivo',
    notes: 'Disponible du lundi au vendredi'
  },
  { 
    id: 'VET002', 
    nom: 'Dr. Paul Rakoto',
    specialite: 'Vétérinaire spécialiste bovins',
    telephone: '+261 33 98 765 43',
    email: 'paul.rakoto@vet.mg',
    adresse: 'Antsirabe',
    notes: 'Urgences 24/7'
  },
];

// Mock data des médicaments
export const mockMedicaments: Medicament[] = [
  { 
    id: 'MED001', 
    nom: 'Ivermectine',
    type: 'Vermifuge',
    dosageRecommande: '1 ml/50 kg',
    fabricant: 'VetPharma',
    notes: 'Traitement anti-parasitaire'
  },
  { 
    id: 'MED002', 
    nom: 'Pénicilline G',
    type: 'Antibiotique',
    dosageRecommande: '5 ml/100 kg',
    fabricant: 'MedVet',
    notes: 'Antibiotique à large spectre'
  },
  { 
    id: 'MED003', 
    nom: 'Vaccin FMD',
    type: 'Vaccin',
    dosageRecommande: '2 ml par animal',
    fabricant: 'BioVet',
    notes: 'Vaccin contre la fièvre aphteuse'
  },
];

export const getVeterinarianName = (vetId: string): string => {
  const vet = mockVeterinarians.find(v => v.id === vetId);
  return vet?.nom || vetId;
};

export const getMedicamentName = (medId: string): string => {
  const med = mockMedicaments.find(m => m.id === medId);
  return med?.nom || medId;
};
