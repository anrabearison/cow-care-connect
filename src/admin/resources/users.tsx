import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteButton,
  ShowButton,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Create,
  Show,
  SimpleShowLayout,
  PasswordInput,
  useRecordContext,
} from 'react-admin';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

const userFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <SelectInput source="role" label="Rôle" choices={[
    { id: 'admin', name: 'Administrateur' },
    { id: 'manager', name: 'Gestionnaire' },
    { id: 'viewer', name: 'Visiteur' },
  ]} />,
];

const DeleteButtonField = () => {
  const record = useRecordContext();
  return (
    <ConfirmDeleteButton
      record={record}
      resource="users"
      title="Supprimer cet utilisateur"
      message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Toutes ses données seront perdues."
    />
  );
};

// Liste des utilisateurs
export const UserList = () => (
  <List filters={userFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="role" label="Rôle" />
      <ShowButton />
      <EditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

// Édition d'un utilisateur
export const UserEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source="name" label="Nom complet" required />
      <TextInput source="email" label="Email" type="email" required />
      <SelectInput
        source="role"
        label="Rôle"
        choices={[
          { id: 'admin', name: 'Administrateur' },
          { id: 'manager', name: 'Gestionnaire' },
          { id: 'viewer', name: 'Visiteur' },
        ]}
        required
      />
      <PasswordInput source="password" label="Nouveau mot de passe (optionnel)" />
    </SimpleForm>
  </Edit>
);

// Création d'un utilisateur
export const UserCreate = () => (
  <Create>
    <SimpleForm toolbar={<CreateToolbar />}>
      <TextInput source="name" label="Nom complet" required />
      <TextInput source="email" label="Email" type="email" required />
      <SelectInput
        source="role"
        label="Rôle"
        choices={[
          { id: 'admin', name: 'Administrateur' },
          { id: 'manager', name: 'Gestionnaire' },
          { id: 'viewer', name: 'Visiteur' },
        ]}
        required
      />
      <PasswordInput source="password" label="Mot de passe" required />
    </SimpleForm>
  </Create>
);

// Affichage détaillé d'un utilisateur
export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom complet" />
      <EmailField source="email" label="Email" />
      <TextField source="role" label="Rôle" />
    </SimpleShowLayout>
  </Show>
);