import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UsersEditPage from '../UsersEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseUser } = vi.hoisted(() => ({ mockUseUser: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/admin/hooks/usersHooks', () => ({
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
});
