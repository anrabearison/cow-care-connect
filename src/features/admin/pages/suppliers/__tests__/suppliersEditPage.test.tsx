import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SuppliersEditPage from '../SuppliersEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseSupplier } = vi.hoisted(() => ({ mockUseSupplier: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../../hooks/purchasesHooks', () => ({
  useUpdateSupplier: () => ({ mutate: mockMutate, isPending: false }),
  useSupplier: () => mockUseSupplier(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('SuppliersEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSupplier.mockReturnValue({
      data: { data: { id: '1', name: 'Acme Supplies', contactInfo: 'John Doe', phone: '1234567890', email: 'acme@example.com', address: '456 Supply St' } },
      isLoading: false,
      error: null,
    });
  });

  it('renders the edit page with supplier data', async () => {
    render(
      <TestWrapper>
        <SuppliersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le fournisseur')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acme Supplies')).toBeInTheDocument();
    expect(screen.getByDisplayValue('acme@example.com')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <TestWrapper>
        <SuppliersEditPage />
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
        <SuppliersEditPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: '1',
        data: {
          name: 'Acme Supplies',
          contactInfo: 'John Doe',
          phone: '1234567890',
          email: 'acme@example.com',
          address: '456 Supply St',
        },
      });
    });
  });

  it('shows loading state', async () => {
    mockUseSupplier.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <SuppliersEditPage />
      </TestWrapper>
    );

    // Check that the form is not visible during loading
    expect(screen.queryByText('Modifier le fournisseur')).not.toBeInTheDocument();
  });

  it('shows error state when supplier not found', async () => {
    mockUseSupplier.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Supplier not found'),
    });

    render(
      <TestWrapper>
        <SuppliersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Fournisseur introuvable')).toBeInTheDocument();
  });
});
