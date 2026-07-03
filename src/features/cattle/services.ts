import { Cattle, CattleEvent, Treatment } from './types';
import { API_CONFIG } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';
import { ErrorMessages } from '@/utils/errors';

export interface CattleFilters {
  q?: string;
  gender?: 'M' | 'F';
  character?: string;
  category?: string;
  source_type?: string;
  page?: number;
  per_page?: number;
}

class CattleService {
  private readonly endpoint = API_CONFIG.ENDPOINTS.CATTLE;

  /**
   * Transform cattle data before sending to API
   */
  private transformCattleData(data: any): any {
    const transformed = { ...data };

    // Transform objects {id, name} to simple ID
    if (transformed.character && typeof transformed.character === 'object') {
      transformed.character = transformed.character.id;
    }

    if (transformed.category && typeof transformed.category === 'object') {
      transformed.category = transformed.category.id;
    }

    // Remove status from payload as it is not accepted by backend on create/update
    if ('status' in transformed) {
      delete transformed.status;
    }

    // Remove source from payload for birth registration (backend sets it automatically)
    if ('source' in transformed) {
      delete transformed.source;
    }

    // Remove purchaseCategory from source if present (not supported by backend)
    if (transformed.source && 'purchaseCategory' in transformed.source) {
      delete transformed.source.purchaseCategory;
    }

    return transformed;
  }

  async getCattleList(filters?: CattleFilters): Promise<ApiResponse<Cattle[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Cattle[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching cattle list:', error);
      throw error;
    }
  }

  async getCattleById(id: string | number): Promise<ApiResponse<Cattle>> {
    try {
      const result = await apiClient.get<Cattle>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching cattle:', error);
      throw error;
    }
  }

  async createCattle(
    cattle: Omit<Cattle, 'id'>,
    herdBookId?: string,
    nCarnet?: string
  ): Promise<ApiResponse<Cattle>> {
    try {
      const payload = this.transformCattleData(cattle);

      // Build query params for herd book registration
      const params: Record<string, string> = {};
      if (herdBookId) params.herd_book_id = herdBookId;
      if (nCarnet) params.n_carnet = nCarnet;

      const queryString = Object.keys(params).length > 0
        ? '?' + new URLSearchParams(params).toString()
        : '';

      const result = await apiClient.post<Cattle>(`${this.endpoint}${queryString}`, payload);

      return {
        data: result,
        success: true,
        message: 'Bovin créé avec succès et inscrit dans le livre de troupeau',
      };
    } catch (error: any) {
      console.error('Error creating cattle:', error);
      throw error;
    }
  }

  async updateCattle(id: string, cattle: Partial<Cattle>): Promise<ApiResponse<Cattle>> {
    try {
      const payload = this.transformCattleData(cattle);
      const result = await apiClient.put<Cattle>(`${this.endpoint}/${id}`, payload);

      return {
        data: result,
        success: true,
        message: 'Bovin mis à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating cattle:', error);
      throw error;
    }
  }

  async deleteCattle(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Bovin supprimé avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting cattle:', error);
      throw error;
    }
  }

  async registerBirth(
    motherId: string,
    birthData: Omit<Cattle, 'id' | 'events' | 'treatments'>
  ): Promise<ApiResponse<Cattle>> {
    try {
      const payload = this.transformCattleData(birthData);
      const result = await apiClient.post<Cattle>(
        `${this.endpoint}/${motherId}/birth`,
        payload
      );

      return {
        data: result,
        success: true,
        message: 'Naissance enregistrée avec succès',
      };
    } catch (error: any) {
      console.error('Error registering birth:', error);
      throw error;
    }
  }

  async createEvent(cattleId: string, event: Omit<CattleEvent, 'id'>): Promise<ApiResponse<CattleEvent>> {
    try {
      const payload = {
        ...event,
        cattleId
      };
      const result = await apiClient.post<CattleEvent>(API_CONFIG.ENDPOINTS.EVENTS, payload);
      return {
        data: result,
        success: true,
        message: 'Événement créé avec succès'
      };
    } catch (error: any) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async createTreatment(cattleId: string, treatment: Omit<Treatment, 'id'>): Promise<ApiResponse<Treatment>> {
    try {
      const payload = {
        ...treatment,
        cattleId
      };
      const result = await apiClient.post<Treatment>(API_CONFIG.ENDPOINTS.TREATMENTS, payload);
      return {
        data: result,
        success: true,
        message: 'Traitement créé avec succès'
      };
    } catch (error: any) {
      console.error('Error creating treatment:', error);
      throw error;
    }
  }

  async getCharacters(): Promise<ApiResponse<{ id: string; name: string }[]>> {
    try {
      const result = await apiClient.get<{ id: string; name: string }[]>('/characters');

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }
}

export const cattleService = new CattleService();