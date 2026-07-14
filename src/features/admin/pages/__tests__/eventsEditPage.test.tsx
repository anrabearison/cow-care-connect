import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EventsEditPage from '../EventsEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/admin/hooks/eventsHooks', () => ({
  useUpdateEvent: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('EventsEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the edit page and shows validation errors', async () => {
    render(
      <TestWrapper>
        <EventsEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier l\'événement')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le bovin est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('La date est obligatoire')).toBeInTheDocument();
    });
  });
});
