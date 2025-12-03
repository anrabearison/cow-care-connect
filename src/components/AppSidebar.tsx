import { Home, Beef, User, LogOut, Settings, LucideIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
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
import { useCallback } from 'react';
import { MOBILE_SIDEBAR_CLOSE_DELAY_MS, BUTTON_SCALE_CLASSES } from '@/constants/ui';

// Données statiques déplacées hors du composant
const NAVIGATION_ITEMS = [
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Troupeau', url: '/cattle', icon: Beef },
  { title: 'Profil', url: '/profile', icon: User },
];

const ADMIN_ITEMS = [
  { title: 'Administration', url: '/admin', icon: Settings },
];

// Fonction utilitaire pure déplacée hors du composant
const getNavCls = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-primary/10 text-primary font-medium"
    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

// Sous-composant pour éviter la duplication
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

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const collapsed = state === "collapsed";

  const handleNavClick = useCallback((e: React.MouseEvent, url: string) => {
    // Fermer automatiquement le sidebar sur mobile après navigation
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
              <Beef className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Gestion Élevage</h2>
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
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin(user?.role) && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
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