import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TreatmentsEditPage from '../TreatmentsEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/admin/hooks/treatmentsHooks', () => ({
  useUpdateTreatment: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('TreatmentsEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the edit page and shows validation errors', async () => {
    render(
      <TestWrapper>
        <TreatmentsEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le traitement')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le bovin est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le type est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('La date est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le produit est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le vétérinaire est obligatoire')).toBeInTheDocument();
    });
  });
});
