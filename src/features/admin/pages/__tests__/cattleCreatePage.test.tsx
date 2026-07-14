import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CattleCreatePage from '../CattleCreatePage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseCattleReferenceData } = vi.hoisted(() => ({ mockUseCattleReferenceData: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/cattle/hooks', () => ({
  useCreateCattle: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('@/features/admin/hooks/useCattleReferenceData', () => ({
  useCattleReferenceData: () => mockUseCattleReferenceData(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

describe('CattleCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCattleReferenceData.mockReturnValue({
      characters: [],
      herdBooks: [],
      isLoading: false,
      isError: false,
      errors: { characters: null, herdBooks: null },
      refetch: vi.fn(),
    });
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <CattleCreatePage />
      </TestWrapper>
    );

    expect(screen.getByText('Nouveau bovin')).toBeInTheDocument();
  });

  it('shows a loading indicator while reference data is loading', () => {
    mockUseCattleReferenceData.mockReturnValue({
      characters: [],
      herdBooks: [],
      isLoading: true,
      isError: false,
      errors: { characters: null, herdBooks: null },
      refetch: vi.fn(),
    });

    render(<TestWrapper><CattleCreatePage /></TestWrapper>);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows an error banner when reference data fails to load', async () => {
    mockUseCattleReferenceData.mockReturnValue({
      characters: [],
      herdBooks: [],
      isLoading: false,
      isError: true,
      errors: { characters: new Error('chars'), herdBooks: new Error('herd') },
      refetch: vi.fn(),
    });

    render(<TestWrapper><CattleCreatePage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Erreur de chargement des données de référence')).toBeInTheDocument();
      expect(screen.getByText('Veuillez réessayer pour continuer.')).toBeInTheDocument();
    });
  });

  it('shows validation errors when required fields are missing', async () => {
    mockUseCattleReferenceData.mockReturnValue({
      characters: [],
      herdBooks: [],
      isLoading: false,
      isError: false,
      errors: { characters: null, herdBooks: null },
      refetch: vi.fn(),
    });

    render(<TestWrapper><CattleCreatePage /></TestWrapper>);

    fireEvent.click(screen.getByRole('button', { name: /^Créer$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le sexe est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('La date de naissance est obligatoire')).toBeInTheDocument();
    });
  });
});
