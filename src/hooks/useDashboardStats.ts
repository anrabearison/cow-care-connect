import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardStats } from '@/features/dashboard/services';
import { useOwnerSelection } from '@/contexts/OwnerSelectionContext';
import { queryKeys } from '@/lib/queryKeys';

export const useDashboardStats = () => {
    const { selectedOwnerId } = useOwnerSelection();

    return useQuery({
        queryKey: queryKeys.dashboard.stats(selectedOwnerId),
        queryFn: () => dashboardService.getStatistics(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
