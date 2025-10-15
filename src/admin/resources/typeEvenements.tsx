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
} from 'react-admin';

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
      <DeleteButton />
    </Datagrid>
  </List>
);

// Édition d'un type d'événement
export const TypeEvenementEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="nom" label="Nom" required />
      <TextInput source="description" label="Description" multiline rows={3} />
      <TextInput source="icone" label="Icône (emoji)" />
    </SimpleForm>
  </Edit>
);

// Création d'un type d'événement
export const TypeEvenementCreate = () => (
  <Create>
    <SimpleForm>
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
