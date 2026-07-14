import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import EventsListPage from '../EventsListPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseEvents } = vi.hoisted(() => ({ mockUseEvents: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../hooks/eventsHooks', () => ({
  useEvents: () => mockUseEvents(),
}));

describe('EventsListPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseEvents.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      error: null,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <EventsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Événements')).toBeInTheDocument();
    expect(screen.getByText('Historique des événements')).toBeInTheDocument();
  });

  it('renders the create button', () => {
    render(
      <TestWrapper>
        <EventsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('navigates to create page when clicking create button', () => {
    render(
      <TestWrapper>
        <EventsListPage />
      </TestWrapper>
    );

    const createButton = screen.getByText('Créer');
    createButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/admin/events/new');
  });

  it('shows loading state', () => {
    mockUseEvents.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <EventsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Événements')).toBeInTheDocument();
  });

  it('renders events data when available', () => {
    mockUseEvents.mockReturnValue({
      data: {
        data: [
          { id: '1', date: '2024-01-01', description: 'Test event', cattle: 'Bovin 1', eventType: 'Birth' },
          { id: '2', date: '2024-01-02', description: 'Another event', cattle: 'Bovin 2', eventType: 'Health' },
        ],
        total: 2,
      },
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <EventsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test event')).toBeInTheDocument();
    expect(screen.getByText('Another event')).toBeInTheDocument();
  });
});
