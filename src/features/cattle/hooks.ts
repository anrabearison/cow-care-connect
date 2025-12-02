import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cattle } from './types';
import { cattleService, CattleFilters } from './services';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch list of cattle with filters
 */
export const useCattle = (filters?: CattleFilters) => {
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['cattle', filters],
    queryFn: async () => {
      const response = await cattleService.getCattleList(filters);

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
    retry: 1,
  });

  return {
    cattle: query.data?.data || [],
    loading: query.isLoading,
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
    queryKey: ['cattle', id],
    queryFn: async () => {
      const response = await cattleService.getCattleById(parseInt(id));

      if (!response.success || !response.data) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || 'Bovin non trouvé'
        });
        throw new Error(response.message || 'Bovin non trouvé');
      }

      return response.data;
    },
    enabled: !!id,
    retry: 1,
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
    mutationFn: (cattleData: Omit<Cattle, 'id'>) =>
      cattleService.createCattle(cattleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattle'] });
      toast({
        title: "Succès",
        description: "L'animal a été ajouté avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de l'animal",
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
    mutationFn: ({ id, data }: { id: number; data: Partial<Cattle> }) =>
      cattleService.updateCattle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cattle'] });
      queryClient.invalidateQueries({ queryKey: ['cattle', variables.id.toString()] });
      toast({
        title: "Succès",
        description: "L'animal a été mis à jour avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour",
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
    mutationFn: (id: number) => cattleService.deleteCattle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattle'] });
      toast({
        title: "Succès",
        description: "L'animal a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
      });
    },
  });
};