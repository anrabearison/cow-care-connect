import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UsersCreatePage from '../UsersCreatePage';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../hooks/usersHooks', () => ({
  useCreateUser: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('UsersCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the create page and shows validation errors', async () => {
    vi.mocked(useAuth).mockReturnValue({ 
      user: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'SUPER_ADMIN', ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });
    
    render(
      <TestWrapper>
        <UsersCreatePage />
      </TestWrapper>
    );

    expect(screen.getByText('Nouvel utilisateur')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Créer$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('L\'email est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le mot de passe est obligatoire')).toBeInTheDocument();
    });
  });

  it('restricts role selection for OWNER_ADMIN', async () => {
    vi.mocked(useAuth).mockReturnValue({ 
      user: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'OWNER_ADMIN', ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });
    
    render(
      <TestWrapper>
        <UsersCreatePage />
      </TestWrapper>
    );

    expect(screen.getByText('Nouvel utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur Propriétaire')).toBeInTheDocument();
    expect(screen.queryByText('Super Administrateur')).not.toBeInTheDocument();
  });

  it('forces ownerId for OWNER_ADMIN', async () => {
    vi.mocked(useAuth).mockReturnValue({ 
      user: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'OWNER_ADMIN', ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });
    
    render(
      <TestWrapper>
        <UsersCreatePage />
      </TestWrapper>
    );

    expect(screen.getByText('owner-1')).toBeInTheDocument();
  });
});
