import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import VeterinariansDetailPage from '../VeterinariansDetailPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockDeleteMutate } = vi.hoisted(() => ({ mockDeleteMutate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../../hooks/veterinariansHooks', () => ({
  useDeleteVeterinarian: () => ({ mutate: mockDeleteMutate, isPending: false }),
  useVeterinarian: () => ({ data: { data: { id: '1', name: 'Test Veterinarian' } }, isLoading: false, error: null }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('VeterinariansDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the detail page and delete dialog', async () => {
    render(
      <TestWrapper>
        <VeterinariansDetailPage />
      </TestWrapper>
    );

    expect(screen.getByText('Détail du vétérinaire')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Modifier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument();
  });

  it('shows delete confirmation dialog when delete button is clicked', async () => {
    render(
      <TestWrapper>
        <VeterinariansDetailPage />
      </TestWrapper>
    );

    const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Êtes-vous sûr de vouloir supprimer ce vétérinaire/i)).toBeInTheDocument();
    });
  });

  it('calls delete mutation when confirmed', async () => {
    render(
      <TestWrapper>
        <VeterinariansDetailPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText(/Êtes-vous sûr de vouloir supprimer ce vétérinaire/i)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    const confirmButton = buttons.find(btn => btn.textContent?.trim() === 'Supprimer' && btn.className.includes('destructive'));
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith('1');
    });
  });
});
