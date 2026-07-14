import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OwnerEditPage from '../OwnerEditPage';
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
    useParams: () => ({ id: "1" }),
  };
});

vi.mock('../../../services/ownersService', () => ({
  ownersService: {
    getOwnerById: vi.fn().mockResolvedValue({ success: true, data: { id: "1", name: "Existing Owner", email: "test@example.com" } }),
    updateOwner: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe('OwnerEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form with existing data', async () => {
    render(<TestWrapper><OwnerEditPage /></TestWrapper>);
    
    await waitFor(() => {
      expect(screen.getByText('Modifier le propriétaire')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Existing Owner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enregistrer/i })).toBeInTheDocument();
  });

  it('should call navigate on cancel', async () => {
    render(<TestWrapper><OwnerEditPage /></TestWrapper>);
    
    await waitFor(() => {
      expect(screen.getByText('Modifier le propriétaire')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/owners');
  });
});
