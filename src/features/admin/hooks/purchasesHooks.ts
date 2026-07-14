import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { purchasesService, Purchase, CreatePurchaseData, UpdatePurchaseData, CreateSupplierData, UpdateSupplierData } from '../services/purchasesService';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single purchase by ID
 */
export const usePurchase = (id: string) => {
  return useQuery({
    queryKey: queryKeys.purchases.details(id),
    queryFn: async () => {
      const response = await purchasesService.getPurchaseById(id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch purchase");
      }
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to fetch a single supplier by ID
 */
export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: queryKeys.suppliers.details(id),
    queryFn: () => purchasesService.getSupplierById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch suppliers list with pagination and search
 */
export const useSuppliers = (params: { page: number; q?: string }) => {
  const pageSize = 10;
  return useQuery({
    queryKey: queryKeys.suppliers.list(params),
    queryFn: () =>
      purchasesService.getSuppliersList({
        page: params.page,
        per_page: pageSize,
        q: params.q || undefined,
      }),
  });
};

/**
 * Hook to create a new purchase
 */
export const useCreatePurchase = (options?: Omit<UseMutationOptions<any, Error, CreatePurchaseData>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseData) => purchasesService.createPurchase(data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to update a purchase
 */
export const useUpdatePurchase = (options?: Omit<UseMutationOptions<any, Error, { id: string; data: UpdatePurchaseData }>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseData }) =>
      purchasesService.updatePurchase(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases.details(variables.id) });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to delete a purchase
 */
export const useDeletePurchase = (options?: Omit<UseMutationOptions<any, Error, string>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchasesService.deletePurchase(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to create a new supplier
 */
export const useCreateSupplier = (options?: Omit<UseMutationOptions<any, Error, CreateSupplierData>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierData) => purchasesService.createSupplier(data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to update a supplier
 */
export const useUpdateSupplier = (options?: Omit<UseMutationOptions<any, Error, { id: string; data: UpdateSupplierData }>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplierData }) =>
      purchasesService.updateSupplier(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.details(variables.id) });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

/**
 * Hook to delete a supplier
 */
export const useDeleteSupplier = (options?: Omit<UseMutationOptions<any, Error, string>, 'mutationFn'>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchasesService.deleteSupplier(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
