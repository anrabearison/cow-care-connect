import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import TreatmentsListPage from '../TreatmentsListPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseTreatments } = vi.hoisted(() => ({ mockUseTreatments: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../hooks/treatmentsHooks', () => ({
  useTreatments: () => mockUseTreatments(),
}));

describe('TreatmentsListPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseTreatments.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      error: null,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <TreatmentsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Traitements')).toBeInTheDocument();
    expect(screen.getByText('Historique des traitements')).toBeInTheDocument();
  });

  it('renders the create button', () => {
    render(
      <TestWrapper>
        <TreatmentsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('navigates to create page when clicking create button', () => {
    render(
      <TestWrapper>
        <TreatmentsListPage />
      </TestWrapper>
    );

    const createButton = screen.getByText('Créer');
    createButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/admin/treatments/new');
  });

  it('shows loading state', () => {
    mockUseTreatments.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <TreatmentsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Traitements')).toBeInTheDocument();
  });

  it('renders treatments data when available', () => {
    mockUseTreatments.mockReturnValue({
      data: {
        data: [
          { 
            id: '1', 
            date: '2024-01-01', 
            cattle: 'Bovin 1', 
            cattleId: 'cattle-1',
            product: 'Antibiotic A',
            veterinarian: 'Dr. Smith',
            dosage: { quantity: 10, unit: 'ml' }
          },
          { 
            id: '2', 
            date: '2024-01-02', 
            cattle: 'Bovin 2', 
            cattleId: 'cattle-2',
            product: 'Vaccine B',
            veterinarian: 'Dr. Jones',
            dosage: { quantity: 5, unit: 'ml' }
          },
        ],
        total: 2,
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <TreatmentsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Bovin 1')).toBeInTheDocument();
    expect(screen.getByText('Antibiotic A')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Bovin 2')).toBeInTheDocument();
  });
});
