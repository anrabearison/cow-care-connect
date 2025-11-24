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
