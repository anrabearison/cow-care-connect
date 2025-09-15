import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  DeleteButton,
  ShowButton,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  Create,
  Show,
  SimpleShowLayout,
  ImageField,
  ImageInput,
  FunctionField,
} from 'react-admin';

// Liste des bovins
export const CattleList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="categorie" label="Catégorie" />
      <TextField source="genre" label="Genre" />
      <NumberField source="age" label="Âge" />
      <NumberField source="weight" label="Poids (kg)" />
      <TextField source="healthStatus" label="État de santé" />
      <DateField source="birthDate" label="Date de naissance" />
      <FunctionField
        label="Photo"
        render={(record: any) => record.image ? 'Oui' : 'Non'}
      />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// Édition d'un bovin
export const CattleEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="nom" label="Nom" required />
      <TextInput source="breed" label="Race" required />
      <SelectInput
        source="genre"
        label="Genre"
        choices={[
          { id: 'M', name: 'Mâle' },
          { id: 'F', name: 'Femelle' },
        ]}
        required
      />
      <SelectInput
        source="categorie"
        label="Catégorie"
        choices={[
          { id: 'Taureau', name: 'Taureau' },
          { id: 'Veau', name: 'Veau' },
          { id: 'Zébu', name: 'Zébu' },
          { id: 'Vache', name: 'Vache' },
        ]}
        required
      />
      <NumberInput source="age" label="Âge" required />
      <NumberInput source="weight" label="Poids (kg)" required />
      <SelectInput
        source="healthStatus"
        label="État de santé"
        choices={[
          { id: 'Excellent', name: 'Excellent' },
          { id: 'Bon', name: 'Bon' },
          { id: 'Moyen', name: 'Moyen' },
          { id: 'Mauvais', name: 'Mauvais' },
        ]}
        required
      />
      <DateInput source="birthDate" label="Date de naissance" required />
      <ImageInput source="image" label="Photo" accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="location" label="Localisation" />
      <TextInput source="notes" label="Notes" multiline rows={4} />
    </SimpleForm>
  </Edit>
);

// Création d'un bovin
export const CattleCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nom" label="Nom" required />
      <TextInput source="breed" label="Race" required />
      <SelectInput
        source="genre"
        label="Genre"
        choices={[
          { id: 'M', name: 'Mâle' },
          { id: 'F', name: 'Femelle' },
        ]}
        required
      />
      <SelectInput
        source="categorie"
        label="Catégorie"
        choices={[
          { id: 'Taureau', name: 'Taureau' },
          { id: 'Veau', name: 'Veau' },
          { id: 'Zébu', name: 'Zébu' },
          { id: 'Vache', name: 'Vache' },
        ]}
        required
      />
      <NumberInput source="age" label="Âge" required />
      <NumberInput source="weight" label="Poids (kg)" required />
      <SelectInput
        source="healthStatus"
        label="État de santé"
        choices={[
          { id: 'Excellent', name: 'Excellent' },
          { id: 'Bon', name: 'Bon' },
          { id: 'Moyen', name: 'Moyen' },
          { id: 'Mauvais', name: 'Mauvais' },
        ]}
        required
      />
      <DateInput source="birthDate" label="Date de naissance" required />
      <ImageInput source="image" label="Photo" accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="location" label="Localisation" />
      <TextInput source="notes" label="Notes" multiline rows={4} />
    </SimpleForm>
  </Create>
);

// Affichage détaillé d'un bovin
export const CattleShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="categorie" label="Catégorie" />
      <TextField source="genre" label="Genre" />
      <NumberField source="age" label="Âge" />
      <NumberField source="weight" label="Poids (kg)" />
      <TextField source="healthStatus" label="État de santé" />
      <DateField source="birthDate" label="Date de naissance" />
      <ImageField source="image" label="Photo" />
      <TextField source="location" label="Localisation" />
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);