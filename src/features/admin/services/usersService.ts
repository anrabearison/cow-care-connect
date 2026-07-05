import { API_ENDPOINTS } from '@/config/api';
import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'OWNER_ADMIN' | 'OWNER_USER';
  ownerId?: string;
  owner?: { id: string; name: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'OWNER_ADMIN' | 'OWNER_USER';
  ownerId?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'SUPER_ADMIN' | 'OWNER_ADMIN' | 'OWNER_USER';
  ownerId?: string;
  isActive?: boolean;
}

class UsersService {
  private readonly endpoint = API_ENDPOINTS.USERS.BASE;

  async getUsersList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
    owner_id?: string;
  }): Promise<ApiResponse<User[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: User[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching users list:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const result = await apiClient.get<User>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    try {
      const result = await apiClient.post<User>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Utilisateur créé avec succès',
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    try {
      const result = await apiClient.put<User>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Utilisateur mis à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Utilisateur supprimé avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const usersService = new UsersService();
