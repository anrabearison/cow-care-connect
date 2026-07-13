import { useMutation, useQueryClient } from '@tanstack/react-query';
import { veterinariansService, Veterinarian, CreateVeterinarianData, UpdateVeterinarianData } from '../services/veterinariansService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

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
