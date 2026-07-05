import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface Medicament {
  id: string;
  name: string;
  type: string;
  dosageQuantity?: number;
  dosageUnit?: string;
  dosageWeight?: number;
  dosageWeightUnit?: string;
  dosageNotes?: string;
  defaultRoute?: string;
  withdrawalPeriodMeat?: number;
  withdrawalPeriodMilk?: number;
  manufacturer?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicamentData {
  name: string;
  type: string;
  dosageQuantity?: number;
  dosageUnit?: string;
  dosageWeight?: number;
  dosageWeightUnit?: string;
  dosageNotes?: string;
  defaultRoute?: string;
  withdrawalPeriodMeat?: number;
  withdrawalPeriodMilk?: number;
  manufacturer?: string;
  notes?: string;
}

export interface UpdateMedicamentData {
  name?: string;
  type?: string;
  dosageQuantity?: number;
  dosageUnit?: string;
  dosageWeight?: number;
  dosageWeightUnit?: string;
  dosageNotes?: string;
  defaultRoute?: string;
  withdrawalPeriodMeat?: number;
  withdrawalPeriodMilk?: number;
  manufacturer?: string;
  notes?: string;
}

class MedicamentsService {
  private readonly endpoint = API_ENDPOINTS.MEDICAMENTS.BASE;

  async getMedicamentsList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<Medicament[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Medicament[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching medicaments list:', error);
      throw error;
    }
  }

  async getMedicamentById(id: string): Promise<ApiResponse<Medicament>> {
    try {
      const result = await apiClient.get<Medicament>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching medicament:', error);
      throw error;
    }
  }

  async createMedicament(data: CreateMedicamentData): Promise<ApiResponse<Medicament>> {
    try {
      const result = await apiClient.post<Medicament>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Médicament créé avec succès',
      };
    } catch (error: any) {
      console.error('Error creating medicament:', error);
      throw error;
    }
  }

  async updateMedicament(id: string, data: UpdateMedicamentData): Promise<ApiResponse<Medicament>> {
    try {
      const result = await apiClient.put<Medicament>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Médicament mis à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating medicament:', error);
      throw error;
    }
  }

  async deleteMedicament(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Médicament supprimé avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting medicament:', error);
      throw error;
    }
  }
}

export const medicamentsService = new MedicamentsService();
