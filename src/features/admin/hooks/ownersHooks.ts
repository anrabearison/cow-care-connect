import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ownersService, Owner, CreateOwnerData, UpdateOwnerData } from '../services/ownersService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to create a new owner
 */
export const useCreateOwner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateOwnerData) => ownersService.createOwner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.all });
      toast({
        title: "Succès",
        description: "Propriétaire créé avec succès",
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
 * Hook to update an owner
 */
export const useUpdateOwner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOwnerData }) =>
      ownersService.updateOwner(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.details(variables.id) });
      toast({
        title: "Succès",
        description: "Propriétaire mis à jour avec succès",
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
 * Hook to delete an owner
 */
export const useDeleteOwner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => ownersService.deleteOwner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.all });
      toast({
        title: "Succès",
        description: "Propriétaire supprimé avec succès",
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
