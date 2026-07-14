import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MedicamentsEditPage from '../MedicamentsEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseMedicament } = vi.hoisted(() => ({ mockUseMedicament: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/admin/hooks/medicamentsHooks', () => ({
  useUpdateMedicament: () => ({ mutate: mockMutate, isPending: false }),
  useMedicament: () => mockUseMedicament(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('MedicamentsEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMedicament.mockReturnValue({
      data: { data: { id: '1', name: 'Aspirin', type: 'Painkiller', dosageQuantity: 500, dosageUnit: 'mg', dosageWeight: 1, dosageWeightUnit: 'kg', dosageNotes: 'Take with food', defaultRoute: 'Oral', withdrawalPeriodMeat: 7, withdrawalPeriodMilk: 3, manufacturer: 'PharmaCo', notes: 'Store in cool place' } },
      isLoading: false,
      error: null,
    });
  });

  it('renders the edit page with medicament data', async () => {
    render(
      <TestWrapper>
        <MedicamentsEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le médicament')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Aspirin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Painkiller')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <TestWrapper>
        <MedicamentsEditPage />
      </TestWrapper>
    );

    // Clear the required fields
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/type/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le type est obligatoire')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(
      <TestWrapper>
        <MedicamentsEditPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: '1',
        data: {
          name: 'Aspirin',
          type: 'Painkiller',
          dosageQuantity: 500,
          dosageUnit: 'mg',
          dosageWeight: 1,
          dosageWeightUnit: 'kg',
          dosageNotes: 'Take with food',
          defaultRoute: 'Oral',
          withdrawalPeriodMeat: 7,
          withdrawalPeriodMilk: 3,
          manufacturer: 'PharmaCo',
          notes: 'Store in cool place',
        },
      });
    });
  });

  it('shows loading state', async () => {
    mockUseMedicament.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <MedicamentsEditPage />
      </TestWrapper>
    );

    // Check that the form is not visible during loading
    expect(screen.queryByText('Modifier le médicament')).not.toBeInTheDocument();
  });

  it('shows error state when medicament not found', async () => {
    mockUseMedicament.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Medicament not found'),
    });

    render(
      <TestWrapper>
        <MedicamentsEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Médicament introuvable')).toBeInTheDocument();
  });
});
