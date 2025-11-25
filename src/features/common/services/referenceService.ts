import { API_CONFIG, buildApiUrl } from '@/config/api';
import { ApiResponse } from '@/features/cattle/services';
import { TypeEvenement } from '@/features/events/types';
import { fetchWithAuth } from '@/utils/fetchUtils';

export interface Veterinarian {
    id: number;
    nom: string;
    specialite?: string;
    telephone?: string;
    email?: string;
}

export interface Medicament {
    id: number;
    nom: string;
    type?: string;
    dosage_recommande?: string;
    fabricant?: string;
}

class ReferenceService {
    async getEventTypes(): Promise<ApiResponse<TypeEvenement[]>> {
        try {
            const url = buildApiUrl('/api/event-types');
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return {
                data: result.data || result,
                success: true
            };
        } catch (error) {
            console.error('Error fetching event types:', error);
            return { data: [], success: false, message: 'Erreur chargement types événements' };
        }
    }

    async getVeterinarians(): Promise<ApiResponse<Veterinarian[]>> {
        try {
            const url = buildApiUrl('/api/veterinarians');
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return {
                data: result.data || result,
                success: true
            };
        } catch (error) {
            console.error('Error fetching veterinarians:', error);
            return { data: [], success: false, message: 'Erreur chargement vétérinaires' };
        }
    }

    async getMedicaments(): Promise<ApiResponse<Medicament[]>> {
        try {
            const url = buildApiUrl('/api/medicaments');
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return {
                data: result.data || result,
                success: true
            };
        } catch (error) {
            console.error('Error fetching medicaments:', error);
            return { data: [], success: false, message: 'Erreur chargement médicaments' };
        }
    }

    async getCategories(): Promise<ApiResponse<{ id: number, name: string }[]>> {
        try {
            const url = buildApiUrl('/api/categories');
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return {
                data: result.data || result,
                success: true
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { data: [], success: false, message: 'Erreur chargement catégories' };
        }
    }

    async getStatuses(): Promise<ApiResponse<{ id: number, name: string }[]>> {
        try {
            const url = buildApiUrl('/api/status');
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return {
                data: result.data || result,
                success: true
            };
        } catch (error) {
            console.error('Error fetching statuses:', error);
            return { data: [], success: false, message: 'Erreur chargement statuts' };
        }
    }
}

export const referenceService = new ReferenceService();
