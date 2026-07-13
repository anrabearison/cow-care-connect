import { useMutation, useQueryClient } from '@tanstack/react-query';
import { herdBookCattleService, HerdBookCattle, CreateHerdBookCattleData, UpdateHerdBookCattleData } from '../services/herdBookCattleService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to create a new herd book cattle
 */
export const useCreateHerdBookCattle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateHerdBookCattleData) => herdBookCattleService.createHerdBookCattle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      toast({
        title: "Succès",
        description: "Bovin ajouté au livre de troupeau avec succès",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout";
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook to update a herd book cattle
 */
export const useUpdateHerdBookCattle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHerdBookCattleData }) =>
      herdBookCattleService.updateHerdBookCattle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.cattle(variables.id) });
      toast({
        title: "Succès",
        description: "Bovin mis à jour avec succès",
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
 * Hook to delete a herd book cattle
 */
export const useDeleteHerdBookCattle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => herdBookCattleService.deleteHerdBookCattle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      toast({
        title: "Succès",
        description: "Bovin supprimé du livre de troupeau avec succès",
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
