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
  useRecordContext,
} from 'react-admin';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

const DeleteButtonField = () => {
  const record = useRecordContext();
  return (
    <ConfirmDeleteButton
      record={record}
      resource="typeEvenements"
      title="Supprimer ce type d'événement"
      message="Êtes-vous sûr de vouloir supprimer ce type d'événement ? Tous les événements de ce type devront être réassignés."
    />
  );
};

// Custom Buttons
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from 'react-admin';

const CustomEditButton = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Button
      component={Link}
      to={`/admin/typeEvenements/${record.id}`}
      label="ra.action.edit"
      onClick={(e) => e.stopPropagation()}
    >
      <EditIcon />
    </Button>
  );
};

// Liste des types d'événements
export const TypeEvenementList = () => (
  <List>
    <Datagrid rowClick={(id, resource, record) => `/admin/typeEvenements/${id}`}>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <TextField source="description" label="Description" />
      <TextField source="icone" label="Icône" />
      <ShowButton />
      <CustomEditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

// Édition d'un type d'événement
export const TypeEvenementEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source="name" label="Nom" required />
      <TextInput source="description" label="Description" multiline rows={3} />
      <TextInput source="icone" label="Icône (emoji)" />
    </SimpleForm>
  </Edit>
);

// Création d'un type d'événement
export const TypeEvenementCreate = () => (
  <Create>
    <SimpleForm toolbar={<CreateToolbar />}>
      <TextInput source="name" label="Nom" required />
      <TextInput source="description" label="Description" multiline rows={3} />
      <TextInput source="icone" label="Icône (emoji)" />
    </SimpleForm>
  </Create>
);

// Affichage détaillé d'un type d'événement
export const TypeEvenementShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <TextField source="description" label="Description" />
      <TextField source="icone" label="Icône" />
    </SimpleShowLayout>
  </Show>
);
