import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import SuppliersListPage from '../SuppliersListPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseSuppliers } = vi.hoisted(() => ({ mockUseSuppliers: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../hooks/purchasesHooks', () => ({
  useSuppliers: () => mockUseSuppliers(),
}));

describe('SuppliersListPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseSuppliers.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      error: null,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <SuppliersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Fournisseurs')).toBeInTheDocument();
    expect(screen.getByText('Gestion des fournisseurs de bétail')).toBeInTheDocument();
  });

  it('renders the create button', () => {
    render(
      <TestWrapper>
        <SuppliersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('navigates to create page when clicking create button', () => {
    render(
      <TestWrapper>
        <SuppliersListPage />
      </TestWrapper>
    );

    const createButton = screen.getByText('Créer');
    createButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/admin/suppliers/new');
  });

  it('shows loading state', () => {
    mockUseSuppliers.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <SuppliersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Fournisseurs')).toBeInTheDocument();
  });

  it('renders suppliers data when available', () => {
    mockUseSuppliers.mockReturnValue({
      data: {
        data: [
          { id: '1', name: 'Farm Supply Co', phone: '123456789', email: 'farm@example.com', address: '123 Farm Road' },
          { id: '2', name: 'Cattle Feed Inc', phone: '987654321', email: 'feed@example.com', address: '456 Feed Street' },
        ],
        total: 2,
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <SuppliersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Farm Supply Co')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('Cattle Feed Inc')).toBeInTheDocument();
  });
});
