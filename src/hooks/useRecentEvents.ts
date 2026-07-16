import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/api';
import { RecentEvent } from '@/types/events';
import { queryKeys } from '@/lib/queryKeys';

interface EventResponse {
    id: number;
    cattleId: number;
    type: number;
    date: string;
    description: string;
    details?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
}

interface CattleResponse {
    id: number;
    name: string;
}

const fetchRecentEvents = async (): Promise<RecentEvent[]> => {
    // Fetch recent events (5 most recent, sorted by date DESC)
    const eventsResponse = await apiClient.get<PaginatedResponse<EventResponse>>(
        `${API_CONFIG.ENDPOINTS.EVENTS}?per_page=5&sort=date&order=DESC`
    );

    // Fetch cattle data to get names
    const cattleIds = [...new Set(eventsResponse.data.map(e => e.cattleId))];
    const cattlePromises = cattleIds.map(id =>
        apiClient.get<CattleResponse>(`${API_CONFIG.ENDPOINTS.CATTLE}/${id}`)
    );
    const cattleResponses = await Promise.all(cattlePromises);
    const cattleMap = new Map(cattleResponses.map(c => [c.id, c.name]));

    // Transform to RecentEvent format
    const recentEvents: RecentEvent[] = eventsResponse.data.map(event => ({
        id: event.id.toString(),
        type: event.type.toString(),
        description: event.description,
        cattleName: cattleMap.get(event.cattleId) || 'Inconnu',
        date: event.date,
    }));

    return recentEvents;
};

export const useRecentEvents = () => {
    return useQuery({
        queryKey: queryKeys.events.recent(null),
        queryFn: fetchRecentEvents,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};
