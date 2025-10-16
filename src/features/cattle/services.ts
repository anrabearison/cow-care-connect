import { Cattle } from './types';
import { API_CONFIG, buildApiUrl } from '@/config/api';
import { mockCattleData } from '@/data/mockData';

export interface CattleFilters {
  search?: string;
  genre?: 'M' | 'F';
  caractere?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  success: boolean;
  message?: string;
}

class CattleService {
  async getCattleList(filters?: CattleFilters): Promise<ApiResponse<Cattle[]>> {
    if (API_CONFIG.USE_MOCK_DATA) {
      return this.getMockCattleList(filters);
    }
    
    return this.getApiCattleList(filters);
  }

  async getCattleById(id: string): Promise<ApiResponse<Cattle>> {
    if (API_CONFIG.USE_MOCK_DATA) {
      return this.getMockCattleById(id);
    }
    
    return this.getApiCattleById(id);
  }

  async createCattle(cattle: Omit<Cattle, 'id'>): Promise<ApiResponse<Cattle>> {
    if (API_CONFIG.USE_MOCK_DATA) {
      return this.createMockCattle(cattle);
    }
    
    return this.createApiCattle(cattle);
  }

  async updateCattle(id: string, cattle: Partial<Cattle>): Promise<ApiResponse<Cattle>> {
    if (API_CONFIG.USE_MOCK_DATA) {
      return this.updateMockCattle(id, cattle);
    }
    
    return this.updateApiCattle(id, cattle);
  }

  async deleteCattle(id: string): Promise<ApiResponse<boolean>> {
    if (API_CONFIG.USE_MOCK_DATA) {
      return this.deleteMockCattle(id);
    }
    
    return this.deleteApiCattle(id);
  }

  // Méthodes pour les données mockées
  private async getMockCattleList(filters?: CattleFilters): Promise<ApiResponse<Cattle[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredData = [...mockCattleData];
        
        if (filters?.search) {
          filteredData = filteredData.filter(cattle =>
            cattle.nom.toLowerCase().includes(filters.search!.toLowerCase()) ||
            cattle.id.toLowerCase().includes(filters.search!.toLowerCase())
          );
        }
        
        if (filters?.genre) {
          filteredData = filteredData.filter(cattle => cattle.genre === filters.genre);
        }
        
        if (filters?.caractere) {
          filteredData = filteredData.filter(cattle => cattle.caractere === filters.caractere);
        }
        
        if (filters?.limit) {
          const offset = filters.offset || 0;
          filteredData = filteredData.slice(offset, offset + filters.limit);
        }
        
        resolve({
          data: filteredData,
          total: mockCattleData.length,
          success: true
        });
      }, 300); // Simule la latence réseau
    });
  }

  private async getMockCattleById(id: string): Promise<ApiResponse<Cattle>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cattle = mockCattleData.find(c => c.id === id);
        if (cattle) {
          resolve({
            data: cattle,
            success: true
          });
        } else {
          resolve({
            data: {} as Cattle,
            success: false,
            message: 'Bovin non trouvé'
          });
        }
      }, 200);
    });
  }

  private async createMockCattle(cattle: Omit<Cattle, 'id'>): Promise<ApiResponse<Cattle>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCattle: Cattle = {
          ...cattle,
          id: `B${String(mockCattleData.length + 1).padStart(3, '0')}`
        };
        
        mockCattleData.push(newCattle);
        
        resolve({
          data: newCattle,
          success: true,
          message: 'Bovin créé avec succès'
        });
      }, 500);
    });
  }

  private async updateMockCattle(id: string, cattle: Partial<Cattle>): Promise<ApiResponse<Cattle>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCattleData.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCattleData[index] = { ...mockCattleData[index], ...cattle };
          resolve({
            data: mockCattleData[index],
            success: true,
            message: 'Bovin mis à jour avec succès'
          });
        } else {
          resolve({
            data: {} as Cattle,
            success: false,
            message: 'Bovin non trouvé'
          });
        }
      }, 400);
    });
  }

  private async deleteMockCattle(id: string): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCattleData.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCattleData.splice(index, 1);
          resolve({
            data: true,
            success: true,
            message: 'Bovin supprimé avec succès'
          });
        } else {
          resolve({
            data: false,
            success: false,
            message: 'Bovin non trouvé'
          });
        }
      }, 300);
    });
  }

  // Méthodes pour les vraies APIs
  private async getApiCattleList(filters?: CattleFilters): Promise<ApiResponse<Cattle[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.genre) params.append('genre', filters.genre);
      if (filters?.caractere) params.append('caractere', filters.caractere);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.CATTLE)}?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        data: result.data || result,
        total: result.total,
        success: true
      };
    } catch (error) {
      console.error('Error fetching cattle list:', error);
      return {
        data: [],
        success: false,
        message: 'Erreur lors du chargement de la liste des bovins'
      };
    }
  }

  private async getApiCattleById(id: string): Promise<ApiResponse<Cattle>> {
    try {
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.CATTLE}/${id}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        data: result.data || result,
        success: true
      };
    } catch (error) {
      console.error('Error fetching cattle:', error);
      return {
        data: {} as Cattle,
        success: false,
        message: 'Erreur lors du chargement du bovin'
      };
    }
  }

  private async createApiCattle(cattle: Omit<Cattle, 'id'>): Promise<ApiResponse<Cattle>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.CATTLE);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cattle),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        data: result.data || result,
        success: true,
        message: 'Bovin créé avec succès'
      };
    } catch (error) {
      console.error('Error creating cattle:', error);
      return {
        data: {} as Cattle,
        success: false,
        message: 'Erreur lors de la création du bovin'
      };
    }
  }

  private async updateApiCattle(id: string, cattle: Partial<Cattle>): Promise<ApiResponse<Cattle>> {
    try {
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.CATTLE}/${id}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cattle),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        data: result.data || result,
        success: true,
        message: 'Bovin mis à jour avec succès'
      };
    } catch (error) {
      console.error('Error updating cattle:', error);
      return {
        data: {} as Cattle,
        success: false,
        message: 'Erreur lors de la mise à jour du bovin'
      };
    }
  }

  private async deleteApiCattle(id: string): Promise<ApiResponse<boolean>> {
    try {
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.CATTLE}/${id}`);
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return {
        data: true,
        success: true,
        message: 'Bovin supprimé avec succès'
      };
    } catch (error) {
      console.error('Error deleting cattle:', error);
      return {
        data: false,
        success: false,
        message: 'Erreur lors de la suppression du bovin'
      };
    }
  }
}

export const cattleService = new CattleService();