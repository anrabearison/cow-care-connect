import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CattleEditPage from '../CattleEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUpdateCattle } = vi.hoisted(() => ({ mockUpdateCattle: vi.fn() }));
const { mockUseCattleById } = vi.hoisted(() => ({ mockUseCattleById: vi.fn() }));
const { mockUseCattleReferenceData } = vi.hoisted(() => ({ mockUseCattleReferenceData: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/cattle/hooks', () => ({
  useCattleById: () => mockUseCattleById(),
  useUpdateCattle: () => ({ mutate: mockUpdateCattle, isPending: false }),
}));

vi.mock('@/features/admin/hooks/useCattleReferenceData', () => ({
  useCattleReferenceData: () => mockUseCattleReferenceData(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('CattleEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCattleById.mockReturnValue({
      cattle: {
        id: '1',
        name: 'Bovin Test',
        nickname: 'Bibi',
        gender: 'M',
        birthDate: '2020-01-01',
        character: { id: 'c1', name: 'Docile' },
        brand: 'BR1',
        distinctiveSign: 'Tache',
        nCarnet: '123',
        source: { type: 'ACHETE', supplier: 'Fournisseur' },
      },
      loading: false,
      error: null,
      refreshCattle: vi.fn(),
    });
    mockUseCattleReferenceData.mockReturnValue({
      characters: [{ id: 'c1', name: 'Docile' }],
      herdBooks: [],
      isLoading: false,
      isError: false,
      errors: { characters: null, herdBooks: null },
      refetch: vi.fn(),
    });
  });

  it('shows a loading indicator while fetching data', () => {
    mockUseCattleById.mockReturnValue({ cattle: null, loading: true, error: null, refreshCattle: vi.fn() });

    render(<TestWrapper><CattleEditPage /></TestWrapper>);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows an error state when the cattle could not be loaded', () => {
    mockUseCattleById.mockReturnValue({ cattle: null, loading: false, error: 'Bovin non trouvé', refreshCattle: vi.fn() });

    render(<TestWrapper><CattleEditPage /></TestWrapper>);

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Bovin introuvable')).toBeInTheDocument();
  });

  it('renders the edit page and submits updated cattle data', () => {
    render(<TestWrapper><CattleEditPage /></TestWrapper>);

    expect(screen.getByText('Modifier le bovin')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Nom *'), { target: { value: 'Bovin modifié' } });
    fireEvent.click(screen.getByRole('button', { name: /^Enregistrer$/i }));

    expect(mockUpdateCattle).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        data: expect.objectContaining({ name: 'Bovin modifié' }),
      }),
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });
});
