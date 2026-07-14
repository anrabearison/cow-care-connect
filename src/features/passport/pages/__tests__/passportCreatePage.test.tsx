import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassportCreatePage from '../PassportCreatePage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseHerdBookCattle } = vi.hoisted(() => ({ mockUseHerdBookCattle: vi.fn() }));
const { mockUseHerdBookSelection } = vi.hoisted(() => ({ mockUseHerdBookSelection: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../services/passportService', () => ({
  passportService: {
    create: vi.fn(),
  },
}));

vi.mock('@/features/herdbook/hooks', () => ({
  useHerdBookCattle: () => mockUseHerdBookCattle(),
}));

vi.mock('@/contexts/HerdBookSelectionContext', () => ({
  useHerdBookSelection: () => mockUseHerdBookSelection(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}));

describe('PassportCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHerdBookCattle.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });
    mockUseHerdBookSelection.mockReturnValue({
      selectedHerdBookId: 'test-herd-book-id',
    });
  });

  it('should render without crashing', () => {
    render(<TestWrapper><PassportCreatePage /></TestWrapper>);
    expect(screen.getByText('Nouveau Passeport Bovin')).toBeInTheDocument();
  });

  it('should show error message when no herd book is selected', () => {
    mockUseHerdBookSelection.mockReturnValue({
      selectedHerdBookId: null,
    });

    render(<TestWrapper><PassportCreatePage /></TestWrapper>);
    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Veuillez sélectionner un livre de troupeau')).toBeInTheDocument();
  });

  it('should show error toast when submitting without cattle selection', async () => {
    render(<TestWrapper><PassportCreatePage /></TestWrapper>);

    // Wait for the page to render completely
    const submitButton = await screen.findByText('Créer le brouillon');

    // Click submit
    submitButton.click();

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un bœuf",
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
  // 3. Or test the form component (PassportForm) in isolation with direct prop manipulation
  //
  // For now, we verify the page renders correctly and basic validation works.
  // The actual submission test would require additional setup or refactoring.
  //
  // Documented limitation: Cannot easily test form submission with shadcn/ui Select
  // components in unit tests without additional infrastructure.
});
