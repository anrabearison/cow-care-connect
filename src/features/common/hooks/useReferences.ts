import { useQuery } from '@tanstack/react-query';
import { referenceService } from '../services/referenceService';

export const useEventTypes = () => {
    return useQuery({
        queryKey: ['eventTypes'],
        queryFn: () => referenceService.getEventTypes(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useVeterinarians = () => {
    return useQuery({
        queryKey: ['veterinarians'],
        queryFn: () => referenceService.getVeterinarians(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useMedicaments = () => {
    return useQuery({
        queryKey: ['medicaments'],
        queryFn: () => referenceService.getMedicaments(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => referenceService.getCategories(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useCharacters = () => {
    return useQuery({
        queryKey: ['characters'],
        queryFn: () => referenceService.getCharacters(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useStatuses = () => {
    return useQuery({
        queryKey: ['statuses'],
        queryFn: () => referenceService.getStatuses(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
