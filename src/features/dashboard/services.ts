import { apiClient } from '@/utils/apiClient';
import { API_ENDPOINTS } from '@/config/api';

export interface DashboardStats {
    totalCattle: number;
    healthyCattle: number;
    healthPercentage: number;
    totalEvents: number;
    totalTreatments: number;
    totalUsers: number;
    totalOwners: number;
    males: number;
    females: number;
}

class DashboardService {
    async getStatistics(): Promise<DashboardStats> {
        try {
            const stats = await apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
            return stats;
        } catch (error: unknown) {
            console.error('❌ Error fetching dashboard statistics:', error);
            throw error;
        }
    }
}

export const dashboardService = new DashboardService();
