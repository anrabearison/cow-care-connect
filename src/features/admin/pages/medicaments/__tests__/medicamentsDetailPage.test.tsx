import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MedicamentsDetailPage from '../MedicamentsDetailPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockDeleteMutate } = vi.hoisted(() => ({ mockDeleteMutate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../../hooks/medicamentsHooks', () => ({
  useDeleteMedicament: () => ({ mutate: mockDeleteMutate, isPending: false }),
  useMedicament: () => ({ data: { data: { id: '1', name: 'Test Medicament' } }, isLoading: false, error: null }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('MedicamentsDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the detail page and delete dialog', async () => {
    render(
      <TestWrapper>
        <MedicamentsDetailPage />
      </TestWrapper>
    );

    expect(screen.getByText('Détail du médicament')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Modifier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument();
  });

  it('shows delete confirmation dialog when delete button is clicked', async () => {
    render(
      <TestWrapper>
        <MedicamentsDetailPage />
      </TestWrapper>
    );

    const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Êtes-vous sûr de vouloir supprimer ce médicament/i)).toBeInTheDocument();
    });
  });

  it('calls delete mutation when confirmed', async () => {
    render(
      <TestWrapper>
        <MedicamentsDetailPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText(/Êtes-vous sûr de vouloir supprimer ce médicament/i)).toBeInTheDocument();
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
