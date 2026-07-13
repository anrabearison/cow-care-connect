import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface HerdBook {
  id: string;
  reference: string;
  year: number;
  description?: string;
  ownerId?: string;
  owner?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateHerdBookData {
  reference: string;
  year: number;
  description?: string;
  ownerId?: string;
}

export interface UpdateHerdBookData {
  reference?: string;
  year?: number;
  description?: string;
  ownerId?: string;
}

class HerdBooksService {
  private readonly endpoint = API_ENDPOINTS.HERD_BOOKS.BASE;

  async getHerdBooksList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
    owner_id?: string;
  }): Promise<ApiResponse<HerdBook[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: HerdBook[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: unknown) {
      console.error('Error fetching herd books list:', error);
      throw error;
    }
  }

  async getHerdBookById(id: string): Promise<ApiResponse<HerdBook>> {
    try {
      const result = await apiClient.get<HerdBook>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: unknown) {
      console.error('Error fetching herd book:', error);
      throw error;
    }
  }

  async createHerdBook(data: CreateHerdBookData): Promise<ApiResponse<HerdBook>> {
    try {
      const result = await apiClient.post<HerdBook>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Livre de troupeau créé avec succès',
      };
    } catch (error: unknown) {
      console.error('Error creating herd book:', error);
      throw error;
    }
  }

  async updateHerdBook(id: string, data: UpdateHerdBookData): Promise<ApiResponse<HerdBook>> {
    try {
      const result = await apiClient.put<HerdBook>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Livre de troupeau mis à jour avec succès',
      };
    } catch (error: unknown) {
      console.error('Error updating herd book:', error);
      throw error;
    }
  }

  async deleteHerdBook(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Livre de troupeau supprimé avec succès',
      };
    } catch (error: unknown) {
      console.error('Error deleting herd book:', error);
      throw error;
    }
  }
}

export const herdBooksService = new HerdBooksService();
