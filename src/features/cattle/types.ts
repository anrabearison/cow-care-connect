export interface Cattle {
  id: string; // Changed from number to string (UUID)
  name: string;
  nickname?: string;
  gender: 'M' | 'F';
  birthDate: string;
  character?: {
    id: string;
    name: string;
  };
  brand?: string;
  distinctiveSign?: string;
  photo?: string;
  photos?: CattlePhoto[];
  status?: {
    id: string;
    name: string;
  };
  nCarnet?: string;
  source: {
    type: 'ACHETE' | 'NE_DANS_TROUPEAU';
    supplier?: string;
    purchaseDate?: string;
    purchasePrice?: number;
    purchaseWeight?: number;
    purchaseHealthStatus?: string;
    purchaseNotes?: string;
  };
  motherId?: string;
  fatherId?: string;
  events: CattleEvent[];
  treatments: Treatment[];
  ownerId?: string;
}

export interface CattlePhoto {
  id?: string;
  url: string;
  publicId?: string;
  position: number;
  isPrimary: boolean;
}

// Type enrichi pour l'affichage avec informations du HerdBook
export interface CattleWithHerdBookInfo extends Cattle {
  // Informations du HerdBook courant (enrichies par le backend ou le frontend)
  nCarnet?: string;
  category: {
    id: string;
    name: string;
  };
  status: {
    id: string;
    name: string;
  };
  herd_book_year?: number;
}

export interface CattleEvent {
  id: string; // Changed from number to string
  type: string; // ID du type d'événement
  date: string;
  description: string;
  details?: string;
}

export interface Treatment {
  id: string; // Changed from number to string
  type: 'ANTIBIOTIQUE' | 'VACCIN' | 'VERMIFUGE' | 'ANTI_INFLAMMATOIRE' | 'VITAMINE' | 'AUTRE';
  date: string;
  product: string; // ID du médicament
  dosage: string | {
    quantity: number;
    unit: string;
    animalWeight?: number;
    notes?: string;
  };
  veterinarian: string; // ID de l'intervenant
  notes?: string;
}

import type { UserRole } from '@/constants/roles';

export interface User {
  id: string; // Changed from number to string
  name: string;
  email: string;
  role: UserRole; // Using imported type
  ownerId?: string; // New field
  owner?: Owner; // New field for full owner details
  isActive?: boolean; // New field
}

export interface Owner {
  id: string;
  name: string;
  contact_info?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}
