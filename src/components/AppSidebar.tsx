import {
  Home, Beef, User, LogOut, Settings, ChartColumn, IdCard,
  ShieldCheck, ClipboardList, ArrowRightLeft, ChevronDown, LucideIcon
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { isAdmin } from '@/constants/roles';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useState } from 'react';
import { MOBILE_SIDEBAR_CLOSE_DELAY_MS, BUTTON_SCALE_CLASSES } from '@/constants/ui';

// ─── Données de navigation ────────────────────────────────────────────────────

const NAVIGATION_ITEMS = [
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Troupeau', url: '/cattle', icon: Beef },
  { title: 'Profil', url: '/profile', icon: User },
];

const REPORT_ITEMS = [
  { title: 'Passeports', url: '/reports/passport', icon: IdCard, exact: false },
  { title: 'Rapport Sanitaire', url: '/reports/health', icon: ShieldCheck, exact: false, disabled: true },
  { title: 'Inventaire', url: '/reports/inventory', icon: ClipboardList, exact: false, disabled: true },
  { title: 'Transferts', url: '/reports/transfers', icon: ArrowRightLeft, exact: false, disabled: true },
];

const ADMIN_ITEMS = [
  { title: 'Administration', url: '/admin', icon: Settings },
];

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const getNavCls = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'bg-primary/10 text-primary font-medium'
    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground';

// ─── Sous-composants ──────────────────────────────────────────────────────────

interface NavItemProps {
  item: { title: string; url: string; icon: LucideIcon; exact?: boolean; disabled?: boolean };
  collapsed: boolean;
  onNavClick: (e: React.MouseEvent, url: string) => void;
  indented?: boolean;
}

const NavItem = ({ item, collapsed, onNavClick, indented = false }: NavItemProps) => {
  if (item.disabled) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild className={BUTTON_SCALE_CLASSES}>
          <span
            className={`flex items-center gap-2 opacity-40 cursor-not-allowed ${indented && !collapsed ? 'pl-7' : ''}`}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">{item.title}</span>}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className={BUTTON_SCALE_CLASSES}>
        <NavLink
          to={item.url}
          end={item.exact ?? true}
          className={({ isActive }) =>
            `${getNavCls({ isActive })} ${indented && !collapsed ? 'pl-7' : ''}`
          }
          onClick={(e) => onNavClick(e, item.url)}
          title={collapsed ? item.title : undefined}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm">{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const collapsed = state === 'collapsed';

  // Rapports ouverts par défaut si on est sur une page rapport
  const isOnReports = location.pathname.startsWith('/reports');
  const [reportsOpen, setReportsOpen] = useState(isOnReports);

  const handleNavClick = useCallback((e: React.MouseEvent, url: string) => {
    if (isMobile && state === 'expanded') {
      setTimeout(() => setOpenMobile(false), MOBILE_SIDEBAR_CLOSE_DELAY_MS);
    }
  }, [isMobile, state, setOpenMobile]);

  const handleLogout = useCallback(() => {
    if (isMobile && state === 'expanded') setOpenMobile(false);
    logout();
  }, [isMobile, state, setOpenMobile, logout]);

  const toggleReports = useCallback(() => {
    if (!collapsed) setReportsOpen((v) => !v);
  }, [collapsed]);

  const handleReportsClick = useCallback((e: React.MouseEvent) => {
    navigate('/reports');
    if (!collapsed) setReportsOpen(true);
    handleNavClick(e, '/reports');
  }, [collapsed, handleNavClick, navigate]);

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center">
              <Beef className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">{user?.owner?.name || 'Gestion Élevage'}</h2>
              <p className="text-xs text-muted-foreground">{user?.name}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center">
              <Beef className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation principale */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION_ITEMS.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  collapsed={collapsed}
                  onNavClick={handleNavClick}
                />
              ))}

              {/* Groupe Rapports avec sous-menu */}
              {collapsed ? (
                // En mode réduit : juste l'icône, lien vers /reports
                <NavItem
                  item={{ title: 'Rapports', url: '/reports', icon: ChartColumn, exact: false }}
                  collapsed={collapsed}
                  onNavClick={handleNavClick}
                />
              ) : (
                <>
                  {/* Bouton accordéon Rapports */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={BUTTON_SCALE_CLASSES}>
                      <button
                        onClick={handleReportsClick}
                        className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
                          isOnReports
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <ChartColumn className="h-4 w-4 shrink-0" />
                          <span>Rapports</span>
                        </span>
                        <ChevronDown
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReports();
                          }}
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${reportsOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Sous-items */}
                  {reportsOpen && (
                    <div className="overflow-hidden">
                      <SidebarMenu className="border-l border-border ml-5 pl-1">
                        {REPORT_ITEMS.map((item) => (
                          <NavItem
                            key={item.url}
                            item={item}
                            collapsed={false}
                            onNavClick={handleNavClick}
                            indented={false}
                          />
                        ))}
                      </SidebarMenu>
                    </div>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administration */}
        {isAdmin(user?.role) && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_ITEMS.map((item) => (
                  <NavItem
                    key={item.title}
                    item={item}
                    collapsed={collapsed}
                    onNavClick={handleNavClick}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Déconnexion */}
        <div className="mt-auto p-3">
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            onClick={handleLogout}
            className={`w-full text-destructive hover:text-destructive hover:bg-destructive/10 ${BUTTON_SCALE_CLASSES}`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="ml-2">Déconnexion</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
