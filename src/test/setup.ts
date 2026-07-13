import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Create a test QueryClient
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('Query error:', error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    }),
  });
};

// Mock Sonner toast
const toastMock = vi.fn();
vi.mock('sonner', () => ({
  toast: toastMock,
}));

export { toastMock };
