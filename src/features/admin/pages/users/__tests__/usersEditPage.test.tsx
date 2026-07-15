import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UsersEditPage from '../UsersEditPage';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';
import { USER_ROLES } from '@/constants/roles';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseUser } = vi.hoisted(() => ({ mockUseUser: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../hooks/usersHooks', () => ({
  useUpdateUser: () => ({ mutate: mockMutate, isPending: false }),
  useUser: () => mockUseUser(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('UsersEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default SUPER_ADMIN user
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@example.com', role: USER_ROLES.SUPER_ADMIN, ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });
    mockUseUser.mockReturnValue({
      data: { data: { id: '1', name: 'Test User', email: 'test@example.com', role: 'OWNER_USER', ownerId: '', isActive: true } },
      isLoading: false,
      error: null,
    });
  });

  it('renders the edit page with user data', async () => {
    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier l\'utilisateur')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    // Clear the form fields
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('L\'email est obligatoire')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: '1',
        data: {
          name: 'Test User',
          email: 'test@example.com',
          role: 'OWNER_USER',
          ownerId: undefined,
          isActive: true,
        },
      });
    });
  });

  it('shows loading state', async () => {
    mockUseUser.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    // Check that the form is not visible during loading
    expect(screen.queryByText('Modifier l\'utilisateur')).not.toBeInTheDocument();
  });

  it('shows error state when user not found', async () => {
    mockUseUser.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('User not found'),
    });

    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur introuvable')).toBeInTheDocument();
  });

  it('OWNER_ADMIN cannot edit another OWNER_ADMIN', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@example.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    mockUseUser.mockReturnValue({
      data: { data: { id: '2', name: 'Other Admin', email: 'other@example.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1', isActive: true } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Accès refusé')).toBeInTheDocument();
    expect(screen.getByText('Vous ne pouvez modifier que les utilisateurs de rôle Utilisateur Propriétaire.')).toBeInTheDocument();
  });

  it('OWNER_ADMIN cannot edit user from different owner', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@example.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    mockUseUser.mockReturnValue({
      data: { data: { id: '2', name: 'Other User', email: 'other@example.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-2', isActive: true } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Accès refusé')).toBeInTheDocument();
    expect(screen.getByText('Vous ne pouvez modifier que les utilisateurs de votre propriétaire.')).toBeInTheDocument();
  });

  it('OWNER_ADMIN can edit OWNER_USER from same owner', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@example.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    mockUseUser.mockReturnValue({
      data: { data: { id: '2', name: 'Regular User', email: 'user@example.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1', isActive: true } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier l\'utilisateur')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Regular User')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur Propriétaire')).toBeInTheDocument();
    expect(screen.getByText('owner-1')).toBeInTheDocument();
  });

  it('SUPER_ADMIN can edit any user', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Super Admin', email: 'super@example.com', role: USER_ROLES.SUPER_ADMIN, ownerId: null },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    mockUseUser.mockReturnValue({
      data: { data: { id: '2', name: 'Owner Admin', email: 'owner@example.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1', isActive: true } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <UsersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier l\'utilisateur')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Owner Admin')).toBeInTheDocument();
  });
});
