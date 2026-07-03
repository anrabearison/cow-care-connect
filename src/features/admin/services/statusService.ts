import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface Status {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStatusData {
  id: string;
  name: string;
  description?: string;
}

export interface UpdateStatusData {
  name?: string;
  description?: string;
}

class StatusService {
  private readonly endpoint = '/api/v1/status';

  async getStatusList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<Status[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Status[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching status list:', error);
      throw error;
    }
  }

  async getStatusById(id: string): Promise<ApiResponse<Status>> {
    try {
      const result = await apiClient.get<Status>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching status:', error);
      throw error;
    }
  }

  async createStatus(data: CreateStatusData): Promise<ApiResponse<Status>> {
    try {
      const result = await apiClient.post<Status>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Statut créé avec succès',
      };
    } catch (error: any) {
      console.error('Error creating status:', error);
      throw error;
    }
  }

  async updateStatus(id: string, data: UpdateStatusData): Promise<ApiResponse<Status>> {
    try {
      const result = await apiClient.put<Status>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Statut mis à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating status:', error);
      throw error;
    }
  }

  async deleteStatus(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Statut supprimé avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting status:', error);
      throw error;
    }
  }
}

export const statusService = new StatusService();
