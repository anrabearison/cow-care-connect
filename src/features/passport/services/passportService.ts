import { apiClient } from '@/utils/apiClient';
import { Passport, CreatePassportDto } from '../types/passport.types';

export const passportService = {
  async create(data: CreatePassportDto): Promise<Passport> {
    return await apiClient.post<Passport>('/api/v1/passport', data);
  },

  async findAll(herdBookId?: string): Promise<Passport[]> {
    const params = herdBookId ? { herdBookId } as Record<string, string> : {};
    return await apiClient.get<Passport[]>('/api/v1/passport', params);
  },

  async findOne(id: string): Promise<Passport> {
    return await apiClient.get<Passport>(`/api/v1/passport/${id}`);
  },

  async update(id: string, data: Partial<CreatePassportDto>): Promise<Passport> {
    return await apiClient.patch<Passport>(`/api/v1/passport/${id}`, data);
  },

  async generatePdf(id: string): Promise<Passport> {
    return await apiClient.post<Passport>(`/api/v1/passport/${id}/generate`);
  },

  async downloadPdf(id: string): Promise<Blob> {
    return await apiClient.get<Blob>(`/api/v1/passport/${id}/download`);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`/api/v1/passport/${id}`);
  },
};
