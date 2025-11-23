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
  SelectInput,
  Create,
  Show,
  SimpleShowLayout,
} from 'react-admin';

const medicamentFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <SelectInput source="type" label="Type" choices={[
    { id: 'Antibiotique', name: 'Antibiotique' },
    { id: 'Vaccin', name: 'Vaccin' },
    { id: 'Vermifuge', name: 'Vermifuge' },
    { id: 'Anti-inflammatoire', name: 'Anti-inflammatoire' },
    { id: 'Vitamine', name: 'Vitamine' },
    { id: 'Autre', name: 'Autre' },
  ]} />,
  <TextInput source="fabricant" label="Fabricant" />,
];

export const MedicamentList = () => (
  <List filters={medicamentFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="type" label="Type" />
      <TextField source="dosageRecommande" label="Dosage recommandé" />
      <TextField source="fabricant" label="Fabricant" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const MedicamentEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="nom" label="Nom" required />
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
      <TextInput source="dosageRecommande" label="Dosage recommandé" />
      <TextInput source="fabricant" label="Fabricant" />
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

export const MedicamentCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nom" label="Nom" required />
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
      <TextInput source="dosageRecommande" label="Dosage recommandé" />
      <TextInput source="fabricant" label="Fabricant" />
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Create>
);

export const MedicamentShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="type" label="Type" />
      <TextField source="dosageRecommande" label="Dosage recommandé" />
      <TextField source="fabricant" label="Fabricant" />
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);
