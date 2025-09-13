import { Home, Beef, User, LogOut, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

const navigationItems = [
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Troupeau', url: '/cattle', icon: Beef },
  { title: 'Profil', url: '/profile', icon: User },
];

const adminItems = [
  { title: 'Administration', url: '/admin', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const collapsed = state === "collapsed";

  const handleNavClick = (e: React.MouseEvent, url: string) => {
    // Gérer la fermeture automatique sur mobile après clic
    if (window.innerWidth < 768 && !collapsed) {
      // Petit délai pour permettre la navigation avant de fermer
      setTimeout(() => {
        if (state === "expanded") {
          // Le sidebar se fermera automatiquement sur mobile
        }
      }, 150);
    }
  };
  
  return (
    <Sidebar className={collapsed ? "w-14" : "w-48"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-3">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-full bg-gradient-primary flex items-center justify-center">
              <Beef className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-semibold">Gestion Élevage</h2>
              <p className="text-xs text-muted-foreground truncate">{user?.name}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-7 w-7 rounded-full bg-gradient-primary flex items-center justify-center">
              <Beef className="h-3.5 w-3.5 text-white" />
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
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      onClick={(e) => handleNavClick(e, item.url)}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls}
                        onClick={(e) => handleNavClick(e, item.url)}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <div className="mt-auto p-3">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={logout}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2 truncate">Déconnexion</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}