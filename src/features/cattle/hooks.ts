import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cattle } from './types';
import { cattleService, CattleFilters } from './services';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch list of cattle with filters
 * @param herdBookId - Required HerdBook ID to filter cattle
 * @param filters - Additional filters
 */
export const useCattle = (herdBookId: string, filters?: Omit<CattleFilters, 'herd_book_id'>) => {
  const { toast } = useToast();

  // Merge herdBookId with other filters
  const allFilters: CattleFilters & { herd_book_id?: string } = {
    ...filters,
    herd_book_id: herdBookId,
  };

  const query = useQuery({
    queryKey: queryKeys.cattle.list(allFilters as Record<string, unknown>),
    queryFn: async () => {
      if (!herdBookId) {
        throw new Error('HerdBook ID requis');
      }

      const response = await cattleService.getCattleList(allFilters);

      if (!response.success) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || 'Erreur lors du chargement des données'
        });
        throw new Error(response.message || 'Erreur lors du chargement des données');
      }

      return {
        data: response.data,
        total: response.total || response.data.length
      };
    },
    enabled: !!herdBookId,
    retry: 1,
  });

  return {
    cattle: query.data?.data || [],
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message || null,
    total: query.data?.total || 0,
    refreshCattle: query.refetch
  };
};

/**
 * Hook to fetch a single cattle by ID
 */
export const useCattleById = (id: string) => {
  const { toast } = useToast();

  const query = useQuery({
    queryKey: queryKeys.cattle.details(id),
    queryFn: async () => {
      if (!id) {
        throw new Error('ID invalide');
      }

      const response = await cattleService.getCattleById(id);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Bovin non trouvé');
      }

      return response.data;
    },
    enabled: !!id,
    retry: false, // Don't retry on 404
  });

  return {
    cattle: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    refreshCattle: query.refetch
  };
};

/**
 * Hook to create a new cattle
 */
export const useCreateCattle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      cattle,
      herdBookId,
      nCarnet
    }: {
      cattle: Omit<Cattle, 'id'>;
      herdBookId?: string;
      nCarnet?: string;
    }) =>
      cattleService.createCattle(cattle, herdBookId, nCarnet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cattle.all });
      toast({
        title: "Succès",
        description: "L'animal a été ajouté avec succès et inscrit dans le livre de troupeau",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout de l'animal";
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook to update cattle
 */
export const useUpdateCattle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Cattle> }) =>
      cattleService.updateCattle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cattle.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cattle.details(variables.id) });
      toast({
        title: "Succès",
        description: "L'animal a été mis à jour avec succès",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook to delete cattle
 */
export const useDeleteCattle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => cattleService.deleteCattle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cattle.all });
      toast({
        title: "Succès",
        description: "L'animal a été supprimé avec succès",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression";
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    },
  });
};