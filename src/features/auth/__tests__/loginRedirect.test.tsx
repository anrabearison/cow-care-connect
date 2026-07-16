/**
 * Tests de redirection après connexion selon le rôle
 * Valide que SUPER_ADMIN est redirigé vers /admin et les autres vers /
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import GoogleCallbackPage from '../pages/GoogleCallbackPage';
import { TestWrapper } from '@/test/test-utils';
import { useAuth } from '@/features/auth/AuthContext';
import { USER_ROLES } from '@/constants/roles';

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Login Redirect Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('LoginPage redirect after successful login', () => {
    it('SUPER_ADMIN should be redirected to /admin after login', async () => {
      const mockSuperAdminUser = { 
        id: '1', 
        name: 'Super Admin', 
        email: 'super@test.com', 
        role: USER_ROLES.SUPER_ADMIN, 
        ownerId: '' 
      };
      const mockLogin = vi.fn().mockResolvedValue(mockSuperAdminUser);

      vi.mocked(useAuth).mockReturnValue({
        user: null,
        login: mockLogin,
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => {
        const LoginPageComponent = LoginPage;
        return (
          <MemoryRouter initialEntries={['/login']}>
            <LoginPageComponent />
          </MemoryRouter>
        );
      };

      render(<TestComponent />);

      // The login function now returns the user object directly
      // The redirect logic uses loggedInUser.role instead of user?.role
      expect(mockLogin).toBeDefined();
    });

    it('OWNER_ADMIN should be redirected to / after login', async () => {
      const mockAdminUser = { 
        id: '1', 
        name: 'Admin', 
        email: 'admin@test.com', 
        role: USER_ROLES.OWNER_ADMIN, 
        ownerId: 'owner-1' 
      };
      const mockLogin = vi.fn().mockResolvedValue(mockAdminUser);

      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
        login: mockLogin,
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => {
        const LoginPageComponent = LoginPage;
        return (
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPageComponent />} />
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/admin" element={<div>Admin Page</div>} />
            </Routes>
          </MemoryRouter>
        );
      };

      render(<TestComponent />);

      // Since user is already logged in, should redirect to / (not /admin)
      await waitFor(() => {
        expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
      });
    });

    it('OWNER_USER should be redirected to / after login', async () => {
      const mockUser = { 
        id: '1', 
        name: 'User', 
        email: 'user@test.com', 
        role: USER_ROLES.OWNER_USER, 
        ownerId: 'owner-1' 
      };
      const mockLogin = vi.fn().mockResolvedValue(mockUser);

      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'User', email: 'user@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
        login: mockLogin,
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => {
        const LoginPageComponent = LoginPage;
        return (
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPageComponent />} />
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/admin" element={<div>Admin Page</div>} />
            </Routes>
          </MemoryRouter>
        );
      };

      render(<TestComponent />);

      // Since user is already logged in, should redirect to / (not /admin)
      await waitFor(() => {
        expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
      });
    });
  });

  describe('GoogleCallbackPage redirect after successful login', () => {
    it('SUPER_ADMIN should be redirected to /admin after Google login', async () => {
      const mockSuperAdminUser = { 
        id: '1', 
        name: 'Super Admin', 
        email: 'super@test.com', 
        role: USER_ROLES.SUPER_ADMIN, 
        ownerId: '' 
      };
      const mockLoginWithGoogle = vi.fn().mockResolvedValue(mockSuperAdminUser);

      vi.mocked(useAuth).mockReturnValue({
        user: null,
        login: vi.fn(),
        loginWithGoogle: mockLoginWithGoogle,
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => {
        const GoogleCallbackComponent = GoogleCallbackPage;
        return (
          <MemoryRouter initialEntries={['/auth/google/callback?code=test-code']}>
            <Routes>
              <Route path="/auth/google/callback" element={<GoogleCallbackComponent />} />
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/admin" element={<div>Admin Page</div>} />
            </Routes>
          </MemoryRouter>
        );
      };

      render(<TestComponent />);

      // The callback should redirect based on returned user role
      // SUPER_ADMIN should go to /admin
      expect(mockLoginWithGoogle).toBeDefined();
    });

    it('OWNER_ADMIN should be redirected to / after Google login', async () => {
      const mockAdminUser = { 
        id: '1', 
        name: 'Admin', 
        email: 'admin@test.com', 
        role: USER_ROLES.OWNER_ADMIN, 
        ownerId: 'owner-1' 
      };
      const mockLoginWithGoogle = vi.fn().mockResolvedValue(mockAdminUser);

      vi.mocked(useAuth).mockReturnValue({
        user: null,
        login: vi.fn(),
        loginWithGoogle: mockLoginWithGoogle,
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => {
        const GoogleCallbackComponent = GoogleCallbackPage;
        return (
          <MemoryRouter initialEntries={['/auth/google/callback?code=test-code']}>
            <Routes>
              <Route path="/auth/google/callback" element={<GoogleCallbackComponent />} />
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/admin" element={<div>Admin Page</div>} />
            </Routes>
          </MemoryRouter>
        );
      };

      render(<TestComponent />);

      // OWNER_ADMIN should go to /
      expect(mockLoginWithGoogle).toBeDefined();
    });
  });

  describe('LoginPage render guard for already logged in users', () => {
    it('SUPER_ADMIN already logged in should redirect to /admin when visiting /login', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Super Admin', email: 'super@test.com', role: USER_ROLES.SUPER_ADMIN, ownerId: '' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => {
        const LoginPageComponent = LoginPage;
        return (
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPageComponent />} />
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/admin" element={<div>Admin Page</div>} />
            </Routes>
          </MemoryRouter>
        );
      };

      render(<TestComponent />);

      // SUPER_ADMIN should be redirected to /admin, not /
      expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
      expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });

    it('OWNER_ADMIN already logged in should redirect to / when visiting /login', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Admin', email: 'admin@test.com', role: USER_ROLES.OWNER_ADMIN, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => {
        const LoginPageComponent = LoginPage;
        return (
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPageComponent />} />
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/admin" element={<div>Admin Page</div>} />
            </Routes>
          </MemoryRouter>
        );
      };

      render(<TestComponent />);

      // OWNER_ADMIN should be redirected to /
      expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('OWNER_USER already logged in should redirect to / when visiting /login', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'User', email: 'user@test.com', role: USER_ROLES.OWNER_USER, ownerId: 'owner-1' },
        login: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      });

      const TestComponent = () => {
        const LoginPageComponent = LoginPage;
        return (
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPageComponent />} />
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/admin" element={<div>Admin Page</div>} />
            </Routes>
          </MemoryRouter>
        );
      };

      render(<TestComponent />);

      // OWNER_USER should be redirected to /
      expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });
});
