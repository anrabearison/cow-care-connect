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
  ArrayInput,
  SimpleFormIterator,
  ArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin';

// Liste des bovins
export const CattleList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="categorie" label="Catégorie" />
      <TextField source="genre" label="Genre" />
      <TextField source="caractere" label="Caractère" />
      <DateField source="dateNaissance" label="Date de naissance" />
      <FunctionField
        label="Source"
        render={(record: any) => record.source?.type || 'Non défini'}
      />
      <FunctionField
        label="Photo"
        render={(record: any) => record.photo ? 'Oui' : 'Non'}
      />
      <FunctionField
        label="Événements"
        render={(record: any) => record.evenements?.length || 0}
      />
      <FunctionField
        label="Traitements"
        render={(record: any) => record.traitements?.length || 0}
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
      <SelectInput
        source="caractere"
        label="Caractère"
        choices={[
          { id: 'Docile', name: 'Docile' },
          { id: 'Agressif', name: 'Agressif' },
          { id: 'Timide', name: 'Timide' },
          { id: 'Energique', name: 'Énergique' },
        ]}
        required
      />
      <DateInput source="dateNaissance" label="Date de naissance" required />
      <ImageInput source="photo" label="Photo" accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
      <SelectInput
        source="source.type"
        label="Type de source"
        choices={[
          { id: 'Acheté', name: 'Acheté' },
          { id: 'Né dans le troupeau', name: 'Né dans le troupeau' },
        ]}
        required
      />
      <TextInput source="source.fournisseur" label="Fournisseur" />
      <DateInput source="source.dateAchat" label="Date d'achat" />
      <SelectInput
        source="source.categorieAchat"
        label="Catégorie à l'achat"
        choices={[
          { id: 'Taureau', name: 'Taureau' },
          { id: 'Veau', name: 'Veau' },
          { id: 'Zébu', name: 'Zébu' },
          { id: 'Vache', name: 'Vache' },
        ]}
      />
      <NumberInput source="source.prixAchat" label="Prix d'achat (Ar)" />
      <NumberInput source="source.poidsAchat" label="Poids à l'achat (kg)" />
      <TextInput source="source.etatSanteAchat" label="État de santé à l'achat" />
      <TextInput source="source.remarquesAchat" label="Remarques achat" multiline rows={3} />
      
      <ArrayInput source="evenements" label="Événements">
        <SimpleFormIterator inline>
          <SelectInput
            source="type"
            label="Type"
            choices={[
              { id: 'Naissance', name: 'Naissance' },
              { id: 'Changement de pâturage', name: 'Changement de pâturage' },
              { id: 'Vaccination', name: 'Vaccination' },
              { id: 'Visite vétérinaire', name: 'Visite vétérinaire' },
              { id: 'Pesée', name: 'Pesée' },
              { id: 'Autre', name: 'Autre' },
            ]}
          />
          <DateInput source="date" label="Date" />
          <TextInput source="description" label="Description" />
          <TextInput source="details" label="Détails" multiline />
        </SimpleFormIterator>
      </ArrayInput>

      <ArrayInput source="traitements" label="Traitements">
        <SimpleFormIterator inline>
          <SelectInput
            source="type"
            label="Type"
            choices={[
              { id: 'Antibiotique', name: 'Antibiotique' },
              { id: 'Vaccin', name: 'Vaccin' },
              { id: 'Vermifuge', name: 'Vermifuge' },
              { id: 'Anti-inflammatoire', name: 'Anti-inflammatoire' },
              { id: 'Autre', name: 'Autre' },
            ]}
          />
          <DateInput source="date" label="Date" />
          <TextInput source="produit" label="Produit" />
          <TextInput source="dose" label="Dose" />
          <TextInput source="veterinaire" label="Vétérinaire" />
          <TextInput source="notes" label="Notes" multiline />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// Création d'un bovin
export const CattleCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nom" label="Nom" required />
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
      <SelectInput
        source="caractere"
        label="Caractère"
        choices={[
          { id: 'Docile', name: 'Docile' },
          { id: 'Agressif', name: 'Agressif' },
          { id: 'Timide', name: 'Timide' },
          { id: 'Energique', name: 'Énergique' },
        ]}
        required
      />
      <DateInput source="dateNaissance" label="Date de naissance" required />
      <ImageInput source="photo" label="Photo" accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
      <SelectInput
        source="source.type"
        label="Type de source"
        choices={[
          { id: 'Acheté', name: 'Acheté' },
          { id: 'Né dans le troupeau', name: 'Né dans le troupeau' },
        ]}
        required
      />
      <TextInput source="source.fournisseur" label="Fournisseur" />
      <DateInput source="source.dateAchat" label="Date d'achat" />
      <SelectInput
        source="source.categorieAchat"
        label="Catégorie à l'achat"
        choices={[
          { id: 'Taureau', name: 'Taureau' },
          { id: 'Veau', name: 'Veau' },
          { id: 'Zébu', name: 'Zébu' },
          { id: 'Vache', name: 'Vache' },
        ]}
      />
      <NumberInput source="source.prixAchat" label="Prix d'achat (Ar)" />
      <NumberInput source="source.poidsAchat" label="Poids à l'achat (kg)" />
      <TextInput source="source.etatSanteAchat" label="État de santé à l'achat" />
      <TextInput source="source.remarquesAchat" label="Remarques achat" multiline rows={3} />
      
      <ArrayInput source="evenements" label="Événements">
        <SimpleFormIterator inline>
          <SelectInput
            source="type"
            label="Type"
            choices={[
              { id: 'Naissance', name: 'Naissance' },
              { id: 'Changement de pâturage', name: 'Changement de pâturage' },
              { id: 'Vaccination', name: 'Vaccination' },
              { id: 'Visite vétérinaire', name: 'Visite vétérinaire' },
              { id: 'Pesée', name: 'Pesée' },
              { id: 'Autre', name: 'Autre' },
            ]}
          />
          <DateInput source="date" label="Date" />
          <TextInput source="description" label="Description" />
          <TextInput source="details" label="Détails" multiline />
        </SimpleFormIterator>
      </ArrayInput>

      <ArrayInput source="traitements" label="Traitements">
        <SimpleFormIterator inline>
          <SelectInput
            source="type"
            label="Type"
            choices={[
              { id: 'Antibiotique', name: 'Antibiotique' },
              { id: 'Vaccin', name: 'Vaccin' },
              { id: 'Vermifuge', name: 'Vermifuge' },
              { id: 'Anti-inflammatoire', name: 'Anti-inflammatoire' },
              { id: 'Autre', name: 'Autre' },
            ]}
          />
          <DateInput source="date" label="Date" />
          <TextInput source="produit" label="Produit" />
          <TextInput source="dose" label="Dose" />
          <TextInput source="veterinaire" label="Vétérinaire" />
          <TextInput source="notes" label="Notes" multiline />
        </SimpleFormIterator>
      </ArrayInput>
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
      <TextField source="caractere" label="Caractère" />
      <DateField source="dateNaissance" label="Date de naissance" />
      <ImageField source="photo" label="Photo" />
      <TextField source="source.type" label="Type de source" />
      <TextField source="source.fournisseur" label="Fournisseur" />
      <DateField source="source.dateAchat" label="Date d'achat" />
      <TextField source="source.categorieAchat" label="Catégorie à l'achat" />
      <NumberField source="source.prixAchat" label="Prix d'achat (Ar)" />
      <NumberField source="source.poidsAchat" label="Poids à l'achat (kg)" />
      <TextField source="source.etatSanteAchat" label="État de santé à l'achat" />
      <TextField source="source.remarquesAchat" label="Remarques achat" />
      
      <ArrayField source="evenements" label="Événements">
        <Datagrid bulkActionButtons={false}>
          <TextField source="type" label="Type" />
          <DateField source="date" label="Date" />
          <TextField source="description" label="Description" />
          <TextField source="details" label="Détails" />
        </Datagrid>
      </ArrayField>

      <ArrayField source="traitements" label="Traitements">
        <Datagrid bulkActionButtons={false}>
          <TextField source="type" label="Type" />
          <DateField source="date" label="Date" />
          <TextField source="produit" label="Produit" />
          <TextField source="dose" label="Dose" />
          <TextField source="veterinaire" label="Vétérinaire" />
          <TextField source="notes" label="Notes" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);