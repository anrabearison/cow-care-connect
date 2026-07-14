import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import CategoriesListPage from '../CategoriesListPage';

const { mockUseCategories } = vi.hoisted(() => ({ mockUseCategories: vi.fn() }));
const { mockUseCreateCategory } = vi.hoisted(() => ({ mockUseCreateCategory: vi.fn() }));
const { mockUseUpdateCategory } = vi.hoisted(() => ({ mockUseUpdateCategory: vi.fn() }));
const { mockUseDeleteCategory } = vi.hoisted(() => ({ mockUseDeleteCategory: vi.fn() }));

vi.mock('@/features/admin/hooks/categoriesHooks', () => ({
  useCategories: () => mockUseCategories(),
  useCreateCategory: () => mockUseCreateCategory(),
  useUpdateCategory: () => mockUseUpdateCategory(),
  useDeleteCategory: () => mockUseDeleteCategory(),
}));

describe('CategoriesListPage', () => {
  beforeEach(() => {
    mockUseCategories.mockReturnValue({
      data: { data: [{ id: '1', name: 'Test Category' }], total: 1 },
      isLoading: false,
    });
    mockUseCreateCategory.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseUpdateCategory.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseDeleteCategory.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <CategoriesListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Catégories')).toBeInTheDocument();
    expect(screen.getByText('Gestion des catégories')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseCategories.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <TestWrapper>
        <CategoriesListPage />
      </TestWrapper>
    );
  });

  it('renders data when available', () => {
    render(
      <TestWrapper>
        <CategoriesListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    mockUseCategories.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    });

    render(
      <TestWrapper>
        <CategoriesListPage />
      </TestWrapper>
    );
  });
});
