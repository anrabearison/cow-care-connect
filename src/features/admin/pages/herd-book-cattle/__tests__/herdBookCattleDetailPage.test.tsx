import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HerdBookCattleDetailPage from '../HerdBookCattleDetailPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockGetHerdBookCattleById } = vi.hoisted(() => ({ mockGetHerdBookCattleById: vi.fn() }));
const { mockDeleteHerdBookCattle } = vi.hoisted(() => ({ mockDeleteHerdBookCattle: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../../services/herdBookCattleService', () => ({
  herdBookCattleService: {
    getHerdBookCattleById: mockGetHerdBookCattleById,
    deleteHerdBookCattle: mockDeleteHerdBookCattle,
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('HerdBookCattleDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render data in read-only mode when loaded successfully', async () => {
    mockGetHerdBookCattleById.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        herdBookId: 'hb1',
        cattleId: 'cattle1',
        categoryId: 'cat1',
        statusId: 'status1',
        nCarnet: '123',
        herdBook: { id: 'hb1', reference: 'HB-001', year: 2024 },
        cattle: { id: 'cattle1', name: 'Bovin Test' },
        category: { id: 'cat1', name: 'Catégorie A' },
        status: { id: 'status1', name: 'Actif' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      }
    });

    render(<TestWrapper><HerdBookCattleDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Détails de l\'inscription')).toBeInTheDocument();
    });

    // Verify data is displayed in read-only mode (no form inputs)
    expect(screen.getByText('HB-001 (2024)')).toBeInTheDocument();
    expect(screen.getByText('Bovin Test')).toBeInTheDocument();
    expect(screen.getByText('Catégorie A')).toBeInTheDocument();
    expect(screen.getByText('Actif')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should navigate to edit page when clicking edit button', async () => {
    mockGetHerdBookCattleById.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        herdBookId: 'hb1',
        cattleId: 'cattle1',
        categoryId: 'cat1',
        statusId: 'status1',
        nCarnet: '123',
      }
    });

    render(<TestWrapper><HerdBookCattleDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Détails de l\'inscription')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Modifier');
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/herd-book-cattle/1/edit');
  });

  it('should open confirm dialog when clicking delete button', async () => {
    mockGetHerdBookCattleById.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        herdBookId: 'hb1',
        cattleId: 'cattle1',
        categoryId: 'cat1',
        statusId: 'status1',
        nCarnet: '123',
      }
    });

    render(<TestWrapper><HerdBookCattleDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Détails de l\'inscription')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Supprimer');
    fireEvent.click(deleteButton);

    // ConfirmDialog should be opened - we check for the dialog text
    await waitFor(() => {
      expect(screen.getByText('Supprimer l\'inscription')).toBeInTheDocument();
    });
  });

  it('should call delete mutation and navigate on confirm delete', async () => {
    mockDeleteHerdBookCattle.mockResolvedValue({ success: true });
    mockGetHerdBookCattleById.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        herdBookId: 'hb1',
        cattleId: 'cattle1',
        categoryId: 'cat1',
        statusId: 'status1',
        nCarnet: '123',
      }
    });

    render(<TestWrapper><HerdBookCattleDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Détails de l\'inscription')).toBeInTheDocument();
    });

    // Open delete dialog
    const deleteButton = screen.getAllByText('Supprimer')[0]; // First one is the page button
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Supprimer l\'inscription')).toBeInTheDocument();
    });

    // Confirm delete - get all buttons and find the one in the dialog
    const allButtons = screen.getAllByText('Supprimer');
    const confirmButton = allButtons[allButtons.length - 1]; // Last one should be in dialog
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteHerdBookCattle).toHaveBeenCalledWith('1');
      expect(mockToast).toHaveBeenCalledWith({
        title: "Succès",
        description: "Inscription supprimée avec succès"
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin/herd-book-cattle');
    });
  });

  it('should show error message when data fetch fails', async () => {
    mockGetHerdBookCattleById.mockResolvedValue({ success: false });

    render(<TestWrapper><HerdBookCattleDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Inscription introuvable')).toBeInTheDocument();
    });

    expect(screen.getByText('Retour à la liste')).toBeInTheDocument();
  });

  it('should show error message when data is null', async () => {
    mockGetHerdBookCattleById.mockResolvedValue({ success: true, data: null });

    render(<TestWrapper><HerdBookCattleDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Inscription introuvable')).toBeInTheDocument();
    });
  });
});
