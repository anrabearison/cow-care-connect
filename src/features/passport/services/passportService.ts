import { API_ENDPOINTS } from '@/config/api';
import { apiClient } from '@/utils/apiClient';
import { Passport, CreatePassportDto } from '../types/passport.types';

export interface PassportMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const passportService = {
  async create(data: CreatePassportDto): Promise<Passport> {
    return await apiClient.post<Passport>(API_ENDPOINTS.PASSPORT.BASE, data);
  },

  async findAll(herdBookId?: string, page: number = 1, limit: number = 10): Promise<{ data: Passport[], meta: PassportMeta }> {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (herdBookId) {
      params.herdBookId = herdBookId;
    }
    return await apiClient.get<{ data: Passport[], meta: PassportMeta }>(API_ENDPOINTS.PASSPORT.BASE, params);
  },

  async findOne(id: string): Promise<Passport> {
    return await apiClient.get<Passport>(API_ENDPOINTS.PASSPORT.byId(id));
  },

  async update(id: string, data: Partial<CreatePassportDto>): Promise<Passport> {
    return await apiClient.patch<Passport>(API_ENDPOINTS.PASSPORT.byId(id), data);
  },

  async generatePdf(id: string): Promise<Passport> {
    return await apiClient.post<Passport>(API_ENDPOINTS.PASSPORT.GENERATE(id));
  },

  async downloadPdf(id: string): Promise<Blob> {
    return await apiClient.get<Blob>(API_ENDPOINTS.PASSPORT.DOWNLOAD(id), undefined, undefined, true);
  },

  async previewHtml(id: string): Promise<string> {
    return await apiClient.getText(API_ENDPOINTS.PASSPORT.PREVIEW(id));
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.PASSPORT.byId(id));
  },
};
