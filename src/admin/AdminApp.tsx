import React from 'react';
import { Admin, Resource } from 'react-admin';
import {
    Agriculture,
    Category,
    Event,
    EventNote,
    Flag,
    Healing,
    MedicalServices,
    Medication,
    People,
    Psychology,
    Business
} from '@mui/icons-material';
import { isSuperAdmin } from '@/constants/roles';

import { dataProvider as apiDataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { CattleCreate, CattleEdit, CattleList, CattleShow } from './resources/cattle';
import { UserCreate, UserEdit, UserList, UserShow } from './resources/users';
import { VeterinarianCreate, VeterinarianEdit, VeterinarianList, VeterinarianShow } from './resources/veterinarians';
import { MedicamentCreate, MedicamentEdit, MedicamentList, MedicamentShow } from './resources/medicaments';
import { TraitementCreate, TraitementEdit, TraitementList, TraitementShow } from './resources/traitements';
import { EvenementCreate, EvenementEdit, EvenementList, EvenementShow } from './resources/evenements';
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from './resources/categories';
import { StatusCreate, StatusEdit, StatusList, StatusShow } from './resources/status';
import { CharactersCreate, CharactersEdit, CharactersList, CharactersShow } from './resources/characters';
import { OwnerCreate, OwnerEdit, OwnerList, OwnerShow } from './resources/owners';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import {
    TypeEvenementCreate,
    TypeEvenementEdit,
    TypeEvenementList,
    TypeEvenementShow
} from "@/admin/resources/typeEvenements.tsx";
import { AdminLogin } from './pages/AdminLogin';

import { adminTheme } from './theme';

// Configuration globale pour les confirmations
const defaultOptions = {
    // Activer les confirmations pour toutes les suppressions
    mutationMode: 'pessimistic' as const,
};

export const AdminApp: React.FC = () => {
    // Sélection du data provider
    const dataProvider = apiDataProvider;

    return (
        <Admin
            basename="/admin"
            dataProvider={dataProvider}
            authProvider={authProvider}
            loginPage={AdminLogin}
            theme={adminTheme}
            dashboard={Dashboard}
            layout={Layout}
            title="Administration - Gestion du Bétail"
            {...defaultOptions}
        >
            {(permissions) => (
                <>
                    <Resource
                        name="cattle"
                        list={CattleList}
                        edit={CattleEdit}
                        create={CattleCreate}
                        show={CattleShow}
                        icon={Agriculture}
                        options={{ label: 'Bovins' }}
                    />
                    <Resource
                        name="users"
                        list={UserList}
                        edit={UserEdit}
                        create={UserCreate}
                        show={UserShow}
                        icon={People}
                        options={{ label: 'Utilisateurs' }}
                    />
                    {isSuperAdmin(permissions) && (
                        <Resource
                            name="owners"
                            list={OwnerList}
                            edit={OwnerEdit}
                            create={OwnerCreate}
                            show={OwnerShow}
                            icon={Business}
                            options={{ label: 'Propriétaires' }}
                        />
                    )}
                    <Resource
                        name="veterinarians"
                        list={VeterinarianList}
                        edit={VeterinarianEdit}
                        create={VeterinarianCreate}
                        show={VeterinarianShow}
                        icon={MedicalServices}
                        options={{ label: 'Intervenants' }}
                    />
                    <Resource
                        name="medicaments"
                        list={MedicamentList}
                        edit={MedicamentEdit}
                        create={MedicamentCreate}
                        show={MedicamentShow}
                        icon={Medication}
                        options={{ label: 'Médicaments' }}
                    />
                    <Resource
                        name="typeEvenements"
                        list={TypeEvenementList}
                        edit={TypeEvenementEdit}
                        create={TypeEvenementCreate}
                        show={TypeEvenementShow}
                        icon={EventNote}
                        options={{ label: 'Types d\'événements' }}
                    />
                    <Resource
                        name="events"
                        list={EvenementList}
                        edit={EvenementEdit}
                        create={EvenementCreate}
                        show={EvenementShow}
                        icon={Event}
                        options={{ label: 'Historique des événements' }}
                    />
                    <Resource
                        name="treatments"
                        list={TraitementList}
                        edit={TraitementEdit}
                        create={TraitementCreate}
                        show={TraitementShow}
                        icon={Healing}
                        options={{ label: 'Historique des traitements' }}
                    />
                    <Resource
                        name="categories"
                        list={CategoryList}
                        edit={CategoryEdit}
                        create={CategoryCreate}
                        show={CategoryShow}
                        icon={Category}
                        options={{ label: 'Catégories' }}
                    />
                    <Resource
                        name="status"
                        list={StatusList}
                        edit={StatusEdit}
                        create={StatusCreate}
                        show={StatusShow}
                        icon={Flag}
                        options={{ label: 'Statuts' }}
                    />
                    <Resource
                        name="characters"
                        list={CharactersList}
                        edit={CharactersEdit}
                        create={CharactersCreate}
                        show={CharactersShow}
                        icon={Psychology}
                        options={{ label: 'Caractères' }}
                    />
                </>
            )}
        </Admin>
    );
};