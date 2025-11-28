import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/api';

export interface DashboardStats {
    totalCattle: number;
    healthyCattle: number;
    healthPercentage: number;
    totalEvents: number;
    totalTreatments: number;
}

class DashboardService {
    private readonly endpoint = API_CONFIG.ENDPOINTS.CATTLE;

    async getStatistics(): Promise<DashboardStats> {
        try {

            const stats = await apiClient.get<DashboardStats>(`${this.endpoint}/statistics`);

            return stats;
        } catch (error: any) {
            console.error('❌ Error fetching dashboard statistics:', error);
            throw error;
        }
    }
}

export const dashboardService = new DashboardService();
