import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OwnerCreatePage from '../OwnerCreatePage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/ownersService', () => ({
  ownersService: {
    createOwner: vi.fn().mockResolvedValue({ success: true, data: { id: "1", name: "Test Owner" } }),
  },
}));

describe('OwnerCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form correctly', () => {
    render(<TestWrapper><OwnerCreatePage /></TestWrapper>);
    expect(screen.getByText('Nouveau propriétaire')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('should show error when required fields are missing', async () => {
    render(<TestWrapper><OwnerCreatePage /></TestWrapper>);
    
    // Attempt to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Créer/i }));
    
    await waitFor(() => {
      // zod schema requires "name"
      expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
    });
  });

  it('should call navigate on cancel', () => {
    render(<TestWrapper><OwnerCreatePage /></TestWrapper>);
    
    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/owners');
  });
});
