import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsService, Event, CreateEventData, UpdateEventData } from '../services/eventsService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single event by ID
 */
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.events.details(id),
    queryFn: () => eventsService.getEventById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch events list with pagination and search
 */
export const useEvents = (params: { page: number; q?: string }) => {
  const pageSize = 10;
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () =>
      eventsService.getEventsList({
        page: params.page,
        per_page: pageSize,
        q: params.q || undefined,
      }),
  });
};

/**
 * Hook to create a new event
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateEventData) => eventsService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      toast({
        title: "Succès",
        description: "Événement créé avec succès",
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
 * Hook to update an event
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      eventsService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.details(variables.id) });
      toast({
        title: "Succès",
        description: "Événement mis à jour avec succès",
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
 * Hook to delete an event
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => eventsService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
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
