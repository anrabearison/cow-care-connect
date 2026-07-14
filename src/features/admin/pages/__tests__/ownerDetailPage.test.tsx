import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OwnerDetailPage from '../OwnerDetailPage';
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

vi.mock('../../services/ownersService', () => ({
  ownersService: {
    getOwnerById: vi.fn().mockResolvedValue({ success: true, data: { id: "1", name: "Detailed Owner", email: "detail@example.com" } }),
    deleteOwner: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe('OwnerDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the details correctly', async () => {
    render(<TestWrapper><OwnerDetailPage /></TestWrapper>);
    
    await waitFor(() => {
      expect(screen.getByText('Détails du propriétaire')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Detailed Owner')[0]).toBeInTheDocument();
    expect(screen.getByText('detail@example.com')).toBeInTheDocument();
  });

  it('should call navigate to edit page when Modifier is clicked', async () => {
    render(<TestWrapper><OwnerDetailPage /></TestWrapper>);
    
    await waitFor(() => {
      expect(screen.getByText('Détails du propriétaire')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Modifier/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/owners/1/edit');
  });
});
