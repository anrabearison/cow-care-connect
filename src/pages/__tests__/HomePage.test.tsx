/**
 * Tests for HomePage - Dashboard statistics and recent events rendering
 *
 * These tests ensure that data from useDashboardStats and useRecentEvents
 * hooks is correctly wired into the rendered output. They specifically
 * guard against destructuring regressions (e.g. { stats } vs { data: stats })
 * which cause values to silently fall back to 0.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../HomePage';

// ── Mocks ────────────────────────────────────────────────────────────────

// Mock useAuth
vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', role: 'OWNER_ADMIN', ownerId: 'owner-1' },
  }),
}));

// Mock hero image
vi.mock('@/assets/hero-cattle.jpg', () => ({ default: 'hero.jpg' }));

// Mock event utils
vi.mock('@/features/events/utils', () => ({
  getTypeEvenementIcon: () => '🐄',
  getTypeEvenementName: () => 'Vaccination',
}));

// Mock hooks — default to loading state, overridden per test
const mockUseDashboardStats = vi.fn();
vi.mock('@/hooks/useDashboardStats', () => ({
  useDashboardStats: () => mockUseDashboardStats(),
}));

const mockUseRecentEvents = vi.fn();
vi.mock('@/hooks/useRecentEvents', () => ({
  useRecentEvents: () => mockUseRecentEvents(),
}));

// ── Helpers ──────────────────────────────────────────────────────────────

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// ── Test data ────────────────────────────────────────────────────────────

const MOCK_STATS = {
  totalCattle: 42,
  healthyCattle: 40,
  healthPercentage: 95.24,
  totalEvents: 18,
  totalTreatments: 7,
  males: 20,
  females: 22,
};

const MOCK_EVENTS = [
  {
    id: '1',
    type: '1',
    description: 'Vaccination annuelle',
    cattleName: 'Bella',
    date: '2025-06-15',
  },
  {
    id: '2',
    type: '2',
    description: 'Contrôle de poids',
    cattleName: 'Max',
    date: '2025-06-14',
  },
];

// ── Tests ────────────────────────────────────────────────────────────────

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: loaded with no data
    mockUseDashboardStats.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
    mockUseRecentEvents.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
  });

  describe('Dashboard statistics rendering', () => {
    it('should display actual stat values from the API, not fallback zeros', () => {
      mockUseDashboardStats.mockReturnValue({
        data: MOCK_STATS,
        isLoading: false,
        isError: false,
      });

      renderHomePage();

      // These assertions catch the exact bug: if HomePage destructures
      // { stats } instead of { data: stats }, all values resolve to
      // undefined and the ?? 0 fallback kicks in — every stat shows "0".
      expect(screen.getByText('42')).toBeInTheDocument();       // totalCattle
      expect(screen.getByText('95.24%')).toBeInTheDocument();   // healthPercentage
      expect(screen.getByText('18')).toBeInTheDocument();       // totalEvents
      expect(screen.getByText('7')).toBeInTheDocument();        // totalTreatments
    });

    it('should show 0 fallbacks when stats data is undefined (not yet loaded)', () => {
      mockUseDashboardStats.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      renderHomePage();

      // All four stat cards should show "0" or "0%"
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(3); // totalCattle, totalEvents, totalTreatments
      expect(screen.getByText('0%')).toBeInTheDocument(); // healthPercentage
    });

    it('should show skeletons while stats are loading', () => {
      mockUseDashboardStats.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      renderHomePage();

      // When loading, stat values (42, 18, etc.) should NOT be present
      expect(screen.queryByText('42')).not.toBeInTheDocument();
    });
  });

  describe('Recent events rendering', () => {
    it('should display recent events from the API', () => {
      mockUseRecentEvents.mockReturnValue({
        data: MOCK_EVENTS,
        isLoading: false,
        isError: false,
      });

      renderHomePage();

      // If HomePage destructures { events } instead of { data },
      // recentEvents will be undefined and no events will render.
      expect(screen.getByText('Vaccination annuelle')).toBeInTheDocument();
      expect(screen.getByText('Contrôle de poids')).toBeInTheDocument();
      expect(screen.getByText('Bella')).toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();
    });

    it('should render no event items when events data is undefined', () => {
      mockUseRecentEvents.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      renderHomePage();

      expect(screen.queryByText('Vaccination annuelle')).not.toBeInTheDocument();
    });
  });

  describe('Full page integration', () => {
    it('should render stats and events together correctly', () => {
      mockUseDashboardStats.mockReturnValue({
        data: MOCK_STATS,
        isLoading: false,
        isError: false,
      });
      mockUseRecentEvents.mockReturnValue({
        data: MOCK_EVENTS,
        isLoading: false,
        isError: false,
      });

      renderHomePage();

      // Stats are displayed
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();

      // Events are displayed
      expect(screen.getByText('Vaccination annuelle')).toBeInTheDocument();
      expect(screen.getByText('Bella')).toBeInTheDocument();

      // Welcome message
      expect(screen.getByText(/Bienvenue, Test User/)).toBeInTheDocument();
    });
  });
});
