import { useQuery } from '@tanstack/react-query';
import { dashboardService, PlatformDashboardStats } from '@/features/dashboard/services';
import { queryKeys } from '@/lib/queryKeys';

export const usePlatformDashboardStats = () => {
    return useQuery({
        queryKey: queryKeys.dashboard.platformStats(),
        queryFn: () => dashboardService.getPlatformStatistics(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
