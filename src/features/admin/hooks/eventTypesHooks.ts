import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventTypesService, EventType, CreateEventTypeData, UpdateEventTypeData } from '../services/eventTypesService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single event type by ID
 */
export const useEventType = (id: string) => {
  return useQuery({
    queryKey: queryKeys.eventTypes.details(id),
    queryFn: () => eventTypesService.getEventTypeById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch event types list with pagination and search
 */
export const useEventTypes = (params: { page: number; q?: string }) => {
  const pageSize = 10;
  return useQuery({
    queryKey: queryKeys.eventTypes.list(params),
    queryFn: () =>
      eventTypesService.getEventTypesList({
        page: params.page,
        per_page: pageSize,
        q: params.q || undefined,
      }),
  });
};

/**
 * Hook to create a new event type
 */
export const useCreateEventType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateEventTypeData) => eventTypesService.createEventType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventTypes.all });
      toast({
        title: "Succès",
        description: "Type d'événement créé avec succès",
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
 * Hook to update an event type
 */
export const useUpdateEventType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventTypeData }) =>
      eventTypesService.updateEventType(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventTypes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.eventTypes.details(variables.id) });
      toast({
        title: "Succès",
        description: "Type d'événement mis à jour avec succès",
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
 * Hook to delete an event type
 */
export const useDeleteEventType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => eventTypesService.deleteEventType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventTypes.all });
      toast({
        title: "Succès",
        description: "Type d'événement supprimé avec succès",
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
