import { Cattle } from './types';
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

    if (transformed.status && typeof transformed.status === 'object') {
      transformed.status = transformed.status.id;
    }

    // Handle nested source fields
    if (transformed.source?.purchaseCategory && typeof transformed.source.purchaseCategory === 'object') {
      transformed.source.purchaseCategory = transformed.source.purchaseCategory.id;
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

  async createCattle(cattle: Omit<Cattle, 'id'>): Promise<ApiResponse<Cattle>> {
    try {
      const payload = this.transformCattleData(cattle);
      const result = await apiClient.post<Cattle>(this.endpoint, payload);

      return {
        data: result,
        success: true,
        message: 'Bovin créé avec succès',
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