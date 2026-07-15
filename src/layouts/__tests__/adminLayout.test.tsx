/**
 * Tests de AdminLayout pour valider le comportement RBAC
 * Valide que le titre et le bouton Front Office s'affichent correctement selon le rôle
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from '../AdminLayout';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';
import { USER_ROLES } from '@/constants/roles';

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock window.matchMedia for responsive hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('AdminLayout Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SUPER_ADMIN behavior', () => {
    it('should show "Administration - Plateforme" title for SUPER_ADMIN', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter>
          <TestWrapper>
            <AdminLayout />
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      expect(screen.getByText('Administration - Plateforme')).toBeInTheDocument();
    });

    it('should hide Front Office button for SUPER_ADMIN', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter>
          <TestWrapper>
            <AdminLayout />
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      expect(screen.queryByText('Retour à mon élevage')).not.toBeInTheDocument();
      expect(screen.queryByText('Front Office')).not.toBeInTheDocument();
    });
  });

  describe('OWNER_ADMIN behavior', () => {
    it('should show "Administration - Mon exploitation" title for OWNER_ADMIN', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter>
          <TestWrapper>
            <AdminLayout />
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      expect(screen.getByText('Administration - Mon exploitation')).toBeInTheDocument();
    });

    it('should show Front Office button for OWNER_ADMIN', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter>
          <TestWrapper>
            <AdminLayout />
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      expect(screen.getByText('Retour à mon élevage')).toBeInTheDocument();
    });
  });

  describe('OWNER_USER behavior', () => {
    it('should show "Administration - Mon exploitation" title for OWNER_USER', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'User', email: 'user@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter>
          <TestWrapper>
            <AdminLayout />
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      expect(screen.getByText('Administration - Mon exploitation')).toBeInTheDocument();
    });

    it('should show Front Office button for OWNER_USER', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'User', email: 'user@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter>
          <TestWrapper>
            <AdminLayout />
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      expect(screen.getByText('Retour à mon élevage')).toBeInTheDocument();
    });
  });
});
