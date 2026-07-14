import { useQuery } from '@tanstack/react-query';
import { referenceService } from '@/features/common/services/referenceService';
import { queryKeys } from '@/lib/queryKeys';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const EMPTY_ARRAY: never[] = [];

interface HerdBook {
  id: string;
  reference?: string;
  name?: string;
  year?: number;
}

interface Category {
  id: string;
  name: string;
}

interface Status {
  id: string;
  name: string;
}

export function useHerdBookCattleReferenceData() {
  const herdBooksQuery = useQuery({
    queryKey: queryKeys.herdBooks.reference(),
    queryFn: async () => {
      const response = await referenceService.getHerdBooks();
      if (response.success && Array.isArray(response.data)) {
        return response.data.map((item: HerdBook) => ({
          id: item.id,
          name: item.name || item.reference || '',
          reference: item.reference,
          year: item.year,
        })).sort((a, b) => (b.year || 0) - (a.year || 0));
      } else {
        console.warn('HerdBooks response is not an array:', response);
        return [];
      }
    },
    staleTime: STALE_TIME,
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.reference(),
    queryFn: async () => {
      const response = await referenceService.getCategories();
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Categories response is not an array:', response);
        return [];
      }
    },
    staleTime: STALE_TIME,
  });

  const statusesQuery = useQuery({
    queryKey: queryKeys.status.reference(),
    queryFn: async () => {
      const response = await referenceService.getStatuses();
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Statuses response is not an array:', response);
        return [];
      }
    },
    staleTime: STALE_TIME,
  });

  const isLoading = herdBooksQuery.isLoading || categoriesQuery.isLoading || statusesQuery.isLoading;
  const isError = herdBooksQuery.isError || categoriesQuery.isError || statusesQuery.isError;
  
  const errors = {
    herdBooks: herdBooksQuery.error,
    categories: categoriesQuery.error,
    statuses: statusesQuery.error,
  };

  const herdBooks = herdBooksQuery.data ?? EMPTY_ARRAY;
  const categories = categoriesQuery.data ?? EMPTY_ARRAY;
  const statuses = statusesQuery.data ?? EMPTY_ARRAY;

  return {
    herdBooks,
    categories,
    statuses,
    isLoading,
    isError,
    errors,
    refetch: () => {
      herdBooksQuery.refetch();
      categoriesQuery.refetch();
      statusesQuery.refetch();
    },
  };
}
