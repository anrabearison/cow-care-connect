export interface Cattle {
  id: string;
  name: string;
  nickname?: string;
  gender: 'M' | 'F';
  birthDate: string;
  character: 'Docile' | 'Agressif' | 'Timide' | 'Energique';
  category: 'Taureau' | 'Veau' | 'Zébu' | 'Vache';
  brand?: string;
  distinctiveSign?: string;
  photo?: string;
  source: {
    type: 'Acheté' | 'Né dans le troupeau';
    supplier?: string;
    purchaseDate?: string;
    purchaseCategory?: 'Taureau' | 'Veau' | 'Zébu' | 'Vache';
    purchasePrice?: number;
    purchaseWeight?: number;
    purchaseHealthStatus?: string;
    purchaseNotes?: string;
    motherId?: string;
  };
  events: CattleEvent[];
  treatments: Treatment[];
}

export interface CattleEvent {
  id: string;
  type: string; // ID du type d'événement (ex: TE001, TE002, etc.)
  date: string;
  description: string;
  details?: string;
}

export interface Treatment {
  id: string;
  type: 'Antibiotique' | 'Vaccin' | 'Vermifuge' | 'Anti-inflammatoire' | 'Vitamine' | 'Autre';
  date: string;
  product: string; // ID du médicament
  dosage: string;
  veterinarian: string; // ID de l'intervenant
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'eleveur' | 'veterinaire';
}