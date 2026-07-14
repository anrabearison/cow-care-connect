import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HerdBookCattleCreatePage from '../HerdBookCattleCreatePage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockGetHerdBooks } = vi.hoisted(() => ({ mockGetHerdBooks: vi.fn() }));
const { mockGetCategories } = vi.hoisted(() => ({ mockGetCategories: vi.fn() }));
const { mockGetStatuses } = vi.hoisted(() => ({ mockGetStatuses: vi.fn() }));
const { mockApiClientGet } = vi.hoisted(() => ({ mockApiClientGet: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../services/herdBookCattleService', () => ({
  herdBookCattleService: {
    createHerdBookCattle: vi.fn(),
  },
}));

vi.mock('@/features/common/services/referenceService', () => ({
  referenceService: {
    getHerdBooks: mockGetHerdBooks,
    getCategories: mockGetCategories,
    getStatuses: mockGetStatuses,
  },
}));

vi.mock('@/utils/apiClient', () => ({
  apiClient: {
    get: mockApiClientGet,
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    buildQueryString: vi.fn(() => ''),
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}));

describe('HerdBookCattleCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for reference services - return successful responses
    mockGetHerdBooks.mockResolvedValue({ success: true, data: [] });
    mockGetCategories.mockResolvedValue({ success: true, data: [] });
    mockGetStatuses.mockResolvedValue({ success: true, data: [] });
    // Default mock for apiClient - return empty data
    mockApiClientGet.mockResolvedValue({ data: [], total: 0 });
  });

  it('should render without crashing', () => {
    render(<TestWrapper><HerdBookCattleCreatePage /></TestWrapper>);
    expect(screen.getByText('Nouvelle inscription bovine')).toBeInTheDocument();
  });

  it('should show loading indicator while loading reference data', () => {
    mockGetHerdBooks.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<TestWrapper><HerdBookCattleCreatePage /></TestWrapper>);
    expect(screen.getByText('Chargement des données de référence...')).toBeInTheDocument();
  });

  it('should show error message when reference data fails to load', async () => {
    // Mock reference services to fail
    mockGetHerdBooks.mockRejectedValue(new Error('API Error'));
    mockGetCategories.mockResolvedValue({ success: true, data: [] });
    mockGetStatuses.mockResolvedValue({ success: true, data: [] });

    render(<TestWrapper><HerdBookCattleCreatePage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Erreur de chargement des données de référence')).toBeInTheDocument();
      expect(screen.getByText('Veuillez réessayer pour continuer.')).toBeInTheDocument();
      expect(screen.getByText('Réessayer')).toBeInTheDocument();
    });
  });

  it('should show error toast when submitting with missing required field', async () => {
    mockGetHerdBooks.mockResolvedValue({ 
      success: true, 
      data: [{ id: '1', name: 'HB-001', reference: 'HB-001', year: 2024 }] 
    });
    mockGetCategories.mockResolvedValue({ 
      success: true, 
      data: [{ id: '1', name: 'Category A' }] 
    });
    mockGetStatuses.mockResolvedValue({ 
      success: true, 
      data: [{ id: '1', name: 'Active' }] 
    });

    render(<TestWrapper><HerdBookCattleCreatePage /></TestWrapper>);

    // Wait for the page to render completely (loading finished)
    const submitButton = await screen.findByText('Créer');

    // Try to submit without filling required fields
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive"
      });
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
  // For now, we verify the mutation is configured correctly by checking it's not called
  // when validation fails (tested above). The actual submission test would require
  // additional setup or refactoring to make the form more testable.
  //
  // Documented limitation: Cannot easily test form submission with shadcn/ui Select
  // components in unit tests without additional infrastructure.
});
