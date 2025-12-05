import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { herdBookService } from './services';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch herd books with optional filters
 */
export const useHerdBooks = (ownerId?: string) => {
    return useQuery({
        queryKey: ['herdBooks', ownerId],
        queryFn: async () => {
            const response = await herdBookService.getHerdBooksByOwner(ownerId);
            return response;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to fetch a single herd book by ID
 */
export const useHerdBookById = (id: string) => {
    return useQuery({
        queryKey: ['herdBook', id],
        queryFn: () => herdBookService.getHerdBookById(id),
        enabled: !!id,
    });
};

/**
 * Hook to fetch cattle in a herd book
 */
export const useHerdBookCattle = (herdBookId: string, page = 1, perPage = 10) => {
    return useQuery({
        queryKey: ['herdBookCattle', herdBookId, page, perPage],
        queryFn: () => herdBookService.getCattleInHerdBook(herdBookId, page, perPage),
        enabled: !!herdBookId,
    });
};

/**
 * Hook to fetch cattle history across all herd books
 */
export const useCattleHistory = (cattleId: string) => {
    return useQuery({
        queryKey: ['cattleHistory', cattleId],
        queryFn: async () => {
            const response = await herdBookService.getCattleHistory(cattleId);
            return response.data;
        },
        enabled: !!cattleId,
    });
};

/**
 * Hook to create a new herd book
 */
export const useCreateHerdBook = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: {
            year: number;
            reference: string;
            owner_id?: string;
            description?: string;
        }) => herdBookService.createHerdBook(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['herdBooks'] });
            toast({
                title: "Succès",
                description: "Le livre de troupeau a été créé avec succès",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Erreur lors de la création du livre de troupeau",
            });
        },
    });
};

/**
 * Hook to register a cattle in a herd book
 */
export const useRegisterCattle = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ herdBookId, data }: {
            herdBookId: string;
            data: {
                cattle_id: string;
                n_carnet?: string;
                category_id: string;
                status_id: string;
            };
        }) => herdBookService.registerCattle(herdBookId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['herdBookCattle', variables.herdBookId] });
            queryClient.invalidateQueries({ queryKey: ['cattle'] });
            toast({
                title: "Succès",
                description: "Le bœuf a été inscrit dans le livre de troupeau",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Erreur lors de l'inscription",
            });
        },
    });
};

/**
 * Hook to update a cattle registration
 */
export const useUpdateRegistration = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ registrationId, data }: {
            registrationId: string;
            data: {
                n_carnet?: string;
                category_id?: string;
                status_id?: string;
            };
        }) => herdBookService.updateRegistration(registrationId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['herdBookCattle'] });
            queryClient.invalidateQueries({ queryKey: ['cattleHistory'] });
            toast({
                title: "Succès",
                description: "L'inscription a été mise à jour",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Erreur lors de la mise à jour",
            });
        },
    });
};
