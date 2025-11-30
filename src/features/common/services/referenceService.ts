import { API_CONFIG, buildApiUrl } from '@/config/api';
import { ApiResponse } from '@/features/cattle/services';
import { TypeEvenement } from '@/features/events/types';
import { fetchWithAuth } from '@/utils/fetchUtils';

export interface Veterinarian {
    id: string;
    nom: string;
    specialite?: string;
    telephone?: string;
    email?: string;
}

export interface Medicament {
    id: string;
    nom: string;
    type?: string;
    dosage?: {
        quantite: number;
        unite: string;
        poids?: number;
        unite_poids?: string;
        notes?: string;
    };
    dosage_recommande?: string;
    fabricant?: string;
}

class ReferenceService {
    private async fetchData<T>(endpoint: string, errorMessage: string): Promise<ApiResponse<T>> {
        try {
            const url = buildApiUrl(endpoint);
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return {
                data: result.data || result,
                success: true
            };
        } catch (error) {
            console.error(errorMessage, error);
            return { data: [] as any, success: false, message: errorMessage };
        }
    }

    async getEventTypes(): Promise<ApiResponse<TypeEvenement[]>> {
        return this.fetchData<TypeEvenement[]>('/api/event-types', 'Erreur chargement types événements');
    }

    async getVeterinarians(): Promise<ApiResponse<Veterinarian[]>> {
        return this.fetchData<Veterinarian[]>('/api/veterinarians', 'Erreur chargement vétérinaires');
    }

    async getMedicaments(): Promise<ApiResponse<Medicament[]>> {
        return this.fetchData<Medicament[]>('/api/medicaments', 'Erreur chargement médicaments');
    }

    async getCategories(): Promise<ApiResponse<{ id: string, name: string }[]>> {
        return this.fetchData<{ id: string, name: string }[]>('/api/categories', 'Erreur chargement catégories');
    }

    async getCharacters(): Promise<ApiResponse<{ id: string, name: string }[]>> {
        return this.fetchData<{ id: string, name: string }[]>('/api/characters', 'Erreur chargement caractères');
    }

    async getStatuses(): Promise<ApiResponse<{ id: string, name: string }[]>> {
        return this.fetchData<{ id: string, name: string }[]>('/api/status', 'Erreur chargement statuts');
    }
}

export const referenceService = new ReferenceService();
