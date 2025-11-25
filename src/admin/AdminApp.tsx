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
import { TraitementList, TraitementEdit, TraitementCreate, TraitementShow } from './resources/traitements';
import { EvenementList, EvenementEdit, EvenementCreate, EvenementShow } from './resources/evenements';
import { CategoryList, CategoryEdit, CategoryCreate, CategoryShow } from './resources/categories';
import { StatusList, StatusEdit, StatusCreate, StatusShow } from './resources/status';
import { CharactersList, CharactersEdit, CharactersCreate, CharactersShow } from './resources/characters';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import {
    TypeEvenementCreate,
    TypeEvenementEdit,
    TypeEvenementList,
    TypeEvenementShow
} from "@/admin/resources/typeEvenements.tsx";

// Configuration globale pour les confirmations
const defaultOptions = {
    // Activer les confirmations pour toutes les suppressions
    mutationMode: 'pessimistic' as const,
};

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
            {...defaultOptions}
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
            <Resource
                name="typeEvenements"
                list={TypeEvenementList}
                edit={TypeEvenementEdit}
                create={TypeEvenementCreate}
                show={TypeEvenementShow}
                options={{ label: 'Types d\'événements' }}
            />
            <Resource
                name="events"
                list={EvenementList}
                edit={EvenementEdit}
                create={EvenementCreate}
                show={EvenementShow}
                options={{ label: 'Historique des événements' }}
            />
            <Resource
                name="treatments"
                list={TraitementList}
                edit={TraitementEdit}
                create={TraitementCreate}
                show={TraitementShow}
                options={{ label: 'Historique des traitements' }}
            />
            <Resource
                name="categories"
                list={CategoryList}
                edit={CategoryEdit}
                create={CategoryCreate}
                show={CategoryShow}
                options={{ label: 'Catégories' }}
            />
            <Resource
                name="status"
                list={StatusList}
                edit={StatusEdit}
                create={StatusCreate}
                show={StatusShow}
                options={{ label: 'Statuts' }}
            />
            <Resource
                name="characters"
                list={CharactersList}
                edit={CharactersEdit}
                create={CharactersCreate}
                show={CharactersShow}
                options={{ label: 'Caractères' }}
            />
        </Admin>
    );
};