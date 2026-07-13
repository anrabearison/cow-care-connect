import { useMutation, useQueryClient } from '@tanstack/react-query';
import { treatmentsService, Treatment, CreateTreatmentData, UpdateTreatmentData } from '../services/treatmentsService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to create a new treatment
 */
export const useCreateTreatment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTreatmentData) => treatmentsService.createTreatment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.treatments.all });
      toast({
        title: "Succès",
        description: "Traitement créé avec succès",
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
 * Hook to update a treatment
 */
export const useUpdateTreatment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTreatmentData }) =>
      treatmentsService.updateTreatment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.treatments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.treatments.details(variables.id) });
      toast({
        title: "Succès",
        description: "Traitement mis à jour avec succès",
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
 * Hook to delete a treatment
 */
export const useDeleteTreatment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => treatmentsService.deleteTreatment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.treatments.all });
      toast({
        title: "Succès",
        description: "Traitement supprimé avec succès",
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
