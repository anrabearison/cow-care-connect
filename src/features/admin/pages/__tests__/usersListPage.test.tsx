import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UsersListPage from '../UsersListPage';
import { TestWrapper } from '@/test/test-utils';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseUsers } = vi.hoisted(() => ({ mockUseUsers: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/features/admin/hooks/usersHooks', () => ({
  useUsers: () => mockUseUsers(),
}));

describe('UsersListPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseUsers.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      error: null,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <UsersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
    expect(screen.getByText('Gestion des utilisateurs')).toBeInTheDocument();
  });

  it('renders the create button', () => {
    render(
      <TestWrapper>
        <UsersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('navigates to create page when clicking create button', () => {
    render(
      <TestWrapper>
        <UsersListPage />
      </TestWrapper>
    );

    const createButton = screen.getByText('Créer');
    createButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/admin/users/new');
  });

  it('shows loading state', () => {
    mockUseUsers.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <UsersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
  });

  it('renders users data when available', () => {
    mockUseUsers.mockReturnValue({
      data: {
        data: [
          { id: '1', name: 'Test User', email: 'test@example.com', role: 'OWNER_USER', isActive: true },
          { id: '2', name: 'Another User', email: 'another@example.com', role: 'SUPER_ADMIN', isActive: false },
        ],
        total: 2,
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <UsersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Another User')).toBeInTheDocument();
  });
});
