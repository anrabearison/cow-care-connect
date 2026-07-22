import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UsersDetailPage from '../UsersDetailPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockDeleteMutate } = vi.hoisted(() => ({ mockDeleteMutate: vi.fn() }));
const { mockUseUser } = vi.hoisted(() => ({ mockUseUser: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../../../hooks/usersHooks', () => ({
  useDeleteUser: () => ({ mutate: mockDeleteMutate, isPending: false }),
  useUser: () => mockUseUser(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('UsersDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      data: { data: { id: '1', name: 'Test User', email: 'test@example.com', role: 'OWNER_USER', isActive: true, owner: { id: 'owner-1', name: 'Test Owner', phone: '034 00 000 00', address: '123 Owner St' } } },
      isLoading: false,
      error: null,
    });
  });

  it('renders the detail page and delete dialog', async () => {
    render(
      <TestWrapper>
        <UsersDetailPage />
      </TestWrapper>
    );

    expect(screen.getByText('Détail de l\'utilisateur')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Modifier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument();
  });

  it('shows delete confirmation dialog when delete button is clicked', async () => {
    render(
      <TestWrapper>
        <UsersDetailPage />
      </TestWrapper>
    );

    const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Êtes-vous sûr de vouloir supprimer cet utilisateur/i)).toBeInTheDocument();
    });
  });

  it('calls delete mutation when confirmed', async () => {
    render(
      <TestWrapper>
        <UsersDetailPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText(/Êtes-vous sûr de vouloir supprimer cet utilisateur/i)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    const confirmButton = buttons.find(btn => btn.textContent?.trim() === 'Supprimer' && btn.className.includes('destructive'));
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith('1');
    });
  });

  it('displays owner information when user has owner', async () => {
    render(
      <TestWrapper>
        <UsersDetailPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Owner')).toBeInTheDocument();
    expect(screen.getByText('034 00 000 00')).toBeInTheDocument();
    expect(screen.getByText('123 Owner St')).toBeInTheDocument();
  });

  it('displays "Aucun — rôle plateforme" for SUPER_ADMIN without owner', async () => {
    mockUseUser.mockReturnValue({
      data: { data: { id: '1', name: 'Super Admin', email: 'super@example.com', role: 'SUPER_ADMIN', isActive: true, owner: null } },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <UsersDetailPage />
      </TestWrapper>
    );

    expect(screen.getByText('Aucun — rôle plateforme')).toBeInTheDocument();
  });
});
