import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface Event {
  id: string;
  cattleId: string;
  cattle?: { id: string; name: string; tagNumber: string };
  eventTypeId?: string;
  eventType?: { id: string; name: string };
  type?: string;
  date: string;
  description?: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  cattleId: string;
  eventTypeId?: string;
  type?: string;
  date: string;
  description: string;
  details?: string;
}

export interface UpdateEventData {
  cattleId?: string;
  eventTypeId?: string;
  type?: string;
  date?: string;
  description?: string;
  details?: string;
}

class EventsService {
  private readonly endpoint = API_ENDPOINTS.EVENTS.BASE;

  async getEventsList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
    cattle_id?: string;
    type_id?: string;
  }): Promise<ApiResponse<Event[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Event[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching events list:', error);
      throw error;
    }
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    try {
      const result = await apiClient.get<Event>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  async createEvent(data: CreateEventData): Promise<ApiResponse<Event>> {
    try {
      const result = await apiClient.post<Event>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Événement créé avec succès',
      };
    } catch (error: any) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(id: string, data: UpdateEventData): Promise<ApiResponse<Event>> {
    try {
      const result = await apiClient.put<Event>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Événement mis à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Événement supprimé avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

export const eventsService = new EventsService();
