import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  ShowButton,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  Create,
  Show,
  SimpleShowLayout,
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
  useRecordContext,
} from 'react-admin';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

// Filtres pour la liste des événements
const evenementFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <ReferenceInput source="type" reference="typeEvenements" label="Type">
    <AutocompleteInput optionText="nom" />
  </ReferenceInput>,
  <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
    <AutocompleteInput optionText="nom" />
  </ReferenceInput>,
  <DateInput source="date" label="Date" />,
];

const DeleteButtonField = () => {
  const record = useRecordContext();
  return (
    <ConfirmDeleteButton
      record={record}
      resource="events"
      title="Supprimer cet événement"
      message="Êtes-vous sûr de vouloir supprimer cet événement de l'historique ?"
    />
  );
};

// Liste des événements
export const EvenementList = () => (
  <List filters={evenementFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <ReferenceField source="cattleId" reference="cattle" label="Bovin">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="type" reference="typeEvenements" label="Type">
        <TextField source="nom" />
      </ReferenceField>
      <DateField source="date" label="Date" />
      <TextField source="description" label="Description" />
      <ShowButton />
      <EditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

// Édition d'un événement
export const EvenementEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="type" reference="typeEvenements" label="Type">
        <AutocompleteInput optionText="nom" />
      </ReferenceInput>
      <DateInput source="date" label="Date" required />
      <TextInput source="description" label="Description" required />
      <TextInput source="details" label="Détails" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

// Création d'un événement
export const EvenementCreate = () => (
  <Create>
    <SimpleForm toolbar={<CreateToolbar />}>
      <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="type" reference="typeEvenements" label="Type">
        <AutocompleteInput optionText="nom" />
      </ReferenceInput>
      <DateInput source="date" label="Date" required />
      <TextInput source="description" label="Description" required />
      <TextInput source="details" label="Détails" multiline rows={3} />
    </SimpleForm>
  </Create>
);

// Affichage détaillé d'un événement
export const EvenementShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <ReferenceField source="cattleId" reference="cattle" label="Bovin">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="type" reference="typeEvenements" label="Type">
        <TextField source="nom" />
      </ReferenceField>
      <DateField source="date" label="Date" />
      <TextField source="description" label="Description" />
      <TextField source="details" label="Détails" />
    </SimpleShowLayout>
  </Show>
);
