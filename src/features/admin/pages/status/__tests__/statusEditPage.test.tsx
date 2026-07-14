import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import StatusEditPage from '../StatusEditPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseStatus } = vi.hoisted(() => ({ mockUseStatus: vi.fn() }));
const { mockUseUpdateStatus } = vi.hoisted(() => ({ mockUseUpdateStatus: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('../../../hooks/statusHooks', () => ({
  useStatus: () => mockUseStatus(),
  useUpdateStatus: () => mockUseUpdateStatus(),
}));

describe('StatusEditPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseStatus.mockReturnValue({
      data: { data: { id: '1', name: 'Test Status', description: 'Test description' } },
      isLoading: false,
      error: null,
    });
    mockUseUpdateStatus.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders the edit page with title', () => {
    render(
      <TestWrapper>
        <StatusEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le statut')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseStatus.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <StatusEditPage />
      </TestWrapper>
    );
  });

  it('renders form with data when available', () => {
    render(
      <TestWrapper>
        <StatusEditPage />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('Test Status')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('shows error state when data not found', () => {
    mockUseStatus.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found'),
    });

    render(
      <TestWrapper>
        <StatusEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Statut introuvable')).toBeInTheDocument();
  });
});
