import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import EventTypesListPage from '../EventTypesListPage';

const { mockUseEventTypes } = vi.hoisted(() => ({ mockUseEventTypes: vi.fn() }));
const { mockUseCreateEventType } = vi.hoisted(() => ({ mockUseCreateEventType: vi.fn() }));
const { mockUseUpdateEventType } = vi.hoisted(() => ({ mockUseUpdateEventType: vi.fn() }));
const { mockUseDeleteEventType } = vi.hoisted(() => ({ mockUseDeleteEventType: vi.fn() }));

vi.mock('../../../hooks/eventTypesHooks', () => ({
  useEventTypes: () => mockUseEventTypes(),
  useCreateEventType: () => mockUseCreateEventType(),
  useUpdateEventType: () => mockUseUpdateEventType(),
  useDeleteEventType: () => mockUseDeleteEventType(),
}));

describe('EventTypesListPage', () => {
  beforeEach(() => {
    mockUseEventTypes.mockReturnValue({
      data: { data: [{ id: '1', name: 'Test Event Type', description: 'Test', icon: 'test' }], total: 1 },
      isLoading: false,
    });
    mockUseCreateEventType.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseUpdateEventType.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseDeleteEventType.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <EventTypesListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Types d\'événements')).toBeInTheDocument();
    expect(screen.getByText('Gestion des types d\'événements')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseEventTypes.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <TestWrapper>
        <EventTypesListPage />
      </TestWrapper>
    );
  });

  it('renders data when available', () => {
    render(
      <TestWrapper>
        <EventTypesListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Event Type')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    mockUseEventTypes.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    });

    render(
      <TestWrapper>
        <EventTypesListPage />
      </TestWrapper>
    );
  });
});
