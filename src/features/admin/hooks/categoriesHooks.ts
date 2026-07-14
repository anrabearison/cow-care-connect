import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesService, Category, CreateCategoryData, UpdateCategoryData } from '../services/categoriesService';
import { useToast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.details(id),
    queryFn: () => categoriesService.getCategoryById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch categories list with pagination and search
 */
export const useCategories = (params: { page: number; q?: string }) => {
  const pageSize = 10;
  return useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () =>
      categoriesService.getCategoriesList({
        page: params.page,
        per_page: pageSize,
        q: params.q || undefined,
      }),
  });
};

/**
 * Hook to create a new category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCategoryData) => categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast({
        title: "Succès",
        description: "Catégorie créée avec succès",
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
 * Hook to update a category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      categoriesService.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.details(variables.id) });
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès",
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
 * Hook to delete a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
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
