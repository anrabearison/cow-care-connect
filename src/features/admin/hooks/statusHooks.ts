import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { statusService, Status, CreateStatusData, UpdateStatusData } from '../services/statusService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single status by ID
 */
export const useStatus = (id: string) => {
  return useQuery({
    queryKey: queryKeys.status.details(id),
    queryFn: () => statusService.getStatusById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch status list with pagination and search
 */
export const useStatuses = (params: { page: number; q?: string }) => {
  const pageSize = 10;
  return useQuery({
    queryKey: queryKeys.status.list(params),
    queryFn: () =>
      statusService.getStatusList({
        page: params.page,
        per_page: pageSize,
        q: params.q || undefined,
      }),
  });
};

/**
 * Hook to create a new status
 */
export const useCreateStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateStatusData) => statusService.createStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.status.all });
      toast({
        title: "Succès",
        description: "Statut créé avec succès",
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
 * Hook to update a status
 */
export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusData }) =>
      statusService.updateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.status.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.status.details(variables.id) });
      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
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
 * Hook to delete a status
 */
export const useDeleteStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => statusService.deleteStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.status.all });
      toast({
        title: "Succès",
        description: "Statut supprimé avec succès",
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
