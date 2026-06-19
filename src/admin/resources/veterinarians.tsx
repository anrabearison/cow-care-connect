import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  ShowButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  Show,
  SimpleShowLayout,
  EmailField,
  useRecordContext,
} from 'react-admin';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

const veterinarianFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <TextInput source="specialite" label="Spécialité" />,
];

const DeleteButtonField = () => {
  const record = useRecordContext();
  return (
    <ConfirmDeleteButton
      record={record}
      resource="veterinarians"
      title="Supprimer cet intervenant"
      message="Êtes-vous sûr de vouloir supprimer cet intervenant ?"
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
      to={`/admin/veterinarians/${record.id}`}
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
      to={`/admin/veterinarians/${record.id}/show`}
      label="ra.action.show"
      onClick={(e) => e.stopPropagation()}
    >
      <VisibilityIcon />
    </Button>
  );
};

// Liste des intervenants
export const VeterinarianList = () => (
  <List filters={veterinarianFilters}>
    <Datagrid rowClick={(id, resource, record) => `/admin/veterinarians/${id}`}>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <TextField source="specialite" label="Spécialité" />
      <TextField source="phone" label="Téléphone" />
      <EmailField source="email" label="Email" />
      <CustomShowButton />
      <CustomEditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

// Édition d'un intervenant
export const VeterinarianEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source="name" label="Nom" required />
      <TextInput source="specialite" label="Spécialité" />
      <TextInput source="phone" label="Téléphone" />
      <TextInput source="email" label="Email" type="email" />
      <TextInput source="address" label="Adresse" multiline rows={2} />
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

// Création d'un intervenant
export const VeterinarianCreate = () => (
  <Create>
    <SimpleForm toolbar={<CreateToolbar />}>
      <TextInput source="name" label="Nom" required />
      <TextInput source="specialite" label="Spécialité" />
      <TextInput source="phone" label="Téléphone" />
      <TextInput source="email" label="Email" type="email" />
      <TextInput source="address" label="Adresse" multiline rows={2} />
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Create>
);

// Affichage détaillé d'un intervenant
export const VeterinarianShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <TextField source="specialite" label="Spécialité" />
      <TextField source="phone" label="Téléphone" />
      <EmailField source="email" label="Email" />
      <TextField source="address" label="Adresse" />
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);
