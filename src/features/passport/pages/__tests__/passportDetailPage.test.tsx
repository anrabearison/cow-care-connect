import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PassportDetailPage from '../PassportDetailPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

const { mockPassportService } = vi.hoisted(() => ({
  mockPassportService: {
    findOne: vi.fn(),
    delete: vi.fn(),
    generatePdf: vi.fn(),
    downloadPdf: vi.fn(),
  },
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../services/passportService', () => ({
  passportService: mockPassportService,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('PassportDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for passport service - return successful responses
    mockPassportService.findOne.mockResolvedValue({
      id: '1',
      passportNumber: 'PASS-2024-0001',
      location: 'Antananarivo',
      issueDate: '2024-01-01',
      district: 'Antananarivo I',
      applicantName: 'Jean Rasoanaivo',
      cinNumber: '101 234 567 890',
      cinIssueDate: '2020-01-01',
      cinIssueLocation: 'Antananarivo',
      residenceCommune: 'Antananarivo',
      village: 'Andoharanofotsy',
      commune: 'Antananarivo',
      residenceDistrict: 'Antananarivo I',
      region: 'Analamanga',
      purchaseCommune: 'Antananarivo',
      verificationDate: '2024-01-01',
      arreteDate: '2024-01-01',
      status: 'GENERATED',
      herdBookId: 'test-herd-book-id',
      totalCattle: 5,
    });
    mockPassportService.delete.mockResolvedValue(undefined);
  });

  it('should render data in read-only mode when loaded successfully', async () => {
    render(<TestWrapper><PassportDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Détails du Passeport')).toBeInTheDocument();
    });

    // Verify data is displayed
    expect(screen.getByText('PASS-2024-0001')).toBeInTheDocument();
    expect(screen.getByText('Jean Rasoanaivo')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should navigate to edit page when clicking edit button', async () => {
    render(<TestWrapper><PassportDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Détails du Passeport')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Modifier');
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/passports/1/edit');
  });

  it('should open confirm dialog when clicking delete button', async () => {
    mockPassportService.findOne.mockResolvedValue({
      id: '1',
      passportNumber: 'PASS-2024-0001',
      location: 'Antananarivo',
      issueDate: '2024-01-01',
      district: 'Antananarivo I',
      applicantName: 'Jean Rasoanaivo',
      cinNumber: '101 234 567 890',
      cinIssueDate: '2020-01-01',
      cinIssueLocation: 'Antananarivo',
      residenceCommune: 'Antananarivo',
      village: 'Andoharanofotsy',
      commune: 'Antananarivo',
      residenceDistrict: 'Antananarivo I',
      region: 'Analamanga',
      purchaseCommune: 'Antananarivo',
      verificationDate: '2024-01-01',
      arreteDate: '2024-01-01',
      status: 'DRAFT',
      herdBookId: 'test-herd-book-id',
      totalCattle: 5,
    });

    render(<TestWrapper><PassportDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Détails du Passeport')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Supprimer');
    fireEvent.click(deleteButton);

    // ConfirmDialog should be opened - we check for the dialog text
    await waitFor(() => {
      expect(screen.getByText('Supprimer le passeport')).toBeInTheDocument();
    });
  });

  it('should call delete mutation and navigate on confirm delete', async () => {
    mockPassportService.delete.mockResolvedValue(undefined);
    mockPassportService.findOne.mockResolvedValue({
      id: '1',
      passportNumber: 'PASS-2024-0001',
      location: 'Antananarivo',
      issueDate: '2024-01-01',
      district: 'Antananarivo I',
      applicantName: 'Jean Rasoanaivo',
      cinNumber: '101 234 567 890',
      cinIssueDate: '2020-01-01',
      cinIssueLocation: 'Antananarivo',
      residenceCommune: 'Antananarivo',
      village: 'Andoharanofotsy',
      commune: 'Antananarivo',
      residenceDistrict: 'Antananarivo I',
      region: 'Analamanga',
      purchaseCommune: 'Antananarivo',
      verificationDate: '2024-01-01',
      arreteDate: '2024-01-01',
      status: 'DRAFT',
      herdBookId: 'test-herd-book-id',
      totalCattle: 5,
    });

    render(<TestWrapper><PassportDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Détails du Passeport')).toBeInTheDocument();
    });

    // Open delete dialog
    const deleteButton = screen.getAllByText('Supprimer')[0]; // First one is the page button
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Supprimer le passeport')).toBeInTheDocument();
    });

    // Confirm delete - click the "Confirmer" button in the dialog
    const confirmButton = screen.getByText('Confirmer');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockPassportService.delete).toHaveBeenCalledWith('1');
      expect(mockToast).toHaveBeenCalledWith({
        title: "Succès",
        description: "Passeport supprimé avec succès"
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin/passports');
    });
  });

  it('should show error message when data fetch fails', async () => {
    mockPassportService.findOne.mockRejectedValue(new Error('API Error'));

    render(<TestWrapper><PassportDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Passeport introuvable')).toBeInTheDocument();
    });

    expect(screen.getByText('Retour à la liste')).toBeInTheDocument();
  });

  it('should show error message when data is null', async () => {
    mockPassportService.findOne.mockResolvedValue(null);

    render(<TestWrapper><PassportDetailPage /></TestWrapper>);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Passeport introuvable')).toBeInTheDocument();
    });
  });
});
