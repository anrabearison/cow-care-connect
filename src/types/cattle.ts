export interface Cattle {
  id: string;
  nom: string;
  genre: 'M' | 'F';
  dateNaissance: string;
  caractere: 'Docile' | 'Agressif' | 'Timide' | 'Energique';
  photo?: string;
  source: {
    type: 'Acheté' | 'Né dans le troupeau';
    fournisseur?: string;
    dateAchat?: string;
  };
  evenements: Event[];
  traitements: Treatment[];
}

export interface Event {
  id: string;
  type: 'Naissance' | 'Changement de pâturage' | 'Vaccination' | 'Visite vétérinaire' | 'Pesée' | 'Autre';
  date: string;
  description: string;
  details?: string;
}

export interface Treatment {
  id: string;
  type: 'Antibiotique' | 'Vaccin' | 'Vermifuge' | 'Anti-inflammatoire' | 'Autre';
  date: string;
  produit: string;
  dose: string;
  veterinaire: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'eleveur' | 'veterinaire';
}