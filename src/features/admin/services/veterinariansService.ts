import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface Veterinarian {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  specialty?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVeterinarianData {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  specialty?: string;
}

export interface UpdateVeterinarianData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  specialty?: string;
}

class VeterinariansService {
  private readonly endpoint = API_ENDPOINTS.VETERINARIANS.BASE;

  async getVeterinariansList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<Veterinarian[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Veterinarian[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: unknown) {
      console.error('Error fetching veterinarians list:', error);
      throw error;
    }
  }

  async getVeterinarianById(id: string): Promise<ApiResponse<Veterinarian>> {
    try {
      const result = await apiClient.get<Veterinarian>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: unknown) {
      console.error('Error fetching veterinarian:', error);
      throw error;
    }
  }

  async createVeterinarian(data: CreateVeterinarianData): Promise<ApiResponse<Veterinarian>> {
    try {
      const result = await apiClient.post<Veterinarian>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Vétérinaire créé avec succès',
      };
    } catch (error: unknown) {
      console.error('Error creating veterinarian:', error);
      throw error;
    }
  }

  async updateVeterinarian(id: string, data: UpdateVeterinarianData): Promise<ApiResponse<Veterinarian>> {
    try {
      const result = await apiClient.put<Veterinarian>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Vétérinaire mis à jour avec succès',
      };
    } catch (error: unknown) {
      console.error('Error updating veterinarian:', error);
      throw error;
    }
  }

  async deleteVeterinarian(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Vétérinaire supprimé avec succès',
      };
    } catch (error: unknown) {
      console.error('Error deleting veterinarian:', error);
      throw error;
    }
  }
}

export const veterinariansService = new VeterinariansService();
