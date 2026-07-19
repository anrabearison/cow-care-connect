import {
  Home, Beef, User, LogOut, Settings, ChartColumn, IdCard,
  ShieldCheck, ClipboardList, ArrowRightLeft, ChevronDown, ChevronRight,
  LucideIcon, Building2, Stethoscope, Pill, Calendar, Activity, Tag, Flag,
  Brain, Book, Mail, ShoppingCart, Truck, Crown, Folder, Heart,
  FileText, ShoppingBag, Bookmark
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole } from '@/constants/roles';
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
import { useCallback, useState, useEffect, useMemo } from 'react';
import { MOBILE_SIDEBAR_CLOSE_DELAY_MS, BUTTON_SCALE_CLASSES } from '@/constants/ui';
import {
  NavItem,
  NavGroup,
  FRONT_OFFICE_ITEMS,
  REPORT_ITEMS,
  FRONT_OFFICE_ADMIN_ITEMS,
  ADMIN_NAVIGATION_GROUPS,
  ADMIN_STANDALONE_ITEMS,
  filterNavItems,
  filterNavGroups,
} from '@/config/navigation';

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const getNavCls = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'bg-primary/10 text-primary font-medium'
    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground';

// ─── Sous-composants ──────────────────────────────────────────────────────────

interface UnifiedNavItemProps {
  item: NavItem;
  collapsed: boolean;
  onNavClick: (e: React.MouseEvent, url: string) => void;
  indented?: boolean;
}

const UnifiedNavItem = ({ item, collapsed, onNavClick, indented = false }: UnifiedNavItemProps) => {
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

interface UnifiedSidebarProps {
  mode: 'frontoffice' | 'admin';
}

export function UnifiedSidebar({ mode }: UnifiedSidebarProps) {
  const { state, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const collapsed = state === 'collapsed';
  const userRole = user?.role as UserRole | undefined;

  // Filter navigation based on user role (memoized to prevent reference changes)
  const frontofficeItems = useMemo(() => filterNavItems(FRONT_OFFICE_ITEMS, userRole), [userRole]);
  const reportItems = useMemo(() => filterNavItems(REPORT_ITEMS, userRole), [userRole]);
  const frontofficeAdminItems = useMemo(() => filterNavItems(FRONT_OFFICE_ADMIN_ITEMS, userRole), [userRole]);
  const adminGroups = useMemo(() => filterNavGroups(ADMIN_NAVIGATION_GROUPS, userRole), [userRole]);
  const adminStandaloneItems = useMemo(() => filterNavItems(ADMIN_STANDALONE_ITEMS, userRole), [userRole]);

  // Calculate the active group label based on current route (pure calculation, no state mutation)
  const activeGroupLabel = useMemo(() => {
    if (mode !== 'admin') return null;

    const currentPath = location.pathname;
    for (const group of adminGroups) {
      if (group.items.some(item => currentPath.startsWith(item.url))) {
        return group.label;
      }
    }
    return null;
  }, [location.pathname, adminGroups, mode]);

  // Rapports ouverts par défaut si on est sur une page rapport (frontoffice only)
  const isOnReports = location.pathname.startsWith('/reports');
  const [reportsOpen, setReportsOpen] = useState(isOnReports);

  // Initialize all admin groups as collapsed by default
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const allGroups = new Set<string>();
    adminGroups.forEach(g => allGroups.add(g.label));
    return allGroups;
  });

  const toggleGroup = useCallback((groupLabel: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupLabel)) {
        // If already collapsed, expand it and collapse all others
        next.clear();
        adminGroups.forEach(g => {
          if (g.label !== groupLabel) next.add(g.label);
        });
      } else {
        // If expanded, collapse it
        next.add(groupLabel);
      }
      return next;
    });
  }, [adminGroups]);

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

  // Determine header content based on mode
  const headerTitle = mode === 'admin' ? 'Administration' : (user?.owner?.name || 'Gestion Élevage');
  const headerSubtitle = user?.name || '';
  const HeaderIcon = mode === 'admin' ? Settings : Beef;

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center">
              <HeaderIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">{headerTitle}</h2>
              <p className="text-xs text-muted-foreground">{headerSubtitle}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center">
              <HeaderIcon className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {mode === 'frontoffice' ? (
          <>
            {/* Navigation principale */}
            <SidebarGroup>
              <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {frontofficeItems.map((item) => (
                    <UnifiedNavItem
                      key={item.title}
                      item={item}
                      collapsed={collapsed}
                      onNavClick={handleNavClick}
                    />
                  ))}

                  {/* Groupe Rapports avec sous-menu */}
                  {reportItems.length > 0 && (
                    collapsed ? (
                      <UnifiedNavItem
                        item={{ title: 'Rapports', url: '/reports', icon: ChartColumn, exact: false, roles: [] }}
                        collapsed={collapsed}
                        onNavClick={handleNavClick}
                      />
                    ) : (
                      <>
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

                        {reportsOpen && (
                          <div className="overflow-hidden">
                            <SidebarMenu className="border-l border-border ml-5 pl-1">
                              {reportItems.map((item) => (
                                <UnifiedNavItem
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
                    )
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Administration */}
            {frontofficeAdminItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
                  Administration
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {frontofficeAdminItems.map((item) => (
                      <UnifiedNavItem
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
          </>
        ) : (
          <>
            {/* Items admin autonomes (sans groupe/accordéon), ex: Tableau de bord */}
            {adminStandaloneItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminStandaloneItems.map((item) => (
                      <UnifiedNavItem
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
            {/* Admin navigation with groups */}
            {adminGroups.map((group) => {
              // Group is collapsed if user manually closed it AND it's not the active group
              const isGroupCollapsed = collapsedGroups.has(group.label) && group.label !== activeGroupLabel;
              return (
                <SidebarGroup key={group.label}>
                  <SidebarGroupLabel
                    className={collapsed ? 'sr-only' : ''}
                    onClick={() => !collapsed && toggleGroup(group.label)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <group.icon className="h-4 w-4" />
                        <span className="text-sm">{group.label}</span>
                      </div>
                      {!collapsed && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          aria-label={isGroupCollapsed ? `Déplier ${group.label}` : `Replier ${group.label}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroup(group.label);
                          }}
                        >
                          {isGroupCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </SidebarGroupLabel>
                  {!collapsed && !isGroupCollapsed && (
                    <SidebarGroupContent>
                      <SidebarMenu className="border-l border-border ml-5 pl-1">
                        {group.items.map((item) => (
                          <UnifiedNavItem
                            key={item.title}
                            item={item}
                            collapsed={collapsed}
                            onNavClick={handleNavClick}
                          />
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  )}
                </SidebarGroup>
              );
            })}
          </>
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
            {!collapsed && <span className="ml-2 text-sm">Déconnexion</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
