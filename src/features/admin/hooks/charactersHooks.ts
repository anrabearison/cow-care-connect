import { useMutation, useQueryClient } from '@tanstack/react-query';
import { charactersService, Character, CreateCharacterData, UpdateCharacterData } from '../services/charactersService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to create a new character
 */
export const useCreateCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCharacterData) => charactersService.createCharacter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
      toast({
        title: "Succès",
        description: "Caractère créé avec succès",
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
 * Hook to update a character
 */
export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCharacterData }) =>
      charactersService.updateCharacter(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.details(variables.id) });
      toast({
        title: "Succès",
        description: "Caractère mis à jour avec succès",
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
 * Hook to delete a character
 */
export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => charactersService.deleteCharacter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
      toast({
        title: "Succès",
        description: "Caractère supprimé avec succès",
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
