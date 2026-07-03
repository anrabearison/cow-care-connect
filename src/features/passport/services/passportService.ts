import { apiClient } from '@/utils/apiClient';
import { Passport, CreatePassportDto } from '../types/passport.types';

export const passportService = {
  async create(data: CreatePassportDto): Promise<Passport> {
    return await apiClient.post<Passport>('/passport', data);
  },

  async findAll(herdBookId?: string): Promise<Passport[]> {
    const params = herdBookId ? { herdBookId } as Record<string, string> : {};
    return await apiClient.get<Passport[]>('/passport', params);
  },

  async findOne(id: string): Promise<Passport> {
    return await apiClient.get<Passport>(`/passport/${id}`);
  },

  async update(id: string, data: Partial<CreatePassportDto>): Promise<Passport> {
    return await apiClient.patch<Passport>(`/passport/${id}`, data);
  },

  async generatePdf(id: string): Promise<Passport> {
    return await apiClient.post<Passport>(`/passport/${id}/generate`);
  },

  async downloadPdf(id: string): Promise<Blob> {
    return await apiClient.get<Blob>(`/passport/${id}/download`);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`/passport/${id}`);
  },
};
