export interface Dosage {
    quantity: number;
    unit: string;
    weight?: number;
    weightUnit?: string;
    notes?: string;
}

export interface Medicament {
    id: string;
    name: string;
    type?: string;
    dosage?: Dosage;
    manufacturer?: string;
}

export interface Veterinarian {
    id: string;
    name: string;
    specialty?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}

export interface ReferenceItem {
    id: string;
    name: string;
}
