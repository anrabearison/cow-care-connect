import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PurchaseCreatePage from '../PurchaseCreatePage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({ useToast: () => ({ toast: mockToast }) }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../services/purchasesService', () => ({
  purchasesService: {
    createPurchase: vi.fn().mockResolvedValue({ success: true }),
    getSuppliersList: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

vi.mock('../../../services/ownersService', () => ({
  ownersService: {
    getOwnersList: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

describe('PurchaseCreatePage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should render the form correctly', async () => {
    render(<TestWrapper><PurchaseCreatePage /></TestWrapper>);
    await waitFor(() => {
      expect(screen.getByText('Nouvel achat de bétail')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Créer l'achat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
  });

  it('should navigate on cancel', async () => {
    render(<TestWrapper><PurchaseCreatePage /></TestWrapper>);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
    });
    screen.getByRole('button', { name: /Annuler/i }).click();
    expect(mockNavigate).toHaveBeenCalledWith('/admin/purchases');
  });
});
