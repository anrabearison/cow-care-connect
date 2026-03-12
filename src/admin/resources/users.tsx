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
  ReferenceInput,
  ReferenceField,
} from 'react-admin';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';
import { USER_ROLES, ROLE_LABELS } from '@/constants/roles';

// Role choices for select inputs
const roleChoices = [
  { id: USER_ROLES.SUPER_ADMIN, name: ROLE_LABELS[USER_ROLES.SUPER_ADMIN] },
  { id: USER_ROLES.OWNER_ADMIN, name: ROLE_LABELS[USER_ROLES.OWNER_ADMIN] },
  { id: USER_ROLES.OWNER_USER, name: ROLE_LABELS[USER_ROLES.OWNER_USER] },
];

const userFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <SelectInput source="role" label="Rôle" choices={roleChoices} />,
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

import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from 'react-admin';

const CustomEditButton = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Button
      component={Link}
      to={`/admin/users/${record.id}`}
      label="ra.action.edit"
      onClick={(e) => e.stopPropagation()}
    >
      <EditIcon />
    </Button>
  );
};

const CustomShowButton = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Button
      component={Link}
      to={`/admin/users/${record.id}/show`}
      label="ra.action.show"
      onClick={(e) => e.stopPropagation()}
    >
      <VisibilityIcon />
    </Button>
  );
};

// Liste des utilisateurs
export const UserList = () => (
  <List filters={userFilters}>
    <Datagrid rowClick={(id, resource, record) => `/admin/users/${id}`}>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="role" label="Rôle" />
      <ReferenceField source="ownerId" reference="owners" label="Propriétaire" link="show">
        <TextField source="name" />
      </ReferenceField>
      <CustomShowButton />
      <CustomEditButton />
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
        choices={roleChoices}
        required
      />
      <ReferenceInput source="ownerId" reference="owners" label="Propriétaire">
        <SelectInput optionText="name" />
      </ReferenceInput>
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
        choices={roleChoices}
        required
      />
      <ReferenceInput source="ownerId" reference="owners" label="Propriétaire">
        <SelectInput optionText="name" />
      </ReferenceInput>
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