import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import CategoriesEditPage from '../CategoriesEditPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseCategory } = vi.hoisted(() => ({ mockUseCategory: vi.fn() }));
const { mockUseUpdateCategory } = vi.hoisted(() => ({ mockUseUpdateCategory: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('@/features/admin/hooks/categoriesHooks', () => ({
  useCategory: () => mockUseCategory(),
  useUpdateCategory: () => mockUseUpdateCategory(),
}));

describe('CategoriesEditPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseCategory.mockReturnValue({
      data: { data: { id: '1', name: 'Test Category' } },
      isLoading: false,
      error: null,
    });
    mockUseUpdateCategory.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders the edit page with title', () => {
    render(
      <TestWrapper>
        <CategoriesEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier la catégorie')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseCategory.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <CategoriesEditPage />
      </TestWrapper>
    );
  });

  it('renders form with data when available', () => {
    render(
      <TestWrapper>
        <CategoriesEditPage />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
  });

  it('shows error state when data not found', () => {
    mockUseCategory.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found'),
    });

    render(
      <TestWrapper>
        <CategoriesEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Catégorie introuvable')).toBeInTheDocument();
  });
});
