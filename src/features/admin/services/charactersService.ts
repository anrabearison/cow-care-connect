import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface Character {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterData {
  name: string;
  description?: string;
}

export interface UpdateCharacterData {
  name?: string;
  description?: string;
}

class CharactersService {
  private readonly endpoint = API_ENDPOINTS.CHARACTERS.BASE;

  async getCharactersList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<Character[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Character[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching characters list:', error);
      throw error;
    }
  }

  async getCharacterById(id: string): Promise<ApiResponse<Character>> {
    try {
      const result = await apiClient.get<Character>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching character:', error);
      throw error;
    }
  }

  async createCharacter(data: CreateCharacterData): Promise<ApiResponse<Character>> {
    try {
      const result = await apiClient.post<Character>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Caractère créé avec succès',
      };
    } catch (error: any) {
      console.error('Error creating character:', error);
      throw error;
    }
  }

  async updateCharacter(id: string, data: UpdateCharacterData): Promise<ApiResponse<Character>> {
    try {
      const result = await apiClient.put<Character>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Caractère mis à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating character:', error);
      throw error;
    }
  }

  async deleteCharacter(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Caractère supprimé avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting character:', error);
      throw error;
    }
  }
}

export const charactersService = new CharactersService();
