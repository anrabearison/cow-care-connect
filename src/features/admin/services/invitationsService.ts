import { API_ENDPOINTS } from '@/config/api';
import { apiClient } from '@/utils/apiClient';

export interface InvitationCreateData {
  email: string;
  role: 'SUPER_ADMIN' | 'OWNER_ADMIN' | 'OWNER_USER';
  ownerId?: string;
}

export interface InvitationResponse {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'OWNER_ADMIN' | 'OWNER_USER';
  ownerId?: string;
  token: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
}

class InvitationsService {
  private readonly endpoint = API_ENDPOINTS.INVITATIONS.BASE;

  async createInvitation(data: InvitationCreateData): Promise<InvitationResponse> {
    try {
      return await apiClient.post<InvitationResponse>(this.endpoint, data);
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  }

  async getInvitations(filters?: { email?: string }): Promise<{ data: InvitationResponse[]; total: number }> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<InvitationResponse[]>(`${this.endpoint}${queryString}`);
      return {
        data: result || [],
        total: result?.length || 0,
      };
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
      throw error;
    }
  }

  async deleteInvitation(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error: any) {
      console.error('Error deleting invitation:', error);
      throw error;
    }
  }
}

export const invitationsService = new InvitationsService();
