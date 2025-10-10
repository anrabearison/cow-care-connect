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
} from 'react-admin';

// Liste des intervenants
export const VeterinarianList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="specialite" label="Spécialité" />
      <TextField source="telephone" label="Téléphone" />
      <EmailField source="email" label="Email" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// Édition d'un intervenant
export const VeterinarianEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="nom" label="Nom" required />
      <TextInput source="specialite" label="Spécialité" />
      <TextInput source="telephone" label="Téléphone" />
      <TextInput source="email" label="Email" type="email" />
      <TextInput source="adresse" label="Adresse" multiline rows={2} />
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

// Création d'un intervenant
export const VeterinarianCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nom" label="Nom" required />
      <TextInput source="specialite" label="Spécialité" />
      <TextInput source="telephone" label="Téléphone" />
      <TextInput source="email" label="Email" type="email" />
      <TextInput source="adresse" label="Adresse" multiline rows={2} />
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Create>
);

// Affichage détaillé d'un intervenant
export const VeterinarianShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="specialite" label="Spécialité" />
      <TextField source="telephone" label="Téléphone" />
      <EmailField source="email" label="Email" />
      <TextField source="adresse" label="Adresse" />
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);
