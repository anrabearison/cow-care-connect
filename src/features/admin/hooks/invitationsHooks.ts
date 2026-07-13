import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationsService, InvitationCreateData, InvitationResponse } from '../services/invitationsService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to create a new invitation
 */
export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: InvitationCreateData) => invitationsService.createInvitation(data),
    onSuccess: (invitation: InvitationResponse) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast({
        title: "Succès",
        description: "Invitation créée avec succès",
      });
      return invitation;
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
 * Hook to delete an invitation
 */
export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => invitationsService.deleteInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast({
        title: "Succès",
        description: "Invitation supprimée avec succès",
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
