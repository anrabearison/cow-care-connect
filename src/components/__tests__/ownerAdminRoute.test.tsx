/**
 * Tests de OwnerAdminRoute pour valider que seul OWNER_ADMIN accède aux routes
 * business sous /admin (cattle, events, treatments, herd-book-cattle, passports).
 * SUPER_ADMIN et OWNER_USER doivent être redirigés vers /admin.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OwnerAdminRoute } from '../OwnerAdminRoute';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';
import { USER_ROLES } from '@/constants/roles';

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const renderRoute = () => (
  <MemoryRouter initialEntries={['/admin/cattle']}>
    <TestWrapper>
      <Routes>
        <Route
          path="/admin/cattle"
          element={
            <OwnerAdminRoute>
              <div>Admin Cattle Page</div>
            </OwnerAdminRoute>
          }
        />
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </TestWrapper>
  </MemoryRouter>
);

describe('OwnerAdminRoute Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('OWNER_ADMIN should access /admin/cattle', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Owner Admin', email: 'oa@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    render(renderRoute());

    await waitFor(() => {
      expect(screen.getByText('Admin Cattle Page')).toBeInTheDocument();
    });
  });

  it('SUPER_ADMIN should be redirected to /admin when accessing /admin/cattle', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '2', name: 'Super Admin', email: 'sa@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    render(renderRoute());

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
    expect(screen.queryByText('Admin Cattle Page')).not.toBeInTheDocument();
  });

  it('OWNER_USER should be redirected to /admin when accessing /admin/cattle', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '3', name: 'Owner User', email: 'ou@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    render(renderRoute());

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
    expect(screen.queryByText('Admin Cattle Page')).not.toBeInTheDocument();
  });

  it('unauthenticated user should be redirected to /login', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    render(renderRoute());

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});
