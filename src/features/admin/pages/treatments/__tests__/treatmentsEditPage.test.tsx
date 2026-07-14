import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TreatmentsEditPage from '../TreatmentsEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseTreatment } = vi.hoisted(() => ({ mockUseTreatment: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../../hooks/treatmentsHooks', () => ({
  useUpdateTreatment: () => ({ mutate: mockMutate, isPending: false }),
  useTreatment: () => mockUseTreatment(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('TreatmentsEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTreatment.mockReturnValue({
      data: { data: { id: '1', cattleId: 'cattle1', type: 'Vaccination', date: '2024-01-01', product: 'Vaccine X', dosage: { quantity: 10, unit: 'ml', animalWeight: 500, notes: 'Administer in neck' }, administrationRoute: 'Intramuscular', veterinarian: 'Dr. Smith', notes: 'Annual vaccination' } },
      isLoading: false,
      error: null,
    });
  });

  it('renders the edit page with treatment data', async () => {
    render(
      <TestWrapper>
        <TreatmentsEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le traitement')).toBeInTheDocument();
    expect(screen.getByDisplayValue('cattle1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Vaccination')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Vaccine X')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <TestWrapper>
        <TreatmentsEditPage />
      </TestWrapper>
    );

    // Clear the required fields
    fireEvent.change(screen.getByLabelText(/bovin/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/type/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/produit/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/vétérinaire/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le bovin est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le type est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('La date est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le produit est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le vétérinaire est obligatoire')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(
      <TestWrapper>
        <TreatmentsEditPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: '1',
        data: {
          cattleId: 'cattle1',
          type: 'Vaccination',
          date: '2024-01-01',
          product: 'Vaccine X',
          dosage: {
            quantity: 10,
            unit: 'ml',
            animalWeight: 500,
            notes: 'Administer in neck',
          },
          administrationRoute: 'Intramuscular',
          veterinarian: 'Dr. Smith',
          notes: 'Annual vaccination',
        },
      });
    });
  });

  it('shows loading state', async () => {
    mockUseTreatment.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <TreatmentsEditPage />
      </TestWrapper>
    );

    // Check that the form is not visible during loading
    expect(screen.queryByText('Modifier le traitement')).not.toBeInTheDocument();
  });

  it('shows error state when treatment not found', async () => {
    mockUseTreatment.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Treatment not found'),
    });

    render(
      <TestWrapper>
        <TreatmentsEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Traitement introuvable')).toBeInTheDocument();
  });
});
