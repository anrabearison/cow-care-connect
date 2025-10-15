import React from 'react';
import { Admin, Resource } from 'react-admin';
import { API_CONFIG } from '@/config/api';
import { dataProvider as mockDataProvider } from './providers/mockDataProvider';
import { dataProvider as apiDataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { CattleList, CattleEdit, CattleCreate, CattleShow } from './resources/cattle';
import { UserList, UserEdit, UserCreate, UserShow } from './resources/users';
import { VeterinarianList, VeterinarianEdit, VeterinarianCreate, VeterinarianShow } from './resources/veterinarians';
import { MedicamentList, MedicamentEdit, MedicamentCreate, MedicamentShow } from './resources/medicaments';
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
      <Resource
        name="veterinarians"
        list={VeterinarianList}
        edit={VeterinarianEdit}
        create={VeterinarianCreate}
        show={VeterinarianShow}
        options={{ label: 'Intervenants' }}
      />
      <Resource
        name="medicaments"
        list={MedicamentList}
        edit={MedicamentEdit}
        create={MedicamentCreate}
        show={MedicamentShow}
        options={{ label: 'Médicaments' }}
      />
    </Admin>
  );
};