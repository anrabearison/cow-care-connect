export interface Dosage {
    quantite: number;
    unite: string;
    poids?: number;
    unite_poids?: string;
    notes?: string;
}

export interface Medicament {
    id: string;
    name: string;
    type?: string;
    dosage?: Dosage;
    dosage_recommande?: string;
    fabricant?: string;
}

export interface Veterinarian {
    id: string;
    name: string;
    specialite?: string;
    telephone?: string;
    email?: string;
}

export interface ReferenceItem {
    id: string;
    name: string;
}
