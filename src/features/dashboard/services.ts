import { apiClient } from '@/utils/apiClient';
import { API_ENDPOINTS } from '@/config/api';

export interface DashboardStats {
    totalCattle: number;
    healthyCattle: number;
    healthPercentage: number;
    totalEvents: number;
    totalTreatments: number;
    males: number;
    females: number;
}

export interface PlatformDashboardStats {
    totalOwners: number;
    totalUsers: number;
    totalPendingInvitations: number;
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

    async getPlatformStatistics(): Promise<PlatformDashboardStats> {
        try {
            const stats = await apiClient.get<PlatformDashboardStats>(API_ENDPOINTS.DASHBOARD.STATS_PLATFORM);
            return stats;
        } catch (error: unknown) {
            console.error('❌ Error fetching platform dashboard statistics:', error);
            throw error;
        }
    }
}

export const dashboardService = new DashboardService();
