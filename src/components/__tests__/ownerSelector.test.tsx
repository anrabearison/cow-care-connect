/**
 * Tests de OwnerSelector pour valider le comportement RBAC
 * Valide que SUPER_ADMIN ne voit plus le select de fermes et que OWNER_ADMIN/OWNER_USER voient leur badge
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { OwnerSelector } from '../OwnerSelector';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';
import { useOwnerSelection } from '@/contexts/OwnerSelectionContext';
import { USER_ROLES } from '@/constants/roles';
import { apiClient } from '@/utils/apiClient';

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/contexts/OwnerSelectionContext', () => ({
  useOwnerSelection: vi.fn(),
}));

vi.mock('@/utils/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('OwnerSelector Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SUPER_ADMIN behavior', () => {
    it('should return null for SUPER_ADMIN (no select, no API call)', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      vi.mocked(useOwnerSelection).mockReturnValue({
        selectedOwnerId: null,
        setSelectedOwnerId: vi.fn(),
        selectedOwnerName: null,
        setSelectedOwnerName: vi.fn(),
      });

      const { container } = render(
        <TestWrapper>
          <OwnerSelector />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not call API_ENDPOINTS.OWNERS.BASE for SUPER_ADMIN', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      vi.mocked(useOwnerSelection).mockReturnValue({
        selectedOwnerId: null,
        setSelectedOwnerId: vi.fn(),
        selectedOwnerName: null,
        setSelectedOwnerName: vi.fn(),
      });

      render(
        <TestWrapper>
          <OwnerSelector />
        </TestWrapper>
      );

      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });

  describe('OWNER_ADMIN behavior', () => {
    it('should show badge with owner name for OWNER_ADMIN', async () => {
      const mockOwner = { id: 'owner-1', name: 'Ferme Test' };
      
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      vi.mocked(useOwnerSelection).mockReturnValue({
        selectedOwnerId: 'owner-1',
        setSelectedOwnerId: vi.fn(),
        selectedOwnerName: 'Ferme Test',
        setSelectedOwnerName: vi.fn(),
      });

      vi.mocked(apiClient.get).mockResolvedValue(mockOwner);

      render(
        <TestWrapper>
          <OwnerSelector />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Ferme Test')).toBeInTheDocument();
      });
    });

    it('should call API_ENDPOINTS.OWNERS.byId for OWNER_ADMIN', async () => {
      const mockOwner = { id: 'owner-1', name: 'Ferme Test' };
      
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      vi.mocked(useOwnerSelection).mockReturnValue({
        selectedOwnerId: 'owner-1',
        setSelectedOwnerId: vi.fn(),
        selectedOwnerName: null,
        setSelectedOwnerName: vi.fn(),
      });

      vi.mocked(apiClient.get).mockResolvedValue(mockOwner);

      render(
        <TestWrapper>
          <OwnerSelector />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/api/v1/owners/owner-1');
      });
    });
  });

  describe('OWNER_USER behavior', () => {
    it('should show badge with owner name for OWNER_USER', async () => {
      const mockOwner = { id: 'owner-1', name: 'Ferme Test' };
      
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'User', email: 'user@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      vi.mocked(useOwnerSelection).mockReturnValue({
        selectedOwnerId: 'owner-1',
        setSelectedOwnerId: vi.fn(),
        selectedOwnerName: 'Ferme Test',
        setSelectedOwnerName: vi.fn(),
      });

      vi.mocked(apiClient.get).mockResolvedValue(mockOwner);

      render(
        <TestWrapper>
          <OwnerSelector />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Ferme Test')).toBeInTheDocument();
      });
    });

    it('should call API_ENDPOINTS.OWNERS.byId for OWNER_USER', async () => {
      const mockOwner = { id: 'owner-1', name: 'Ferme Test' };
      
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'User', email: 'user@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      vi.mocked(useOwnerSelection).mockReturnValue({
        selectedOwnerId: 'owner-1',
        setSelectedOwnerId: vi.fn(),
        selectedOwnerName: null,
        setSelectedOwnerName: vi.fn(),
      });

      vi.mocked(apiClient.get).mockResolvedValue(mockOwner);

      render(
        <TestWrapper>
          <OwnerSelector />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/api/v1/owners/owner-1');
      });
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

      vi.mocked(useOwnerSelection).mockReturnValue({
        selectedOwnerId: null,
        setSelectedOwnerId: vi.fn(),
        selectedOwnerName: null,
        setSelectedOwnerName: vi.fn(),
      });

      const { container } = render(
        <TestWrapper>
          <OwnerSelector />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
