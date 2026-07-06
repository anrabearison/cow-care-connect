import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface CattleSourceData {
  type: string;
  supplier?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  purchaseWeight?: number;
  purchaseHealthStatus?: string;
  purchaseNotes?: string;
  motherId?: string;
}

export interface CattleData {
  name: string;
  nickname?: string;
  gender: string;
  birthDate: string;
  character?: string;
  brand?: string;
  distinctiveSign?: string;
  photo?: string;
  photos?: {
    url: string;
    publicId?: string;
    position: number;
    isPrimary: boolean;
  }[];
  source: CattleSourceData;
  category?: string;
  ownerId?: string;
  herdBookId?: string;
}

export interface HerdBookCattle {
  id: string;
  herdBookId: string;
  herdBook?: { id: string; name: string };
  cattleId?: string;
  cattle?: { id: string; name: string; tagNumber: string };
  nCarnet?: string;
  categoryId: string;
  category?: { id: string; name: string };
  statusId: string;
  status?: { id: string; name: string };
  registrationNumber?: string;
  registrationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHerdBookCattleData {
  herdBookId: string;
  cattleId?: string;
  cattle?: CattleData;
  nCarnet?: string;
  categoryId: string;
  statusId?: string;
}

export interface UpdateHerdBookCattleData {
  herdBookId?: string;
  cattleId?: string;
  cattle?: CattleData;
  nCarnet?: string;
  categoryId?: string;
  statusId?: string;
}

class HerdBookCattleService {
  private readonly endpoint = API_ENDPOINTS.HERD_BOOK_CATTLE.BASE;

  async getHerdBookCattleList(filters?: {
    page?: number;
    per_page?: number;
    perPage?: number;
    q?: string;
    herd_book_id?: string;
    herdBookId?: string;
    cattle_id?: string;
    cattleId?: string;
  }): Promise<ApiResponse<HerdBookCattle[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: HerdBookCattle[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching herd book cattle list:', error);
      throw error;
    }
  }

  async getHerdBookCattleById(id: string): Promise<ApiResponse<HerdBookCattle>> {
    try {
      const result = await apiClient.get<HerdBookCattle>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching herd book cattle:', error);
      throw error;
    }
  }

  async createHerdBookCattle(data: CreateHerdBookCattleData): Promise<ApiResponse<HerdBookCattle>> {
    try {
      const result = await apiClient.post<HerdBookCattle>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Inscription créée avec succès',
      };
    } catch (error: any) {
      console.error('Error creating herd book cattle:', error);
      throw error;
    }
  }

  async updateHerdBookCattle(id: string, data: UpdateHerdBookCattleData): Promise<ApiResponse<HerdBookCattle>> {
    try {
      const result = await apiClient.put<HerdBookCattle>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Inscription mise à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating herd book cattle:', error);
      throw error;
    }
  }

  async deleteHerdBookCattle(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Inscription supprimée avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting herd book cattle:', error);
      throw error;
    }
  }
}

export const herdBookCattleService = new HerdBookCattleService();
