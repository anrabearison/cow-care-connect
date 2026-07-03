import { useState, useEffect } from 'react';
import { dashboardService, DashboardStats } from '@/features/dashboard/services';
import { useOwnerSelection } from '@/contexts/OwnerSelectionContext';

export const useDashboardStats = () => {
    const { selectedOwnerId } = useOwnerSelection();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {

                setIsLoading(true);
                const data = await dashboardService.getStatistics();

                setStats(data);
                setError(null);
            } catch (err: any) {
                console.error('❌ useDashboardStats: Failed to fetch:', err);
                setError(err);
            } finally {
                setIsLoading(false);

            }
        };

        fetchStats();
    }, [selectedOwnerId]);


    return { stats, isLoading, error };
};
