import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HerdBookCattleEditPage from '../HerdBookCattleEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockGetHerdBookCattleById } = vi.hoisted(() => ({ mockGetHerdBookCattleById: vi.fn() }));
const { mockUpdateHerdBookCattle } = vi.hoisted(() => ({ mockUpdateHerdBookCattle: vi.fn() }));
const { mockGetHerdBooks } = vi.hoisted(() => ({ mockGetHerdBooks: vi.fn() }));
const { mockGetCategories } = vi.hoisted(() => ({ mockGetCategories: vi.fn() }));
const { mockGetStatuses } = vi.hoisted(() => ({ mockGetStatuses: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../../services/herdBookCattleService', () => ({
  herdBookCattleService: {
    getHerdBookCattleById: mockGetHerdBookCattleById,
    updateHerdBookCattle: mockUpdateHerdBookCattle,
  },
}));

vi.mock('@/features/common/services/referenceService', () => ({
  referenceService: {
    getHerdBooks: mockGetHerdBooks,
    getCategories: mockGetCategories,
    getStatuses: mockGetStatuses,
  },
}));

vi.mock('@/features/cattle/services', () => ({
  cattleService: {
    getCattleList: vi.fn(() => Promise.resolve({ success: true, data: [] })),
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('HerdBookCattleEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for reference services - return successful responses
    mockGetHerdBooks.mockResolvedValue({ success: true, data: [] });
    mockGetCategories.mockResolvedValue({ success: true, data: [] });
    mockGetStatuses.mockResolvedValue({ success: true, data: [] });
  });

  it('should show loading indicator while fetching data', () => {
    mockGetHerdBookCattleById.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<TestWrapper><HerdBookCattleEditPage /></TestWrapper>);

    // Check for loading indicator (SVG with animate-spin class)
    const loader = screen.queryByRole('img') || document.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
  });

  it('should show error message when data fetch fails', async () => {
    mockGetHerdBookCattleById.mockResolvedValue({ success: false });

    render(<TestWrapper><HerdBookCattleEditPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Inscription introuvable')).toBeInTheDocument();
      expect(screen.getByText('Retour à la liste')).toBeInTheDocument();
    });
  });

  it('should show error message when data is null', async () => {
    mockGetHerdBookCattleById.mockResolvedValue({ success: true, data: null });

    render(<TestWrapper><HerdBookCattleEditPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Inscription introuvable')).toBeInTheDocument();
    });
  });

  it('should render form when data is loaded successfully', async () => {
    mockGetHerdBooks.mockResolvedValue({ 
      success: true, 
      data: [{ id: 'hb1', name: 'HB-001', reference: 'HB-001', year: 2024 }] 
    });
    mockGetCategories.mockResolvedValue({ 
      success: true, 
      data: [{ id: 'cat1', name: 'Catégorie A' }] 
    });
    mockGetStatuses.mockResolvedValue({ 
      success: true, 
      data: [{ id: 'status1', name: 'Actif' }] 
    });

    mockGetHerdBookCattleById.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        herdBookId: 'hb1',
        cattleId: 'cattle1',
        categoryId: 'cat1',
        statusId: 'status1',
        nCarnet: 123,
      }
    });

    render(<TestWrapper><HerdBookCattleEditPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Modifier l\'inscription')).toBeInTheDocument();
    });

    // NOTE: Testing form pre-filling with shadcn/ui Select components is complex
    // because they use Radix UI primitives that are difficult to interact with in tests.
    // The form should be pre-filled with the data from the API response, but verifying
    // this with getByDisplayValue or similar requires additional setup.
  });

  it('should show error message when reference data fails to load', async () => {
    // Mock reference services to fail
    mockGetHerdBooks.mockRejectedValue(new Error('API Error'));
    mockGetCategories.mockResolvedValue({ success: true, data: [] });
    mockGetStatuses.mockResolvedValue({ success: true, data: [] });

    mockGetHerdBookCattleById.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        herdBookId: 'hb1',
        cattleId: 'cattle1',
        categoryId: 'cat1',
        statusId: 'status1',
        nCarnet: 123,
      }
    });

    render(<TestWrapper><HerdBookCattleEditPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Modifier l\'inscription')).toBeInTheDocument();
    });

    // The error message should be shown alongside the form
    expect(screen.getByText('Erreur de chargement des données de référence')).toBeInTheDocument();
    expect(screen.getByText('Veuillez réessayer pour continuer.')).toBeInTheDocument();
    expect(screen.getByText('Réessayer')).toBeInTheDocument();
  });

  it('should show error toast when submitting with missing required field', async () => {
    mockGetHerdBooks.mockResolvedValue({ 
      success: true, 
      data: [{ id: 'hb1', name: 'HB-001', reference: 'HB-001', year: 2024 }] 
    });
    mockGetCategories.mockResolvedValue({ 
      success: true, 
      data: [{ id: 'cat1', name: 'Catégorie A' }] 
    });
    mockGetStatuses.mockResolvedValue({ 
      success: true, 
      data: [{ id: 'status1', name: 'Actif' }] 
    });

    mockGetHerdBookCattleById.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        herdBookId: '',
        cattleId: '',
        categoryId: '',
        statusId: '',
        nCarnet: 0,
      }
    });

    render(<TestWrapper><HerdBookCattleEditPage /></TestWrapper>);

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByText('Modifier l\'inscription')).toBeInTheDocument();
    });

    // Try to submit without filling required fields
    const submitButton = screen.getByText('Enregistrer');
    submitButton.click();

    expect(mockToast).toHaveBeenCalledWith({
      title: "Erreur",
      description: "Veuillez sélectionner un livre de troupeau",
      variant: "destructive"
    });
  });

  // NOTE: Testing full form submission with shadcn/ui Select components is complex
  // because they use Radix UI primitives that are difficult to interact with in tests.
  // 
  // To properly test form submission, you would need to:
  // 1. Use userEvent from @testing-library/user-event for better interaction simulation
  // 2. Create custom render helpers that can interact with Radix UI components
  // 3. Or test the form component (HerdBookCattleForm) in isolation with direct prop manipulation
  //
  // Documented limitation: Cannot easily test form submission with shadcn/ui Select
  // components in unit tests without additional infrastructure.
});
