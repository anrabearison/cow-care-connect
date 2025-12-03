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
  category: {
    id: string;
    name: string;
  };
  brand?: string;
  herdBookNumber?: number;
  distinctiveSign?: string;
  photo?: string;
  status: {
    id: string;
    name: string;
  };
  source: {
    type: 'Acheté' | 'Né dans le troupeau';
    supplier?: string;
    purchaseDate?: string;
    purchaseCategory?: string;
    purchasePrice?: number;
    purchaseWeight?: number;
    purchaseHealthStatus?: string;
    purchaseNotes?: string;
    motherId?: string; // Changed from number to string
  };
  events: CattleEvent[];
  treatments: Treatment[];
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
  type: 'Antibiotique' | 'Vaccin' | 'Vermifuge' | 'Anti-inflammatoire' | 'Vitamine' | 'Autre';
  date: string;
  product: string; // ID du médicament
  dosage: string | {
    quantite: number;
    unite: string;
    animal_poids?: number;
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
  owner_id?: string; // New field
  is_active?: boolean; // New field
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