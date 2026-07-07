import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatRequest {
  question: string;
  animalId: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  source?: 'rag' | 'fallback' | 'error';
}

export class SanteAnimaleService {
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post(API_ENDPOINTS.SANTE_ANIMALE.CHAT, request);
      return response.data;
    } catch (error) {
      console.error('Error calling health chatbot:', error);
      return {
        response: 'Une erreur technique est survenue. Veuillez réessayer ou contacter directement un vétérinaire.',
        source: 'error'
      };
    }
  }
}

export const santeAnimaleService = new SanteAnimaleService();
