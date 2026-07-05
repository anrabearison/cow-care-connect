import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface EventType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventTypeData {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateEventTypeData {
  name?: string;
  description?: string;
  icon?: string;
}

class EventTypesService {
  private readonly endpoint = API_ENDPOINTS.EVENT_TYPES.BASE;

  async getEventTypesList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<EventType[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: EventType[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching event types list:', error);
      throw error;
    }
  }

  async getEventTypeById(id: string): Promise<ApiResponse<EventType>> {
    try {
      const result = await apiClient.get<EventType>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching event type:', error);
      throw error;
    }
  }

  async createEventType(data: CreateEventTypeData): Promise<ApiResponse<EventType>> {
    try {
      const result = await apiClient.post<EventType>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: "Type d'événement créé avec succès",
      };
    } catch (error: any) {
      console.error('Error creating event type:', error);
      throw error;
    }
  }

  async updateEventType(id: string, data: UpdateEventTypeData): Promise<ApiResponse<EventType>> {
    try {
      const result = await apiClient.put<EventType>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: "Type d'événement mis à jour avec succès",
      };
    } catch (error: any) {
      console.error('Error updating event type:', error);
      throw error;
    }
  }

  async deleteEventType(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: "Type d'événement supprimé avec succès",
      };
    } catch (error: any) {
      console.error('Error deleting event type:', error);
      throw error;
    }
  }
}

export const eventTypesService = new EventTypesService();
