import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UsersCreatePage from '../UsersCreatePage';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseOwnersReferenceData } = vi.hoisted(() => ({ mockUseOwnersReferenceData: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../hooks/usersHooks', () => ({
  useCreateUser: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('../../../hooks/useOwnersReferenceData', () => ({
  useOwnersReferenceData: () => mockUseOwnersReferenceData(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('UsersCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOwnersReferenceData.mockReturnValue({
      owners: [
        { id: 'owner-1', name: 'Owner 1' },
        { id: 'owner-2', name: 'Owner 2' },
      ],
      isLoading: false,
      isError: false,
    });
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

    expect(screen.getByText('Propriétaire de votre organisation')).toBeInTheDocument();
  });

  it('shows owner selector for SUPER_ADMIN', async () => {
    mockUseOwnersReferenceData.mockReturnValue({
      owners: [
        { id: 'owner-1', name: 'Owner 1' },
        { id: 'owner-2', name: 'Owner 2' },
      ],
      isLoading: false,
      isError: false,
    });

    vi.mocked(useAuth).mockReturnValue({ 
      user: { id: '1', name: 'Super Admin', email: 'super@example.com', role: 'SUPER_ADMIN', ownerId: null },
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

    expect(screen.getByText('Propriétaire *')).toBeInTheDocument();
    const ownerSelect = screen.getByRole('combobox', { name: /Propriétaire/i });
    expect(ownerSelect).toBeInTheDocument();
  });

  it('shows validation error when owner is not selected for SUPER_ADMIN', async () => {
    mockUseOwnersReferenceData.mockReturnValue({
      owners: [
        { id: 'owner-1', name: 'Owner 1' },
        { id: 'owner-2', name: 'Owner 2' },
      ],
      isLoading: false,
      isError: false,
    });

    vi.mocked(useAuth).mockReturnValue({ 
      user: { id: '1', name: 'Super Admin', email: 'super@example.com', role: 'SUPER_ADMIN', ownerId: null },
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

    // Fill required fields but not owner
    fireEvent.change(screen.getByLabelText('Nom *'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe *'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /^Créer$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le propriétaire est obligatoire')).toBeInTheDocument();
    });
  });

  it('shows loading state for owners', async () => {
    mockUseOwnersReferenceData.mockReturnValue({
      owners: [],
      isLoading: true,
      isError: false,
    });

    vi.mocked(useAuth).mockReturnValue({ 
      user: { id: '1', name: 'Super Admin', email: 'super@example.com', role: 'SUPER_ADMIN', ownerId: null },
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

    expect(screen.getByText('Chargement des propriétaires...')).toBeInTheDocument();
  });

  it('shows error state when owners loading fails', async () => {
    mockUseOwnersReferenceData.mockReturnValue({
      owners: [],
      isLoading: false,
      isError: true,
    });

    vi.mocked(useAuth).mockReturnValue({ 
      user: { id: '1', name: 'Super Admin', email: 'super@example.com', role: 'SUPER_ADMIN', ownerId: null },
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

    expect(screen.getByText('Erreur lors du chargement des propriétaires')).toBeInTheDocument();
  });
});
