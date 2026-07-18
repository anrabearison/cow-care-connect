/**
 * Tests du composant UnifiedSidebar
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { UnifiedSidebar } from '../UnifiedSidebar';
import { USER_ROLES, UserRole } from '@/constants/roles';
import { useAuth } from '@/features/auth/AuthContext';
import { useSidebar, SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock useAuth hook
vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock useSidebar hook
vi.mock('@/components/ui/sidebar', async () => {
  const actual = await vi.importActual('@/components/ui/sidebar');
  return {
    ...actual,
    useSidebar: vi.fn(),
  };
});

// Mock useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}));

describe('UnifiedSidebar Tests', () => {
  const mockUser = {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: USER_ROLES.SUPER_ADMIN as UserRole,
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
    });
    vi.mocked(useSidebar).mockReturnValue({
      state: 'expanded',
      open: true,
      setOpen: vi.fn(),
      setOpenMobile: vi.fn(),
      isMobile: false,
      openMobile: false,
      toggleSidebar: vi.fn(),
    });
    vi.mocked(useIsMobile).mockReturnValue(false);
  });

  describe('Active group auto-expansion', () => {
    it('✓ Le groupe contenant la route active s\'affiche ouvert au premier rendu sans clic nécessaire', () => {
      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="admin" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Vérifier que le groupe "Personnel" est présent (contient /admin/users)
      expect(screen.getByText('Personnel')).toBeInTheDocument();
    });

    it('✓ Changer de route vers un autre groupe fait apparaître le nouveau groupe actif ouvert', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="admin" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Vérifier que "Personnel" est présent initialement
      expect(screen.getByText('Personnel')).toBeInTheDocument();

      // Naviguer vers une route dans un autre groupe
      rerender(
        <MemoryRouter initialEntries={['/admin/categories']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="admin" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Vérifier que le groupe "Référence" est maintenant présent
      expect(screen.getByText('Référence')).toBeInTheDocument();
    });
  });

  describe('Manual toggle behavior', () => {
    it('✓ Fermer manuellement un groupe puis naviguer vers une route d\'un autre groupe fonctionne normalement', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="admin" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Le groupe "Personnel" est présent
      expect(screen.getByText('Personnel')).toBeInTheDocument();

      // Cliquer pour fermer le groupe
      const groupLabel = screen.getByText('Personnel');
      fireEvent.click(groupLabel);

      // Naviguer vers une route dans un autre groupe
      rerender(
        <MemoryRouter initialEntries={['/admin/categories']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="admin" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Le nouveau groupe "Référence" doit être présent
      expect(screen.getByText('Référence')).toBeInTheDocument();
    });

    it('✓ L\'utilisateur peut fermer manuellement le groupe actif', () => {
      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="admin" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Le groupe "Personnel" est présent
      expect(screen.getByText('Personnel')).toBeInTheDocument();

      // Cliquer sur le bouton de fermeture du groupe
      const groupLabel = screen.getByText('Personnel');
      fireEvent.click(groupLabel);

      // Le groupe doit toujours être présent (mais fermé)
      expect(screen.getByText('Personnel')).toBeInTheDocument();
    });
  });

  describe('No render loops', () => {
    it('✓ Aucune boucle de mise à jour excessive ne se produit', () => {
      // Spy sur console.warn pour détecter les avertissements de React
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="admin" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Vérifier qu'aucun avertissement "Maximum update depth exceeded" n'apparaît
      expect(consoleWarnSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Maximum update depth exceeded')
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Initial state', () => {
    it('✓ Tous les groupes sont fermés par défaut sauf le groupe actif', () => {
      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="admin" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Le groupe actif "Personnel" est présent
      expect(screen.getByText('Personnel')).toBeInTheDocument();

      // Les autres groupes doivent être présents aussi (mais fermés)
      expect(screen.getByText('Référence')).toBeInTheDocument();
      expect(screen.queryByText('Médical')).not.toBeInTheDocument(); // SUPER_ADMIN ne voit plus Médical
    });
  });

  describe('Frontoffice mode', () => {
    it('✓ Le mode frontoffice ne déclenche pas la logique de groupes admin', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <SidebarProvider>
            <Routes>
              <Route path="/*" element={<UnifiedSidebar mode="frontoffice" />} />
            </Routes>
          </SidebarProvider>
        </MemoryRouter>
      );

      // Vérifier que les éléments frontoffice sont présents
      expect(screen.getByText('Accueil')).toBeInTheDocument();
      
      // Vérifier qu'aucun groupe admin n'est affiché
      expect(screen.queryByText('Gestion du troupeau')).not.toBeInTheDocument();
    });
  });
});
