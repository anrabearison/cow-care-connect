import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { veterinariansService, Veterinarian, CreateVeterinarianData, UpdateVeterinarianData } from '../services/veterinariansService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single veterinarian by ID
 */
export const useVeterinarian = (id: string) => {
  return useQuery({
    queryKey: queryKeys.veterinarians.details(id),
    queryFn: () => veterinariansService.getVeterinarianById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch veterinarians list with pagination and search
 */
export const useVeterinarians = (params: { page: number; q?: string }) => {
  const pageSize = 10;
  return useQuery({
    queryKey: queryKeys.veterinarians.list(params),
    queryFn: () =>
      veterinariansService.getVeterinariansList({
        page: params.page,
        per_page: pageSize,
        q: params.q || undefined,
      }),
  });
};

/**
 * Hook to create a new veterinarian
 */
export const useCreateVeterinarian = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateVeterinarianData) => veterinariansService.createVeterinarian(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.veterinarians.all });
      toast({
        title: "Succès",
        description: "Vétérinaire créé avec succès",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la création";
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook to update a veterinarian
 */
export const useUpdateVeterinarian = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVeterinarianData }) =>
      veterinariansService.updateVeterinarian(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.veterinarians.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.veterinarians.details(variables.id) });
      toast({
        title: "Succès",
        description: "Vétérinaire mis à jour avec succès",
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
 * Hook to delete a veterinarian
 */
export const useDeleteVeterinarian = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => veterinariansService.deleteVeterinarian(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.veterinarians.all });
      toast({
        title: "Succès",
        description: "Vétérinaire supprimé avec succès",
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
