import { useMutation, useQueryClient } from '@tanstack/react-query';
import { herdBooksService, HerdBook, CreateHerdBookData, UpdateHerdBookData } from '../services/herdBooksService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to create a new herd book
 */
export const useCreateHerdBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateHerdBookData) => herdBooksService.createHerdBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      toast({
        title: "Succès",
        description: "Livre de troupeau créé avec succès",
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
 * Hook to update a herd book
 */
export const useUpdateHerdBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHerdBookData }) =>
      herdBooksService.updateHerdBook(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.details(variables.id) });
      toast({
        title: "Succès",
        description: "Livre de troupeau mis à jour avec succès",
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
 * Hook to delete a herd book
 */
export const useDeleteHerdBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => herdBooksService.deleteHerdBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      toast({
        title: "Succès",
        description: "Livre de troupeau supprimé avec succès",
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
