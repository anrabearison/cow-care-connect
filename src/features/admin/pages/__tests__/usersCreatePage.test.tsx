import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UsersCreatePage from '../UsersCreatePage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/admin/hooks/usersHooks', () => ({
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
});
