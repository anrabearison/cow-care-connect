export interface Cattle {
  id: number;
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
    motherId?: number;
  };
  events: CattleEvent[];
  treatments: Treatment[];
}

export interface CattleEvent {
  id: number;
  type: string; // ID du type d'événement
  date: string;
  description: string;
  details?: string;
}

export interface Treatment {
  id: number;
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

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'eleveur' | 'veterinaire';
}

export interface Character {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}