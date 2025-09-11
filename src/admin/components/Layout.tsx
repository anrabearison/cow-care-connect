import React from 'react';
import { Layout as RALayout, AppBar, UserMenu } from 'react-admin';
import { Settings, HelpCircle } from 'lucide-react';

const CustomAppBar = () => (
  <AppBar>
    <span className="flex-1" />
    <UserMenu>
      <div className="flex items-center gap-2 p-2">
        <Settings className="h-4 w-4" />
        <span>Paramètres</span>
      </div>
      <div className="flex items-center gap-2 p-2">
        <HelpCircle className="h-4 w-4" />
        <span>Aide</span>
      </div>
    </UserMenu>
  </AppBar>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RALayout appBar={CustomAppBar}>
    {children}
  </RALayout>
);