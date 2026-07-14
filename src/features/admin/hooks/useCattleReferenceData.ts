import { useQuery } from '@tanstack/react-query';
import { referenceService } from '@/features/common/services/referenceService';
import { queryKeys } from '@/lib/queryKeys';

const STALE_TIME = 5 * 60 * 1000;

export interface CattleReferenceOption {
  id: string;
  name: string;
}

export interface CattleReferenceData {
  characters: CattleReferenceOption[];
  herdBooks: Array<{ id: string; name: string }>;
  isLoading: boolean;
  isError: boolean;
  errors: {
    characters: unknown;
    herdBooks: unknown;
  };
  refetch: () => void;
}

export function useCattleReferenceData(): CattleReferenceData {
  const charactersQuery = useQuery({
    queryKey: queryKeys.characters.reference(),
    queryFn: async () => {
      if (typeof referenceService.getCharacters !== 'function') {
        return [];
      }

      const response = await referenceService.getCharacters();
      if (response.success && Array.isArray(response.data)) {
        return response.data.map((item) => ({
          id: item.id,
          name: item.name || '',
        }));
      }
      return [];
    },
    staleTime: STALE_TIME,
  });

  const herdBooksQuery = useQuery({
    queryKey: queryKeys.herdBooks.reference(),
    queryFn: async () => {
      if (typeof referenceService.getHerdBooks !== 'function') {
        return [];
      }

      const response = await referenceService.getHerdBooks();
      if (response.success && Array.isArray(response.data)) {
        return response.data.map((item) => ({
          id: item.id,
          name: item.name || '',
        }));
      }
      return [];
    },
    staleTime: STALE_TIME,
  });

  return {
    characters: charactersQuery.data || [],
    herdBooks: herdBooksQuery.data || [],
    isLoading: charactersQuery.isLoading || herdBooksQuery.isLoading,
    isError: charactersQuery.isError || herdBooksQuery.isError,
    errors: {
      characters: charactersQuery.error,
      herdBooks: herdBooksQuery.error,
    },
    refetch: () => {
      charactersQuery.refetch();
      herdBooksQuery.refetch();
    },
  };
}
