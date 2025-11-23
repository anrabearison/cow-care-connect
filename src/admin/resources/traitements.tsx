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
  SelectInput,
  Create,
  Show,
  SimpleShowLayout,
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
} from 'react-admin';

// Filtres pour la liste des traitements
const traitementFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <SelectInput source="type" label="Type" choices={[
    { id: 'Antibiotique', name: 'Antibiotique' },
    { id: 'Vaccin', name: 'Vaccin' },
    { id: 'Vermifuge', name: 'Vermifuge' },
    { id: 'Anti-inflammatoire', name: 'Anti-inflammatoire' },
    { id: 'Vitamine', name: 'Vitamine' },
    { id: 'Autre', name: 'Autre' },
  ]} />,
  <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
    <AutocompleteInput optionText="name" />
  </ReferenceInput>,
  <ReferenceInput source="product" reference="medicaments" label="Médicament">
    <AutocompleteInput optionText="nom" />
  </ReferenceInput>,
  <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
    <AutocompleteInput optionText="nom" />
  </ReferenceInput>,
  <DateInput source="date" label="Date" />,
];

// Liste des traitements
export const TraitementList = () => (
  <List filters={traitementFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <ReferenceField source="cattleId" reference="cattle" label="Bovin">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="type" label="Type" />
      <DateField source="date" label="Date" />
      <ReferenceField source="product" reference="medicaments" label="Médicament">
        <TextField source="nom" />
      </ReferenceField>
      <TextField source="dosage" label="Dose" />
      <ReferenceField source="veterinarian" reference="veterinarians" label="Intervenant">
        <TextField source="nom" />
      </ReferenceField>
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// Édition d'un traitement
export const TraitementEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <SelectInput
        source="type"
        label="Type"
        choices={[
          { id: 'Antibiotique', name: 'Antibiotique' },
          { id: 'Vaccin', name: 'Vaccin' },
          { id: 'Vermifuge', name: 'Vermifuge' },
          { id: 'Anti-inflammatoire', name: 'Anti-inflammatoire' },
          { id: 'Vitamine', name: 'Vitamine' },
          { id: 'Autre', name: 'Autre' },
        ]}
        required
      />
      <DateInput source="date" label="Date" required />
      <ReferenceInput source="product" reference="medicaments" label="Médicament">
        <AutocompleteInput optionText="nom" />
      </ReferenceInput>
      <TextInput source="dosage" label="Dose" required />
      <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
        <AutocompleteInput optionText="nom" />
      </ReferenceInput>
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

// Création d'un traitement
export const TraitementCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <SelectInput
        source="type"
        label="Type"
        choices={[
          { id: 'Antibiotique', name: 'Antibiotique' },
          { id: 'Vaccin', name: 'Vaccin' },
          { id: 'Vermifuge', name: 'Vermifuge' },
          { id: 'Anti-inflammatoire', name: 'Anti-inflammatoire' },
          { id: 'Vitamine', name: 'Vitamine' },
          { id: 'Autre', name: 'Autre' },
        ]}
        required
      />
      <DateInput source="date" label="Date" required />
      <ReferenceInput source="product" reference="medicaments" label="Médicament">
        <AutocompleteInput optionText="nom" />
      </ReferenceInput>
      <TextInput source="dosage" label="Dose" required />
      <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
        <AutocompleteInput optionText="nom" />
      </ReferenceInput>
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Create>
);

// Affichage détaillé d'un traitement
export const TraitementShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <ReferenceField source="cattleId" reference="cattle" label="Bovin">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="type" label="Type" />
      <DateField source="date" label="Date" />
      <ReferenceField source="product" reference="medicaments" label="Médicament">
        <TextField source="nom" />
      </ReferenceField>
      <TextField source="dosage" label="Dose" />
      <ReferenceField source="veterinarian" reference="veterinarians" label="Intervenant">
        <TextField source="nom" />
      </ReferenceField>
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);
