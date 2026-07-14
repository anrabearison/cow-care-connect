import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { herdBooksService, HerdBook, CreateHerdBookData, UpdateHerdBookData } from '../services/herdBooksService';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single herd book by ID
 */
export const useHerdBook = (id: string) => {
  return useQuery({
    queryKey: queryKeys.herdBooks.details(id),
    queryFn: async () => {
      const response = await herdBooksService.getHerdBookById(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch herd book");
      }
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new herd book
 */
export const useCreateHerdBook = (options?: Omit<UseMutationOptions<any, Error, CreateHerdBookData>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHerdBookData) => herdBooksService.createHerdBook(data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to update a herd book
 */
export const useUpdateHerdBook = (options?: Omit<UseMutationOptions<any, Error, { id: string; data: UpdateHerdBookData }>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHerdBookData }) =>
      herdBooksService.updateHerdBook(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.details(variables.id) });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to delete a herd book
 */
export const useDeleteHerdBook = (options?: Omit<UseMutationOptions<any, Error, string>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => herdBooksService.deleteHerdBook(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
