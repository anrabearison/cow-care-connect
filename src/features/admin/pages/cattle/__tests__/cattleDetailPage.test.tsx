import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CattleDetailPage from '../CattleDetailPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockDeleteCattle } = vi.hoisted(() => ({ mockDeleteCattle: vi.fn() }));
const { mockUseCattleById } = vi.hoisted(() => ({ mockUseCattleById: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/cattle/hooks', () => ({
  useCattleById: () => mockUseCattleById(),
  useDeleteCattle: () => ({ mutate: mockDeleteCattle, isPending: false }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('CattleDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCattleById.mockReturnValue({
      cattle: {
        id: '1',
        name: 'Bovin Test',
        nickname: 'Bibi',
        gender: 'M',
        birthDate: '2020-01-01',
        category: { name: 'Vache' },
        status: { name: 'Actif' },
        nCarnet: '123',
        source: { type: 'ACHETE' },
      },
      loading: false,
      error: null,
      refreshCattle: vi.fn(),
    });
  });

  it('shows a loading indicator while fetching data', () => {
    mockUseCattleById.mockReturnValue({ cattle: null, loading: true, error: null, refreshCattle: vi.fn() });

    render(<TestWrapper><CattleDetailPage /></TestWrapper>);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders cattle details and opens the delete confirmation dialog', async () => {
    render(<TestWrapper><CattleDetailPage /></TestWrapper>);

    expect(screen.getByText('Détails du bovin')).toBeInTheDocument();
    expect(screen.getByText('Bovin Test')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText('Supprimer le bovin')).toBeInTheDocument();
    });
  });

  it('navigates to the edit page when the edit button is clicked', () => {
    render(<TestWrapper><CattleDetailPage /></TestWrapper>);

    fireEvent.click(screen.getByRole('button', { name: /Modifier/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/admin/cattle/1/edit');
  });

  it('deletes the cattle and navigates back to the list on confirm', async () => {
    mockDeleteCattle.mockImplementation((_id: string, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
      return undefined;
    });

    render(<TestWrapper><CattleDetailPage /></TestWrapper>);

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText('Supprimer le bovin')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: /Supprimer/i }).at(-1)!);

    await waitFor(() => {
      expect(mockDeleteCattle).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/admin/cattle');
    });
  });
});
