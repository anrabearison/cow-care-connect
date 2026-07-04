import { useQuery } from '@tanstack/react-query';
import { passportService } from './services/passportService';

export const passportKeys = {
  all: ['passports'] as const,
  lists: () => [...passportKeys.all, 'list'] as const,
  list: (herdBookId?: string) => [...passportKeys.lists(), { herdBookId }] as const,
  details: () => [...passportKeys.all, 'detail'] as const,
  detail: (id: string) => [...passportKeys.details(), id] as const,
};

export const usePassports = (herdBookId?: string) => {
  return useQuery({
    queryKey: passportKeys.list(herdBookId),
    queryFn: () => passportService.findAll(herdBookId),
    enabled: !!herdBookId, // Optionnel: ne fetch que si on a un herdBookId
  });
};
