import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardStats } from '@/features/dashboard/services';
import { queryKeys } from '@/lib/queryKeys';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: queryKeys.dashboard.stats(null),
        queryFn: () => dashboardService.getStatistics(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
