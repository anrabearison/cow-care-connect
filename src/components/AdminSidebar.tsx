import {
  Beef,
  Users,
  Building2,
  Stethoscope,
  Pill,
  Calendar,
  Activity,
  Tag,
  Flag,
  Brain,
  Book,
  FileText,
  Mail,
  LogOut,
  LucideIcon,
  Settings,
  ShoppingCart,
  Truck,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { isSuperAdmin } from '@/constants/roles';
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
import { useCallback, useState, useEffect } from 'react';
import { MOBILE_SIDEBAR_CLOSE_DELAY_MS, BUTTON_SCALE_CLASSES } from '@/constants/ui';

const NAVIGATION_GROUPS = [
  {
    label: 'Général',
    items: [
      { title: 'Tableau de bord', url: '/admin', icon: Settings },
    ],
  },
  {
    label: 'Gestion du troupeau',
    items: [
      { title: 'Bovins', url: '/admin/cattle', icon: Beef },
      { title: 'Inscriptions bovins', url: '/admin/herd-book-cattle', icon: FileText },
    ],
  },
  {
    label: 'Personnel',
    items: [
      { title: 'Utilisateurs', url: '/admin/users', icon: Users },
      { title: 'Intervenants', url: '/admin/veterinarians', icon: Stethoscope },
    ],
  },
  {
    label: 'Médical',
    items: [
      { title: 'Médicaments', url: '/admin/medicaments', icon: Pill },
      { title: 'Traitements', url: '/admin/treatments', icon: Activity },
      { title: 'Événements', url: '/admin/events', icon: Calendar },
    ],
  },
  {
    label: 'Référence',
    items: [
      { title: 'Catégories', url: '/admin/categories', icon: Tag },
      { title: 'Statuts', url: '/admin/status', icon: Flag },
      { title: 'Caractères', url: '/admin/characters', icon: Brain },
      { title: 'Types événements', url: '/admin/event-types', icon: Calendar },
    ],
  },
  {
    label: 'Administration',
    items: [
      { title: 'Livres de troupeau', url: '/admin/herd-books', icon: Book },
    ],
  },
  {
    label: 'Achats',
    items: [
      { title: 'Historique achats', url: '/admin/purchases', icon: ShoppingCart },
      { title: 'Fournisseurs', url: '/admin/suppliers', icon: Truck },
    ],
  },
];

const SUPER_ADMIN_GROUPS = [
  {
    label: 'Super Admin',
    items: [
      { title: 'Propriétaires', url: '/admin/owners', icon: Building2 },
      { title: 'Invitations', url: '/admin/invitations', icon: Mail },
    ],
  },
];

const getNavCls = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-primary/10 text-primary font-medium"
    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

interface NavItemProps {
  item: { title: string; url: string; icon: LucideIcon };
  collapsed: boolean;
  onNavClick: (e: React.MouseEvent, url: string) => void;
}

const NavItem = ({ item, collapsed, onNavClick }: NavItemProps) => (
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton asChild className={BUTTON_SCALE_CLASSES}>
      <NavLink
        to={item.url}
        end
        className={getNavCls}
        onClick={(e) => onNavClick(e, item.url)}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{item.title}</span>}
      </NavLink>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export function AdminSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  const collapsed = state === "collapsed";

  // Initialize all groups as collapsed by default
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const allGroups = new Set<string>();
    NAVIGATION_GROUPS.forEach(g => allGroups.add(g.label));
    SUPER_ADMIN_GROUPS.forEach(g => allGroups.add(g.label));
    return allGroups;
  });

  // Auto-expand the group containing the current URL
  useEffect(() => {
    const currentPath = location.pathname;
    let groupToExpand: string | null = null;

    // Check navigation groups
    for (const group of NAVIGATION_GROUPS) {
      if (group.items.some(item => currentPath.startsWith(item.url))) {
        groupToExpand = group.label;
        break;
      }
    }

    // Check super admin groups if not found
    if (!groupToExpand && isSuperAdmin(user?.role)) {
      for (const group of SUPER_ADMIN_GROUPS) {
        if (group.items.some(item => currentPath.startsWith(item.url))) {
          groupToExpand = group.label;
          break;
        }
      }
    }

    if (groupToExpand) {
      setCollapsedGroups(prev => {
        const next = new Set(prev);
        next.delete(groupToExpand!);
        return next;
      });
    }
  }, [location.pathname, user?.role]);

  const toggleGroup = useCallback((groupLabel: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupLabel)) {
        // If already collapsed, expand it and collapse all others
        next.clear();
        // Keep all groups collapsed except the one being expanded
        NAVIGATION_GROUPS.forEach(g => {
          if (g.label !== groupLabel) next.add(g.label);
        });
        SUPER_ADMIN_GROUPS.forEach(g => {
          if (g.label !== groupLabel) next.add(g.label);
        });
      } else {
        // If expanded, collapse it
        next.add(groupLabel);
      }
      return next;
    });
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent, url: string) => {
    if (isMobile && state === "expanded") {
      setTimeout(() => {
        setOpenMobile(false);
      }, MOBILE_SIDEBAR_CLOSE_DELAY_MS);
    }
  }, [isMobile, state, setOpenMobile]);

  const handleLogout = useCallback(() => {
    if (isMobile && state === "expanded") {
      setOpenMobile(false);
    }
    logout();
  }, [isMobile, state, setOpenMobile, logout]);

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Administration</h2>
              <p className="text-xs text-muted-foreground">{user?.name}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {NAVIGATION_GROUPS.map((group) => {
          const isGroupCollapsed = collapsedGroups.has(group.label);
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel
                className={collapsed ? "sr-only" : "cursor-pointer hover:bg-muted/50 transition-colors"}
                onClick={() => !collapsed && toggleGroup(group.label)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{group.label}</span>
                  {!collapsed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
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
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <NavItem
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

        {isSuperAdmin(user?.role) && SUPER_ADMIN_GROUPS.map((group) => {
          const isGroupCollapsed = collapsedGroups.has(group.label);
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel
                className={collapsed ? "sr-only" : "cursor-pointer hover:bg-muted/50 transition-colors"}
                onClick={() => !collapsed && toggleGroup(group.label)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{group.label}</span>
                  {!collapsed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
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
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <NavItem
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

        <div className="mt-auto p-3">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
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
