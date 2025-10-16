export interface Cattle {
  id: string;
  nom: string;
  genre: 'M' | 'F';
  dateNaissance: string;
  caractere: 'Docile' | 'Agressif' | 'Timide' | 'Energique';
  categorie: 'Taureau' | 'Veau' | 'Zébu' | 'Vache';
  photo?: string;
  source: {
    type: 'Acheté' | 'Né dans le troupeau';
    fournisseur?: string;
    dateAchat?: string;
    categorieAchat?: 'Taureau' | 'Veau' | 'Zébu' | 'Vache';
    prixAchat?: number;
    poidsAchat?: number;
    etatSanteAchat?: string;
    remarquesAchat?: string;
  };
  evenements: CattleEvent[];
  traitements: Treatment[];
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
  produit: string; // ID du médicament
  dose: string;
  veterinaire: string; // ID de l'intervenant
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'eleveur' | 'veterinaire';
}