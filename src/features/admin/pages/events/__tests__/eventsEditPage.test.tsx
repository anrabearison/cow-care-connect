import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EventsEditPage from '../EventsEditPage';
import { TestWrapper } from '@/test/test-utils';

const { mockToast } = vi.hoisted(() => ({ mockToast: vi.fn() }));
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));
const { mockUseEvent } = vi.hoisted(() => ({ mockUseEvent: vi.fn() }));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/features/admin/hooks/eventsHooks', () => ({
  useUpdateEvent: () => ({ mutate: mockMutate, isPending: false }),
  useEvent: () => mockUseEvent(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('EventsEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseEvent.mockReturnValue({
      data: { data: { id: '1', cattleId: 'cattle1', eventTypeId: 'type1', type: 'Birth', date: '2024-01-01', description: 'Test event', details: 'Test details' } },
      isLoading: false,
      error: null,
    });
  });

  it('renders the edit page with event data', async () => {
    render(
      <TestWrapper>
        <EventsEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier l\'événement')).toBeInTheDocument();
    expect(screen.getByDisplayValue('cattle1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <TestWrapper>
        <EventsEditPage />
      </TestWrapper>
    );

    // Clear the required fields
    fireEvent.change(screen.getByLabelText(/bovin/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    await waitFor(() => {
      expect(screen.getByText('Le bovin est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('La date est obligatoire')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(
      <TestWrapper>
        <EventsEditPage />
      </TestWrapper>
    );

    // Click the submit button to open the confirmation dialog
    fireEvent.click(screen.getByRole('button', { name: /^Mettre à jour$/i }));

    // Wait for the confirmation dialog to appear (check for the description text)
    await waitFor(() => {
      expect(screen.getByText(/Êtes-vous sûr de vouloir modifier l'événement/i)).toBeInTheDocument();
    });

    // Click the confirm button in the dialog
    fireEvent.click(screen.getByRole('button', { name: /^Modifier$/i }));

    // Wait for the mutation to be called
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: '1',
          data: {
            cattleId: 'cattle1',
            eventTypeId: 'type1',
            type: 'Birth',
            date: '2024-01-01',
            description: 'Test event',
            details: 'Test details',
          },
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });
  });

  it('shows loading state', async () => {
    mockUseEvent.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <EventsEditPage />
      </TestWrapper>
    );

    // Check that the form is not visible during loading
    expect(screen.queryByText('Modifier l\'événement')).not.toBeInTheDocument();
  });

  it('shows error state when event not found', async () => {
    mockUseEvent.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Event not found'),
    });

    render(
      <TestWrapper>
        <EventsEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Événement introuvable')).toBeInTheDocument();
  });
});
