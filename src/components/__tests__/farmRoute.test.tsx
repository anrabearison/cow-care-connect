/**
 * Tests de FarmRoute pour valider le blocage de SUPER_ADMIN des routes métier
 * Valide que SUPER_ADMIN est redirigé vers /admin lorsqu'il tente d'accéder aux routes protégées
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FarmRoute } from '../FarmRoute';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';
import { USER_ROLES } from '@/constants/roles';

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('FarmRoute Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SUPER_ADMIN access to farm routes', () => {
    it('SUPER_ADMIN should be redirected to /admin when accessing /cattle', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/cattle']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/cattle"
                element={
                  <FarmRoute>
                    <div>Cattle Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.queryByText('Cattle Page')).not.toBeInTheDocument();
        expect(screen.getByText('Admin Page')).toBeInTheDocument();
      });
    });

    it('SUPER_ADMIN should be redirected to /admin when accessing /cattle/:id', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/cattle/123']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/cattle/:id"
                element={
                  <FarmRoute>
                    <div>Cattle Detail Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.queryByText('Cattle Detail Page')).not.toBeInTheDocument();
        expect(screen.getByText('Admin Page')).toBeInTheDocument();
      });
    });

    it('SUPER_ADMIN should be redirected to /admin when accessing /reports', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/reports']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/reports"
                element={
                  <FarmRoute>
                    <div>Reports Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.queryByText('Reports Page')).not.toBeInTheDocument();
        expect(screen.getByText('Admin Page')).toBeInTheDocument();
      });
    });

    it('SUPER_ADMIN should be redirected to /admin when accessing /reports/passport', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/reports/passport']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/reports/passport"
                element={
                  <FarmRoute>
                    <div>Passport Report Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.queryByText('Passport Report Page')).not.toBeInTheDocument();
        expect(screen.getByText('Admin Page')).toBeInTheDocument();
      });
    });
  });

  describe('OWNER_ADMIN access to farm routes', () => {
    it('OWNER_ADMIN should access /cattle successfully', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/cattle']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/cattle"
                element={
                  <FarmRoute>
                    <div>Cattle Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Cattle Page')).toBeInTheDocument();
        expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
      });
    });

    it('OWNER_ADMIN should access /reports/passport successfully', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/reports/passport']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/reports/passport"
                element={
                  <FarmRoute>
                    <div>Passport Report Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Passport Report Page')).toBeInTheDocument();
        expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
      });
    });
  });

  describe('OWNER_USER access to farm routes', () => {
    it('OWNER_USER should access /cattle successfully', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'User', email: 'user@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/cattle']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/cattle"
                element={
                  <FarmRoute>
                    <div>Cattle Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Cattle Page')).toBeInTheDocument();
        expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
      });
    });

    it('OWNER_USER should access /reports/passport successfully', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'User', email: 'user@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/reports/passport']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/reports/passport"
                element={
                  <FarmRoute>
                    <div>Passport Report Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Passport Report Page')).toBeInTheDocument();
        expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
      });
    });
  });

  describe('Unauthenticated user', () => {
    it('should redirect to /login when not authenticated', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => (
        <MemoryRouter initialEntries={['/cattle']}>
          <TestWrapper>
            <Routes>
              <Route
                path="/cattle"
                element={
                  <FarmRoute>
                    <div>Cattle Page</div>
                  </FarmRoute>
                }
              />
              <Route path="/admin" element={<div>Admin Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </TestWrapper>
        </MemoryRouter>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.queryByText('Cattle Page')).not.toBeInTheDocument();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });
  });
});
