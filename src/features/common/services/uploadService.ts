import { API_ENDPOINTS } from '@/config/api';
import { apiClient } from '@/utils/apiClient';

export interface UploadedImage {
  url: string;
  publicId?: string;
}

class UploadService {
  async uploadImage(file: File): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ url: string; public_id?: string; publicId?: string }>(
      API_ENDPOINTS.UPLOAD.BASE,
      formData
    );

    return {
      url: response.url,
      publicId: response.publicId || response.public_id,
    };
  }
}

export const uploadService = new UploadService();
