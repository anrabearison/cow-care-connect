/**
 * Tests de OwnerBadge pour valider le comportement RBAC
 * Valide que SUPER_ADMIN ne voit pas de badge, et que OWNER_ADMIN/OWNER_USER voient leur badge avec user.owner.name
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OwnerBadge } from '../OwnerBadge';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';
import { USER_ROLES } from '@/constants/roles';

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('OwnerBadge Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SUPER_ADMIN behavior', () => {
    it('should return null for SUPER_ADMIN', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const { container } = render(
        <TestWrapper>
          <OwnerBadge />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('OWNER_ADMIN behavior', () => {
    it('should show badge with owner.name for OWNER_ADMIN', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { 
          id: '1', 
          name: 'Admin', 
          email: 'admin@test.com', 
          role: USER_ROLES.OWNER_ADMIN, 
          ownerId: 'owner-1',
          owner: { id: 'owner-1', name: 'Ferme Test', created_at: '2024-01-01', updated_at: '2024-01-01' }
        },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      render(
        <TestWrapper>
          <OwnerBadge />
        </TestWrapper>
      );

      expect(screen.getByText('Ferme Test')).toBeInTheDocument();
    });

    it('should return null if owner.name is missing for OWNER_ADMIN', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { 
          id: '1', 
          name: 'Admin', 
          email: 'admin@test.com', 
          role: USER_ROLES.OWNER_ADMIN, 
          ownerId: 'owner-1',
          owner: null
        },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const { container } = render(
        <TestWrapper>
          <OwnerBadge />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('OWNER_USER behavior', () => {
    it('should show badge with owner.name for OWNER_USER', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { 
          id: '1', 
          name: 'User', 
          email: 'user@test.com', 
          role: USER_ROLES.OWNER_USER, 
          ownerId: 'owner-1',
          owner: { id: 'owner-1', name: 'Ferme Test', created_at: '2024-01-01', updated_at: '2024-01-01' }
        },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      render(
        <TestWrapper>
          <OwnerBadge />
        </TestWrapper>
      );

      expect(screen.getByText('Ferme Test')).toBeInTheDocument();
    });

    it('should return null if owner.name is missing for OWNER_USER', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { 
          id: '1', 
          name: 'User', 
          email: 'user@test.com', 
          role: USER_ROLES.OWNER_USER, 
          ownerId: 'owner-1',
          owner: null
        },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const { container } = render(
        <TestWrapper>
          <OwnerBadge />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Unauthenticated user', () => {
    it('should return null when user is null', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const { container } = render(
        <TestWrapper>
          <OwnerBadge />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
