import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface Owner {
  id: string;
  name: string;
  email?: string;
  contactInfo?: string;
  phone?: string;
  address?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOwnerData {
  name: string;
  email?: string;
  contactInfo?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface UpdateOwnerData {
  name?: string;
  email?: string;
  contactInfo?: string;
  phone?: string;
  address?: string;
  city?: string;
}

class OwnersService {
  private readonly endpoint = API_ENDPOINTS.OWNERS.BASE;

  async getOwnersList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<Owner[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Owner[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: unknown) {
      console.error('Error fetching owners list:', error);
      throw error;
    }
  }

  async getOwnerById(id: string): Promise<ApiResponse<Owner>> {
    try {
      const result = await apiClient.get<Owner>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: unknown) {
      console.error('Error fetching owner:', error);
      throw error;
    }
  }

  async createOwner(data: CreateOwnerData): Promise<ApiResponse<Owner>> {
    try {
      const result = await apiClient.post<Owner>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Propriétaire créé avec succès',
      };
    } catch (error: unknown) {
      console.error('Error creating owner:', error);
      throw error;
    }
  }

  async updateOwner(id: string, data: UpdateOwnerData): Promise<ApiResponse<Owner>> {
    try {
      const result = await apiClient.put<Owner>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Propriétaire mis à jour avec succès',
      };
    } catch (error: unknown) {
      console.error('Error updating owner:', error);
      throw error;
    }
  }

  async deleteOwner(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Propriétaire supprimé avec succès',
      };
    } catch (error: unknown) {
      console.error('Error deleting owner:', error);
      throw error;
    }
  }
}

export const ownersService = new OwnersService();
