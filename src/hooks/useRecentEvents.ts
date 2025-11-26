import { useState, useEffect } from 'react';

import { RecentEvent } from '@/types/events';


export const useRecentEvents = () => {
    const [events, setEvents] = useState<RecentEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // TODO: Replace with actual API call when endpoint is ready
                // For now we just set empty array to avoid errors
                setEvents([]);
            } catch (error) {
                console.error('Failed to fetch recent events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, isLoading };
};
