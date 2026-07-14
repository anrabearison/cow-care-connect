import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medicamentsService, Medicament, CreateMedicamentData, UpdateMedicamentData } from '../services/medicamentsService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single medicament by ID
 */
export const useMedicament = (id: string) => {
  return useQuery({
    queryKey: queryKeys.medicaments.details(id),
    queryFn: () => medicamentsService.getMedicamentById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch medicaments list with pagination and search
 */
export const useMedicaments = (params: { page: number; q?: string }) => {
  const pageSize = 10;
  return useQuery({
    queryKey: queryKeys.medicaments.list(params),
    queryFn: () =>
      medicamentsService.getMedicamentsList({
        page: params.page,
        per_page: pageSize,
        q: params.q || undefined,
      }),
  });
};

/**
 * Hook to create a new medicament
 */
export const useCreateMedicament = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateMedicamentData) => medicamentsService.createMedicament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.medicaments.all });
      toast({
        title: "Succès",
        description: "Médicament créé avec succès",
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
 * Hook to update a medicament
 */
export const useUpdateMedicament = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicamentData }) =>
      medicamentsService.updateMedicament(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.medicaments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.medicaments.details(variables.id) });
      toast({
        title: "Succès",
        description: "Médicament mis à jour avec succès",
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
 * Hook to delete a medicament
 */
export const useDeleteMedicament = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => medicamentsService.deleteMedicament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.medicaments.all });
      toast({
        title: "Succès",
        description: "Médicament supprimé avec succès",
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
