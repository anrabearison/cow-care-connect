import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { passportService, CreatePassportDto } from './services/passportService';

export const passportKeys = {
  all: ['passports'] as const,
  lists: () => [...passportKeys.all, 'list'] as const,
  list: (herdBookId?: string, page?: number, limit?: number) => [...passportKeys.lists(), { herdBookId, page, limit }] as const,
  details: () => [...passportKeys.all, 'detail'] as const,
  detail: (id: string) => [...passportKeys.details(), id] as const,
};

export const usePassports = (herdBookId?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: passportKeys.list(herdBookId, page, limit),
    queryFn: () => passportService.findAll(herdBookId, page, limit),
    enabled: !!herdBookId, // Optionnel: ne fetch que si on a un herdBookId
  });
};

export const usePassport = (id: string) => {
  return useQuery({
    queryKey: passportKeys.detail(id),
    queryFn: () => passportService.findOne(id),
    enabled: !!id,
  });
};

export const useCreatePassport = (options?: UseMutationOptions<any, Error, CreatePassportDto>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (data: CreatePassportDto) => passportService.create(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: passportKeys.lists() });
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdatePassport = (options?: UseMutationOptions<any, Error, { id: string; data: Partial<CreatePassportDto> }>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => passportService.update(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: passportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: passportKeys.detail(variables.id) });
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useDeletePassport = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id: string) => passportService.delete(id),
    onSuccess: (data, id, context) => {
      queryClient.invalidateQueries({ queryKey: passportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: passportKeys.detail(id) });
      if (options?.onSuccess) options.onSuccess(data, id, context);
    },
  });
};
