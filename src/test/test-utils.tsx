import { ReactElement } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './setup';

export const TestWrapper = ({ children }: { children: ReactElement }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
