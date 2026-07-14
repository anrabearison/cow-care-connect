import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HerdBookEditPage from '../HerdBookEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({ useToast: () => ({ toast: mockToast }) }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate, useParams: () => ({ id: "1" }) };
});

vi.mock('../../services/herdBooksService', () => ({
  herdBooksService: {
    getHerdBookById: vi.fn().mockResolvedValue({ success: true, data: { id: "1", reference: "LT-2024", year: 2024, description: "Test", ownerId: "" } }),
    updateHerdBook: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock('../../services/ownersService', () => ({
  ownersService: {
    getOwnersList: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

describe('HerdBookEditPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should render the form with existing data', async () => {
    render(<TestWrapper><HerdBookEditPage /></TestWrapper>);
    await waitFor(() => {
      expect(screen.getByText('Modifier le livre de troupeau')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('LT-2024')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
  });
});
