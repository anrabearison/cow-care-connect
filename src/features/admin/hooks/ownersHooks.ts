import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ownersService, Owner, CreateOwnerData, UpdateOwnerData } from '../services/ownersService';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single owner by ID
 */
export const useOwner = (id: string) => {
  return useQuery({
    queryKey: queryKeys.owners.details(id),
    queryFn: async () => {
      const response = await ownersService.getOwnerById(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch owner");
      }
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new owner
 */
export const useCreateOwner = (options?: Omit<UseMutationOptions<any, Error, CreateOwnerData>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOwnerData) => ownersService.createOwner(data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to update an owner
 */
export const useUpdateOwner = (options?: Omit<UseMutationOptions<any, Error, { id: string; data: UpdateOwnerData }>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOwnerData }) =>
      ownersService.updateOwner(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.details(variables.id) });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to delete an owner
 */
export const useDeleteOwner = (options?: Omit<UseMutationOptions<any, Error, string>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ownersService.deleteOwner(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
