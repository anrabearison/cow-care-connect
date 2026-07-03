import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface TreatmentDosage {
  quantity: number;
  unit: string;
  animalWeight?: number;
  notes?: string;
}

export interface Treatment {
  id: string;
  cattleId: string;
  cattle?: string | { id: string; name: string; tagNumber?: string };
  type: string | { id: string; name: string };
  date: string;
  product: string | { id: string; name: string };
  dosage: TreatmentDosage;
  administrationRoute?: string;
  veterinarian: string | { id: string; name: string };
  veterinarianObj?: { id: string; name: string };
  medicamentObj?: { id: string; name: string };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentData {
  cattleId: string;
  type: string;
  date: string;
  product: string;
  dosage: TreatmentDosage;
  administrationRoute?: string;
  veterinarian: string;
  notes?: string;
}

export interface UpdateTreatmentData {
  cattleId?: string;
  type?: string;
  date?: string;
  product?: string;
  dosage?: Partial<TreatmentDosage>;
  administrationRoute?: string;
  veterinarian?: string;
  notes?: string;
}

class TreatmentsService {
  private readonly endpoint = '/api/v1/treatments';

  async getTreatmentsList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
    cattle_id?: string;
    medicament_id?: string;
  }): Promise<ApiResponse<Treatment[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Treatment[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching treatments list:', error);
      throw error;
    }
  }

  async getTreatmentById(id: string): Promise<ApiResponse<Treatment>> {
    try {
      const result = await apiClient.get<Treatment>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching treatment:', error);
      throw error;
    }
  }

  async createTreatment(data: CreateTreatmentData): Promise<ApiResponse<Treatment>> {
    try {
      const result = await apiClient.post<Treatment>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Traitement créé avec succès',
      };
    } catch (error: any) {
      console.error('Error creating treatment:', error);
      throw error;
    }
  }

  async updateTreatment(id: string, data: UpdateTreatmentData): Promise<ApiResponse<Treatment>> {
    try {
      const result = await apiClient.put<Treatment>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Traitement mis à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating treatment:', error);
      throw error;
    }
  }

  async deleteTreatment(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Traitement supprimé avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting treatment:', error);
      throw error;
    }
  }
}

export const treatmentsService = new TreatmentsService();
