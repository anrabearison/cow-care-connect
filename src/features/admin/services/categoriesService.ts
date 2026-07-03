import { apiClient, ApiResponse } from '@/utils/apiClient';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  id: string;
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

class CategoriesService {
  private readonly endpoint = '/api/v1/categories';

  async getCategoriesList(filters?: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<Category[]>> {
    try {
      const queryString = apiClient.buildQueryString(filters || {});
      const result = await apiClient.get<{ data: Category[]; total: number }>(
        `${this.endpoint}${queryString}`
      );

      return {
        data: result.data || [],
        total: result.total,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching categories list:', error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    try {
      const result = await apiClient.get<Category>(`${this.endpoint}/${id}`);

      return {
        data: result,
        success: true,
      };
    } catch (error: any) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async createCategory(data: CreateCategoryData): Promise<ApiResponse<Category>> {
    try {
      const result = await apiClient.post<Category>(this.endpoint, data);

      return {
        data: result,
        success: true,
        message: 'Catégorie créée avec succès',
      };
    } catch (error: any) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, data: UpdateCategoryData): Promise<ApiResponse<Category>> {
    try {
      const result = await apiClient.put<Category>(`${this.endpoint}/${id}`, data);

      return {
        data: result,
        success: true,
        message: 'Catégorie mise à jour avec succès',
      };
    } catch (error: any) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);

      return {
        data: true,
        success: true,
        message: 'Catégorie supprimée avec succès',
      };
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();
