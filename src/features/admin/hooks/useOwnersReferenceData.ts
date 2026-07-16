import { useQuery } from '@tanstack/react-query';
import { ownersService } from '@/features/admin/services/ownersService';
import { queryKeys } from '@/lib/queryKeys';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const EMPTY_ARRAY: never[] = [];

interface Owner {
  id: string;
  name: string;
}

export function useOwnersReferenceData() {
  const ownersQuery = useQuery({
    queryKey: queryKeys.owners.lists(),
    queryFn: async () => {
      const response = await ownersService.getOwnersList();
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Owners response is not an array:', response);
        return [];
      }
    },
    staleTime: STALE_TIME,
  });

  const isLoading = ownersQuery.isLoading;
  const isError = ownersQuery.isError;
  const error = ownersQuery.error;
  const owners = ownersQuery.data ?? EMPTY_ARRAY;

  return {
    owners,
    isLoading,
    isError,
    error,
    refetch: () => ownersQuery.refetch(),
  };
}
