import { Cattle } from './types';
import { API_CONFIG, buildApiUrl } from '@/config/api';

import { fetchWithAuth } from '@/utils/fetchUtils';

export interface CattleFilters {
  search?: string;
  genre?: 'M' | 'F';
  caractere?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  success: boolean;
  message?: string;
}

class CattleService {
  async getCattleList(filters?: CattleFilters): Promise<ApiResponse<Cattle[]>> {
    return this.getApiCattleList(filters);
  }

  async getCattleById(id: number): Promise<ApiResponse<Cattle>> {
    return this.getApiCattleById(id);
  }

  async createCattle(cattle: Omit<Cattle, 'id'>): Promise<ApiResponse<Cattle>> {
    return this.createApiCattle(cattle);
  }

  async updateCattle(id: number, cattle: Partial<Cattle>): Promise<ApiResponse<Cattle>> {
    return this.updateApiCattle(id, cattle);
  }

  async deleteCattle(id: number): Promise<ApiResponse<boolean>> {
    return this.deleteApiCattle(id);
  }



  // Méthodes pour les vraies APIs
  private async getApiCattleList(filters?: CattleFilters): Promise<ApiResponse<Cattle[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.genre) params.append('genre', filters.genre);
      if (filters?.caractere) params.append('caractere', filters.caractere);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.CATTLE)}?${params}`;
      const response = await fetchWithAuth(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.data || result,
        total: result.total,
        success: true
      };
    } catch (error) {
      console.error('Error fetching cattle list:', error);
      return {
        data: [],
        success: false,
        message: 'Erreur lors du chargement de la liste des bovins'
      };
    }
  }

  private async getApiCattleById(id: number): Promise<ApiResponse<Cattle>> {
    try {
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.CATTLE}/${id}`);
      const response = await fetchWithAuth(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.data || result,
        success: true
      };
    } catch (error) {
      console.error('Error fetching cattle:', error);
      return {
        data: {} as Cattle,
        success: false,
        message: 'Erreur lors du chargement du bovin'
      };
    }
  }

  // Helper pour transformer les données avant l'envoi
  private transformCattleData(data: any): any {
    const transformed = { ...data };

    // Transformer les objets {id, name} en ID simple
    if (transformed.character && typeof transformed.character === 'object') {
      transformed.character = transformed.character.id;
    }

    if (transformed.category && typeof transformed.category === 'object') {
      transformed.category = transformed.category.id;
    }

    if (transformed.status && typeof transformed.status === 'object') {
      transformed.status = transformed.status.id;
    }

    // Gérer les champs nested dans source
    if (transformed.source) {
      if (transformed.source.purchaseCategory && typeof transformed.source.purchaseCategory === 'object') {
        transformed.source.purchaseCategory = transformed.source.purchaseCategory.id;
      }
    }

    return transformed;
  }

  private async createApiCattle(cattle: Omit<Cattle, 'id'>): Promise<ApiResponse<Cattle>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.CATTLE);
      const payload = this.transformCattleData(cattle);

      const response = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.data || result,
        success: true,
        message: 'Bovin créé avec succès'
      };
    } catch (error) {
      console.error('Error creating cattle:', error);
      return {
        data: {} as Cattle,
        success: false,
        message: 'Erreur lors de la création du bovin'
      };
    }
  }

  private async updateApiCattle(id: number, cattle: Partial<Cattle>): Promise<ApiResponse<Cattle>> {
    try {
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.CATTLE}/${id}`);
      const payload = this.transformCattleData(cattle);

      const response = await fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.data || result,
        success: true,
        message: 'Bovin mis à jour avec succès'
      };
    } catch (error) {
      console.error('Error updating cattle:', error);
      return {
        data: {} as Cattle,
        success: false,
        message: 'Erreur lors de la mise à jour du bovin'
      };
    }
  }

  private async deleteApiCattle(id: number): Promise<ApiResponse<boolean>> {
    try {
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.CATTLE}/${id}`);
      const response = await fetchWithAuth(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        data: true,
        success: true,
        message: 'Bovin supprimé avec succès'
      };
    } catch (error) {
      console.error('Error deleting cattle:', error);
      return {
        data: false,
        success: false,
        message: 'Erreur lors de la suppression du bovin'
      };
    }
  }

  async registerBirth(motherId: number, birthData: Omit<Cattle, 'id' | 'events' | 'treatments'>): Promise<ApiResponse<Cattle>> {


    try {
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.CATTLE}/${motherId}/birth`);
      const payload = this.transformCattleData(birthData);

      const response = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.data || result,
        success: true,
        message: 'Naissance enregistrée avec succès'
      };
    } catch (error) {
      console.error('Error registering birth:', error);
      return {
        data: {} as Cattle,
        success: false,
        message: "Erreur lors de l'enregistrement de la naissance"
      };
    }
  }

  async getCharacters(): Promise<ApiResponse<{ id: number; name: string }[]>> {
    try {
      const url = buildApiUrl('/characters');
      const response = await fetchWithAuth(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result,
        success: true
      };
    } catch (error) {
      console.error('Error fetching characters:', error);
      return {
        data: [],
        success: false,
        message: 'Erreur lors du chargement des caractères'
      };
    }
  }
}

export const cattleService = new CattleService();