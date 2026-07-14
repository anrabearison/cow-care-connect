import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HerdBookCreatePage from '../HerdBookCreatePage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../services/herdBooksService', () => ({
  herdBooksService: {
    createHerdBook: vi.fn().mockResolvedValue({ success: true, data: { id: "1", reference: "LT-2024", year: 2024 } }),
  },
}));

vi.mock('../../services/ownersService', () => ({
  ownersService: {
    getOwnersList: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

describe('HerdBookCreatePage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should render the form correctly', () => {
    render(<TestWrapper><HerdBookCreatePage /></TestWrapper>);
    expect(screen.getByText('Nouveau livre de troupeau')).toBeInTheDocument();
    expect(screen.getByLabelText(/Référence/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('should show validation error when reference is missing', async () => {
    render(<TestWrapper><HerdBookCreatePage /></TestWrapper>);
    fireEvent.click(screen.getByRole('button', { name: /Créer/i }));
    await waitFor(() => {
      expect(screen.getByText('La référence est requise')).toBeInTheDocument();
    });
  });

  it('should call navigate on cancel', () => {
    render(<TestWrapper><HerdBookCreatePage /></TestWrapper>);
    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/herd-books');
  });
});
