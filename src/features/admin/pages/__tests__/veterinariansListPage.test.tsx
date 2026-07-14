import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import VeterinariansListPage from '../VeterinariansListPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseVeterinarians } = vi.hoisted(() => ({ mockUseVeterinarians: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/features/admin/hooks/veterinariansHooks', () => ({
  useVeterinarians: () => mockUseVeterinarians(),
}));

describe('VeterinariansListPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseVeterinarians.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      error: null,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <VeterinariansListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Vétérinaires')).toBeInTheDocument();
    expect(screen.getByText('Gestion des vétérinaires')).toBeInTheDocument();
  });

  it('renders the create button', () => {
    render(
      <TestWrapper>
        <VeterinariansListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('navigates to create page when clicking create button', () => {
    render(
      <TestWrapper>
        <VeterinariansListPage />
      </TestWrapper>
    );

    const createButton = screen.getByText('Créer');
    createButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/admin/veterinarians/new');
  });

  it('shows loading state', () => {
    mockUseVeterinarians.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <VeterinariansListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Vétérinaires')).toBeInTheDocument();
  });

  it('renders veterinarians data when available', () => {
    mockUseVeterinarians.mockReturnValue({
      data: {
        data: [
          { id: '1', name: 'Dr. Smith', specialty: 'General', phone: '123456789', email: 'smith@example.com' },
          { id: '2', name: 'Dr. Jones', specialty: 'Surgery', phone: '987654321', email: 'jones@example.com' },
        ],
        total: 2,
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <VeterinariansListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jones')).toBeInTheDocument();
  });
});
