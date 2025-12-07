import React from 'react';
import { Layout as RALayout, AppBar, UserMenu, MenuItemLink, Logout, useGetIdentity } from 'react-admin';
import { Settings, HelpCircle, ArrowLeft } from 'lucide-react';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { OwnerSelector } from './OwnerSelector';
import { Menu } from './Menu';

const CustomUserMenu = () => (
  <UserMenu>
    <MenuItemLink
      to="/settings"
      primaryText="Paramètres"
      leftIcon={<Settings />}
    />
    <MenuItemLink
      to="/help"
      primaryText="Aide"
      leftIcon={<HelpCircle />}
    />
    <Logout />
  </UserMenu>
);

const CustomAppBar = () => {
  const { data: identity } = useGetIdentity();

  return (
    <AppBar userMenu={<CustomUserMenu />}>
      <a
        href="/"
        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
        title="Retour au front office"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Front Office</span>
      </a>
      <span className="flex-1" />
      <OwnerSelector />
      {/* @ts-ignore - owner property added in authProvider */}
      {identity?.owner && (
        <span className="mr-4 text-sm font-medium text-white/90 hidden sm:inline-block">
          {identity.owner}
        </span>
      )}
    </AppBar>
  );
};

const CustomFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="text-center py-4 text-sm text-gray-600 border-t">
      © {currentYear} Njara Rabearison. Tous droits réservés.
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RALayout appBar={CustomAppBar} menu={Menu}>
    <AdminBreadcrumb />
    {children}
    <CustomFooter />
  </RALayout>
);