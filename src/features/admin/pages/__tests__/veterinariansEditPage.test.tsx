import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import VeterinariansEditPage from '../VeterinariansEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/admin/hooks/veterinariansHooks', () => ({
  useUpdateVeterinarian: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('VeterinariansEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the edit page and shows validation errors', async () => {
    render(
      <TestWrapper>
        <VeterinariansEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le vétérinaire')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument();
    });
  });
});
