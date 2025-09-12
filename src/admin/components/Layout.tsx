import React from 'react';
import { Layout as RALayout, AppBar, UserMenu } from 'react-admin';
import { Settings, HelpCircle, ArrowLeft } from 'lucide-react';

const CustomAppBar = () => (
  <AppBar>
    <a 
      href="/" 
      className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
      title="Retour au front office"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Front Office</span>
    </a>
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