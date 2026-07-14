import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import VeterinariansEditPage from '../VeterinariansEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseVeterinarian } = vi.hoisted(() => ({ mockUseVeterinarian: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../../hooks/veterinariansHooks', () => ({
  useUpdateVeterinarian: () => ({ mutate: mockMutate, isPending: false }),
  useVeterinarian: () => mockUseVeterinarian(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('VeterinariansEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseVeterinarian.mockReturnValue({
      data: { data: { id: '1', name: 'Dr. Smith', phone: '1234567890', email: 'dr@example.com', address: '123 Main St', specialty: 'General' } },
      isLoading: false,
      error: null,
    });
  });

  it('renders the edit page with veterinarian data', async () => {
    render(
      <TestWrapper>
        <VeterinariansEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le vétérinaire')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('dr@example.com')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <TestWrapper>
        <VeterinariansEditPage />
      </TestWrapper>
    );

    // Clear the name field
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(
      <TestWrapper>
        <VeterinariansEditPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: '1',
        data: {
          name: 'Dr. Smith',
          phone: '1234567890',
          email: 'dr@example.com',
          address: '123 Main St',
          specialty: 'General',
        },
      });
    });
  });

  it('shows loading state', async () => {
    mockUseVeterinarian.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <VeterinariansEditPage />
      </TestWrapper>
    );

    // Check that the form is not visible during loading
    expect(screen.queryByText('Modifier le vétérinaire')).not.toBeInTheDocument();
  });

  it('shows error state when veterinarian not found', async () => {
    mockUseVeterinarian.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Veterinarian not found'),
    });

    render(
      <TestWrapper>
        <VeterinariansEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Vétérinaire introuvable')).toBeInTheDocument();
  });
});
