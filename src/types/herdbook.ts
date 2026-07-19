export interface HerdBook {
    id: string;
    year: number;
    reference: string;
    owner_id: string;
    description?: string;
    created_at: string;
    updated_at: string;
    cattle_count?: number; // Optionnel, pour affichage
}

export interface HerdBookCattle {
    id: string;
    herd_book_id: string;
    cattle_id: string;
    n_carnet: number;
    category_id: string;
    status_id: string;
    created_at: string;
    updated_at: string;
}

export interface HerdBookCattleWithDetails extends HerdBookCattle {
    category: {
        id: string;
        name: string;
    };
    status: {
        id: string;
        name: string;
    };
    cattle?: {
        id: string;
        name: string;
        nickname?: string;
        gender: 'M' | 'F';
        birthDate: string;
        photo?: string;
        character?: {
            id: string;
            name: string;
        };
    };
}

export interface Status {
    id: string;
    name: string;
}
