import { useQuery } from '@tanstack/react-query';
import { passportService } from './services/passportService';

export const passportKeys = {
  all: ['passports'] as const,
  lists: () => [...passportKeys.all, 'list'] as const,
  list: (herdBookId?: string, page?: number, limit?: number) => [...passportKeys.lists(), { herdBookId, page, limit }] as const,
  details: () => [...passportKeys.all, 'detail'] as const,
  detail: (id: string) => [...passportKeys.details(), id] as const,
};

export const usePassports = (herdBookId?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: passportKeys.list(herdBookId, page, limit),
    queryFn: () => passportService.findAll(herdBookId, page, limit),
    enabled: !!herdBookId, // Optionnel: ne fetch que si on a un herdBookId
  });
};
