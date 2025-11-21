import { useState, useEffect } from 'react';
import { getRecentEvents } from '@/data/mockData';
import { RecentEvent } from '@/types/events';
import { LOADING_DELAY_MS } from '@/constants/ui';

export const useRecentEvents = () => {
    const [events, setEvents] = useState<RecentEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEvents(getRecentEvents());
            setIsLoading(false);
        }, LOADING_DELAY_MS);

        return () => clearTimeout(timer);
    }, []);

    return { events, isLoading };
};
