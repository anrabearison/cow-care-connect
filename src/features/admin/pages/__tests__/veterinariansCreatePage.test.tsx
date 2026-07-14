import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import VeterinariansCreatePage from '../VeterinariansCreatePage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/admin/hooks/veterinariansHooks', () => ({
  useCreateVeterinarian: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('VeterinariansCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the create page and shows validation errors', async () => {
    render(
      <TestWrapper>
        <VeterinariansCreatePage />
      </TestWrapper>
    );

    expect(screen.getByText('Nouveau vétérinaire')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Créer$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument();
    });
  });
});
