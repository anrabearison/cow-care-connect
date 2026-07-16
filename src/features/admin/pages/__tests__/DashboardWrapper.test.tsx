/**
 * Tests du composant DashboardWrapper
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardWrapper from '../DashboardWrapper';
import { USER_ROLES } from '@/constants/roles';
import { useAuth } from '@/features/auth/AuthContext';

// Mock useAuth hook
vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('DashboardWrapper Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const createWrapper = () => {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  };

  describe('SUPER_ADMIN role', () => {
    it('✓ SUPER_ADMIN doit voir PlatformDashboard', () => {
      const mockUser = {
        id: 'user-1',
        name: 'Super Admin',
        email: 'superadmin@example.com',
        role: USER_ROLES.SUPER_ADMIN,
        isActive: true,
      };

      vi.mocked(useAuth).mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
      });

      render(<DashboardWrapper />, { wrapper: createWrapper() });

      // Vérifier que PlatformDashboard est rendu (titre spécifique)
      expect(screen.getByText('Tableau de bord Plateforme')).toBeInTheDocument();
    });
  });

  describe('OWNER_ADMIN role', () => {
    it('✓ OWNER_ADMIN doit voir FarmDashboard', () => {
      const mockUser = {
        id: 'user-2',
        name: 'Owner Admin',
        email: 'owneradmin@example.com',
        role: USER_ROLES.OWNER_ADMIN,
        isActive: true,
        ownerId: 'owner-1',
      };

      vi.mocked(useAuth).mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
      });

      render(<DashboardWrapper />, { wrapper: createWrapper() });

      // Vérifier que FarmDashboard est rendu (titre spécifique)
      expect(screen.getByText('Tableau de bord Exploitation')).toBeInTheDocument();
    });
  });

  describe('OWNER_USER role', () => {
    it('✓ OWNER_USER doit voir FarmDashboard', () => {
      const mockUser = {
        id: 'user-3',
        name: 'Owner User',
        email: 'owneruser@example.com',
        role: USER_ROLES.OWNER_USER,
        isActive: true,
        ownerId: 'owner-1',
      };

      vi.mocked(useAuth).mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
      });

      render(<DashboardWrapper />, { wrapper: createWrapper() });

      // Vérifier que FarmDashboard est rendu (titre spécifique)
      expect(screen.getByText('Tableau de bord Exploitation')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('✓ Session en cours de chargement doit afficher le loader et non FarmDashboard', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        isLoading: true,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
      });

      render(<DashboardWrapper />, { wrapper: createWrapper() });

      // Vérifier que le loader est affiché (texte "Chargement...")
      expect(screen.getByText('Chargement...')).toBeInTheDocument();
      
      // Vérifier que ni PlatformDashboard ni FarmDashboard ne sont affichés
      expect(screen.queryByText('Tableau de bord Plateforme')).not.toBeInTheDocument();
      expect(screen.queryByText('Tableau de bord Exploitation')).not.toBeInTheDocument();
    });
  });

  describe('Unexpected role', () => {
    it('✓ Role inattendu une fois session chargée ne doit pas afficher FarmDashboard silencieusement', () => {
      const mockUser = {
        id: 'user-4',
        name: 'Unknown Role',
        email: 'unknown@example.com',
        role: 'UNKNOWN_ROLE' as any, // Role non reconnu
        isActive: true,
      };

      vi.mocked(useAuth).mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
      });

      render(<DashboardWrapper />, { wrapper: createWrapper() });

      // Vérifier que le message d'erreur est affiché
      expect(screen.getByText('Rôle non reconnu')).toBeInTheDocument();
      expect(screen.getByText(/UNKNOWN_ROLE/)).toBeInTheDocument();
      
      // Vérifier que ni PlatformDashboard ni FarmDashboard ne sont affichés
      expect(screen.queryByText('Tableau de bord Plateforme')).not.toBeInTheDocument();
      expect(screen.queryByText('Tableau de bord Exploitation')).not.toBeInTheDocument();
    });

    it('✓ User null après chargement ne doit pas afficher FarmDashboard silencieusement', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
      });

      render(<DashboardWrapper />, { wrapper: createWrapper() });

      // Vérifier que le message d'erreur est affiché
      expect(screen.getByText('Rôle non reconnu')).toBeInTheDocument();
      expect(screen.getByText(/non défini/)).toBeInTheDocument();
      
      // Vérifier que ni PlatformDashboard ni FarmDashboard ne sont affichés
      expect(screen.queryByText('Tableau de bord Plateforme')).not.toBeInTheDocument();
      expect(screen.queryByText('Tableau de bord Exploitation')).not.toBeInTheDocument();
    });
  });
});
