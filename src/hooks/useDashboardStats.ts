import { useState, useEffect } from 'react';
import { dashboardService, DashboardStats } from '@/features/dashboard/services';

export const useDashboardStats = () => {
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
    }, []);


    return { stats, isLoading, error };
};
