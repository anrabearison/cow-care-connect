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

// Liste des types d'événements
export const TypeEvenementList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="description" label="Description" />
      <TextField source="icone" label="Icône" />
      <ShowButton />
      <EditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

// Édition d'un type d'événement
export const TypeEvenementEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source="nom" label="Nom" required />
      <TextInput source="description" label="Description" multiline rows={3} />
      <TextInput source="icone" label="Icône (emoji)" />
    </SimpleForm>
  </Edit>
);

// Création d'un type d'événement
export const TypeEvenementCreate = () => (
  <Create>
    <SimpleForm toolbar={<CreateToolbar />}>
      <TextInput source="nom" label="Nom" required />
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
      <TextField source="nom" label="Nom" />
      <TextField source="description" label="Description" />
      <TextField source="icone" label="Icône" />
    </SimpleShowLayout>
  </Show>
);
