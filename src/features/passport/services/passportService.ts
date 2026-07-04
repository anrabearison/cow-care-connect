import { apiClient } from '@/utils/apiClient';
import { Passport, CreatePassportDto } from '../types/passport.types';

export const passportService = {
  async create(data: CreatePassportDto): Promise<Passport> {
    return await apiClient.post<Passport>('/api/v1/passport', data);
  },

  async findAll(herdBookId?: string, page: number = 1, limit: number = 10): Promise<{ data: Passport[], meta: any }> {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (herdBookId) {
      params.herdBookId = herdBookId;
    }
    return await apiClient.get<{ data: Passport[], meta: any }>('/api/v1/passport', params);
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
    return await apiClient.get<Blob>(`/api/v1/passport/${id}/download`, undefined, undefined, true);
  },

  async previewHtml(id: string): Promise<string> {
    return await apiClient.getText(`/api/v1/passport/${id}/preview`);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`/api/v1/passport/${id}`);
  },
};
