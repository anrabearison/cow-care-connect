import { useQuery } from '@tanstack/react-query';
import { referenceService } from '../services/referenceService';

const useOwnerScopedQueryKey = (key: string) => {
    return [key, null] as const;
};

export const useEventTypes = () => {
    const queryKey = useOwnerScopedQueryKey('eventTypes');

    return useQuery({
        queryKey,
        queryFn: () => referenceService.getEventTypes(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useVeterinarians = () => {
    const queryKey = useOwnerScopedQueryKey('veterinarians');

    return useQuery({
        queryKey,
        queryFn: () => referenceService.getVeterinarians(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useMedicaments = () => {
    const queryKey = useOwnerScopedQueryKey('medicaments');

    return useQuery({
        queryKey,
        queryFn: () => referenceService.getMedicaments(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useCategories = () => {
    const queryKey = useOwnerScopedQueryKey('categories');

    return useQuery({
        queryKey,
        queryFn: () => referenceService.getCategories(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useCharacters = () => {
    const queryKey = useOwnerScopedQueryKey('characters');

    return useQuery({
        queryKey,
        queryFn: () => referenceService.getCharacters(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useStatuses = () => {
    const queryKey = useOwnerScopedQueryKey('statuses');

    return useQuery({
        queryKey,
        queryFn: () => referenceService.getStatuses(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
