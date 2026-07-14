import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import MedicamentsListPage from '../MedicamentsListPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseMedicaments } = vi.hoisted(() => ({ mockUseMedicaments: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/features/admin/hooks/medicamentsHooks', () => ({
  useMedicaments: () => mockUseMedicaments(),
}));

describe('MedicamentsListPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseMedicaments.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      error: null,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <MedicamentsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Médicaments')).toBeInTheDocument();
    expect(screen.getByText('Gestion des médicaments')).toBeInTheDocument();
  });

  it('renders the create button', () => {
    render(
      <TestWrapper>
        <MedicamentsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('navigates to create page when clicking create button', () => {
    render(
      <TestWrapper>
        <MedicamentsListPage />
      </TestWrapper>
    );

    const createButton = screen.getByText('Créer');
    createButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/admin/medicaments/new');
  });

  it('shows loading state', () => {
    mockUseMedicaments.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <MedicamentsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Médicaments')).toBeInTheDocument();
  });

  it('renders medicaments data when available', () => {
    mockUseMedicaments.mockReturnValue({
      data: {
        data: [
          { id: '1', name: 'Antibiotic A', type: 'Antibiotic', manufacturer: 'PharmaCorp' },
          { id: '2', name: 'Vaccine B', type: 'Vaccine', manufacturer: 'BioMed' },
        ],
        total: 2,
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <MedicamentsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Antibiotic A')).toBeInTheDocument();
    expect(screen.getByText('Antibiotic')).toBeInTheDocument();
    expect(screen.getByText('PharmaCorp')).toBeInTheDocument();
    expect(screen.getByText('Vaccine B')).toBeInTheDocument();
  });
});
