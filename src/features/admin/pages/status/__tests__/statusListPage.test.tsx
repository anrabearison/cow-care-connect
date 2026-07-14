import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import StatusListPage from '../StatusListPage';

const { mockUseStatuses } = vi.hoisted(() => ({ mockUseStatuses: vi.fn() }));
const { mockUseCreateStatus } = vi.hoisted(() => ({ mockUseCreateStatus: vi.fn() }));
const { mockUseUpdateStatus } = vi.hoisted(() => ({ mockUseUpdateStatus: vi.fn() }));
const { mockUseDeleteStatus } = vi.hoisted(() => ({ mockUseDeleteStatus: vi.fn() }));

vi.mock('../../../hooks/statusHooks', () => ({
  useStatuses: () => mockUseStatuses(),
  useCreateStatus: () => mockUseCreateStatus(),
  useUpdateStatus: () => mockUseUpdateStatus(),
  useDeleteStatus: () => mockUseDeleteStatus(),
}));

describe('StatusListPage', () => {
  beforeEach(() => {
    mockUseStatuses.mockReturnValue({
      data: { data: [{ id: '1', name: 'Test Status', description: 'Test' }], total: 1 },
      isLoading: false,
    });
    mockUseCreateStatus.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseUpdateStatus.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseDeleteStatus.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <StatusListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Statuts')).toBeInTheDocument();
    expect(screen.getByText('Gestion des statuts')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseStatuses.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <TestWrapper>
        <StatusListPage />
      </TestWrapper>
    );
  });

  it('renders data when available', () => {
    render(
      <TestWrapper>
        <StatusListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Status')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    mockUseStatuses.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    });

    render(
      <TestWrapper>
        <StatusListPage />
      </TestWrapper>
    );
  });
});
