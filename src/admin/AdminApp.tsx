import React from 'react';
import { Admin, Resource } from 'react-admin';
import { API_CONFIG } from '@/config/api';
import { dataProvider as mockDataProvider } from './providers/mockDataProvider';
import { dataProvider as apiDataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { CattleList, CattleEdit, CattleCreate, CattleShow } from './resources/cattle';
import { UserList, UserEdit, UserCreate, UserShow } from './resources/users';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';

export const AdminApp: React.FC = () => {
  // Sélection du data provider selon la configuration
  const dataProvider = API_CONFIG.USE_MOCK_DATA ? mockDataProvider : apiDataProvider;
  
  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      layout={Layout}
      title="Administration - Gestion du Bétail"
    >
      <Resource
        name="cattle"
        list={CattleList}
        edit={CattleEdit}
        create={CattleCreate}
        show={CattleShow}
        options={{ label: 'Bovins' }}
      />
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        show={UserShow}
        options={{ label: 'Utilisateurs' }}
      />
    </Admin>
  );
};