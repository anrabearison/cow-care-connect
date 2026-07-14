import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import EventTypesEditPage from '../EventTypesEditPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseEventType } = vi.hoisted(() => ({ mockUseEventType: vi.fn() }));
const { mockUseUpdateEventType } = vi.hoisted(() => ({ mockUseUpdateEventType: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('../../../hooks/eventTypesHooks', () => ({
  useEventType: () => mockUseEventType(),
  useUpdateEventType: () => mockUseUpdateEventType(),
}));

describe('EventTypesEditPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseEventType.mockReturnValue({
      data: { data: { id: '1', name: 'Test Event Type', description: 'Test description', icon: 'test' } },
      isLoading: false,
      error: null,
    });
    mockUseUpdateEventType.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders the edit page with title', () => {
    render(
      <TestWrapper>
        <EventTypesEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le type d\'événement')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseEventType.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <EventTypesEditPage />
      </TestWrapper>
    );
  });

  it('renders form with data when available', () => {
    render(
      <TestWrapper>
        <EventTypesEditPage />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('Test Event Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('shows error state when data not found', () => {
    mockUseEventType.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found'),
    });

    render(
      <TestWrapper>
        <EventTypesEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Type d\'événement introuvable')).toBeInTheDocument();
  });
});
