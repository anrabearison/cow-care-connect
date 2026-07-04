import { buildApiUrl } from '@/config/api';
import { ApiResponse } from '@/utils/apiClient';
import { TypeEvenement } from '@/features/events/types';
import { fetchWithAuth } from '@/utils/fetchUtils';
import { Medicament, Veterinarian, ReferenceItem } from '../types/references';

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
        return this.fetchData<TypeEvenement[]>('/api/v1/event-types', 'Erreur chargement types événements');
    }

    async getVeterinarians(): Promise<ApiResponse<Veterinarian[]>> {
        return this.fetchData<Veterinarian[]>('/api/v1/veterinarians', 'Erreur chargement vétérinaires');
    }

    async getMedicaments(): Promise<ApiResponse<Medicament[]>> {
        return this.fetchData<Medicament[]>('/api/v1/medicaments', 'Erreur chargement médicaments');
    }

    async getCategories(): Promise<ApiResponse<ReferenceItem[]>> {
        return this.fetchData<ReferenceItem[]>('/api/v1/categories', 'Erreur chargement catégories');
    }

    async getCharacters(): Promise<ApiResponse<ReferenceItem[]>> {
        return this.fetchData<ReferenceItem[]>('/api/v1/characters', 'Erreur chargement caractères');
    }

    async getStatuses(): Promise<ApiResponse<ReferenceItem[]>> {
        return this.fetchData<ReferenceItem[]>('/api/v1/status', 'Erreur chargement statuts');
    }

    async getHerdBooks(): Promise<ApiResponse<ReferenceItem[]>> {
        return this.fetchData<ReferenceItem[]>('/api/v1/herd-books', 'Erreur chargement livres de troupeau');
    }
}

export const referenceService = new ReferenceService();
