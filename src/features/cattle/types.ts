export interface Cattle {
  id: number;
  name: string;
  nickname?: string;
  gender: 'M' | 'F';
  birthDate: string;
  character: {
    id: number;
    name: string;
  };
  category: number;
  brand?: string;
  herdBookNumber?: number;
  distinctiveSign?: string;
  photo?: string;
  status: {
    id: number;
    name: string;
  };
  source: {
    type: 'Acheté' | 'Né dans le troupeau';
    supplier?: string;
    purchaseDate?: string;
    purchaseCategory?: number;
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
  type: number; // ID du type d'événement
  date: string;
  description: string;
  details?: string;
}

export interface Treatment {
  id: number;
  type: 'Antibiotique' | 'Vaccin' | 'Vermifuge' | 'Anti-inflammatoire' | 'Vitamine' | 'Autre';
  date: string;
  product: number; // ID du médicament
  dosage: string;
  veterinarian: number; // ID de l'intervenant
  notes?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'eleveur' | 'veterinaire';
}

export interface Character {
  id: number;
  name: string;
}