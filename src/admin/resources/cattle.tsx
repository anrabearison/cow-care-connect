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
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
  TabbedShowLayout,
  Tab,
  useRecordContext,
} from 'react-admin';

// Filtres pour la liste des bovins
const cattleFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <SelectInput source="genre" label="Genre" choices={[
    { id: 'M', name: 'Mâle' },
    { id: 'F', name: 'Femelle' },
  ]} />,
  <SelectInput source="categorie" label="Catégorie" choices={[
    { id: 'Taureau', name: 'Taureau' },
    { id: 'Veau', name: 'Veau' },
    { id: 'Zébu', name: 'Zébu' },
    { id: 'Vache', name: 'Vache' },
  ]} />,
  <SelectInput source="caractere" label="Caractère" choices={[
    { id: 'Docile', name: 'Docile' },
    { id: 'Agressif', name: 'Agressif' },
    { id: 'Timide', name: 'Timide' },
    { id: 'Energique', name: 'Énergique' },
  ]} />,
];

// Liste des bovins
export const CattleList = () => (
  <List filters={cattleFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="categorie" label="Catégorie" />
      <TextField source="genre" label="Genre" />
      <TextField source="marque" label="Marque" />
      <TextField source="signeParticulier" label="Signe Particulier" />
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
      <TextInput source="marque" label="Marque" />
      <TextInput source="signeParticulier" label="Signe Particulier" />
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
          <ReferenceInput source="type" reference="typeEvenements" label="Type">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
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
              { id: 'Vitamine', name: 'Vitamine' },
              { id: 'Autre', name: 'Autre' },
            ]}
          />
          <DateInput source="date" label="Date" />
          <ReferenceInput source="produit" reference="medicaments" label="Médicament">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
          <TextInput source="dose" label="Dose" />
          <ReferenceInput source="veterinaire" reference="veterinarians" label="Intervenant">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
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
      <TextInput source="marque" label="Marque" />
      <TextInput source="signeParticulier" label="Signe Particulier" />
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
          <ReferenceInput source="type" reference="typeEvenements" label="Type">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
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
              { id: 'Vitamine', name: 'Vitamine' },
              { id: 'Autre', name: 'Autre' },
            ]}
          />
          <DateInput source="date" label="Date" />
          <ReferenceInput source="produit" reference="medicaments" label="Médicament">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
          <TextInput source="dose" label="Dose" />
          <ReferenceInput source="veterinaire" reference="veterinarians" label="Intervenant">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
          <TextInput source="notes" label="Notes" multiline />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);

// Composant helper pour l'affichage inline "Label: Valeur"
const InlineField = ({ label, children }: { label: string, children: React.ReactNode }) => {
  const record = useRecordContext();
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1">
      <span className="text-sm font-medium text-gray-500 min-w-[140px] shrink-0">{label}:</span>
      <div className="text-gray-900 font-medium">
        {React.Children.map(children, child =>
          React.isValidElement(child) ? React.cloneElement(child, { record } as any) : child
        )}
      </div>
    </div>
  );
};

// Affichage détaillé d'un bovin
export const CattleShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Informations Générales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ImageField source="photo" label={false} className="[&_img]:max-w-full [&_img]:max-h-80 [&_img]:rounded-lg [&_img]:shadow-md [&_img]:object-cover" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Identité</h3>
            <InlineField label="Identifiant"><TextField source="id" /></InlineField>
            <InlineField label="Nom"><TextField source="nom" /></InlineField>
            <InlineField label="Catégorie"><TextField source="categorie" /></InlineField>
            <InlineField label="Genre"><TextField source="genre" /></InlineField>
            <InlineField label="Marque"><TextField source="marque" /></InlineField>
            <InlineField label="Signe Particulier"><TextField source="signeParticulier" /></InlineField>
            <InlineField label="Caractère"><TextField source="caractere" /></InlineField>
            <InlineField label="Date de naissance"><DateField source="dateNaissance" /></InlineField>
          </div>
        </div>
      </Tab>

      <Tab label="Origine & Achat">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Source</h3>
            <InlineField label="Type de source"><TextField source="source.type" /></InlineField>
            <InlineField label="Fournisseur"><TextField source="source.fournisseur" /></InlineField>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Détails de l'achat</h3>
            <InlineField label="Date d'achat"><DateField source="source.dateAchat" /></InlineField>
            <InlineField label="Catégorie à l'achat"><TextField source="source.categorieAchat" /></InlineField>
            <InlineField label="Prix d'achat"><NumberField source="source.prixAchat" options={{ style: 'currency', currency: 'MGA' }} /></InlineField>
            <InlineField label="Poids à l'achat"><NumberField source="source.poidsAchat" /> kg</InlineField>
          </div>
          <div className="col-span-full space-y-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">État initial</h3>
            <InlineField label="État de santé"><TextField source="source.etatSanteAchat" /></InlineField>
            <InlineField label="Remarques"><TextField source="source.remarquesAchat" /></InlineField>
          </div>
        </div>
      </Tab>

      <Tab label="Santé & Suivi">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Historique des Événements</h3>
            <ArrayField source="evenements" label={false}>
              <Datagrid bulkActionButtons={false} hover={false}>
                <ReferenceField source="type" reference="typeEvenements" label="Type">
                  <TextField source="nom" />
                </ReferenceField>
                <DateField source="date" label="Date" />
                <TextField source="description" label="Description" />
                <TextField source="details" label="Détails" />
              </Datagrid>
            </ArrayField>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Traitements Vétérinaires</h3>
            <ArrayField source="traitements" label={false}>
              <Datagrid bulkActionButtons={false} hover={false}>
                <TextField source="type" label="Type" />
                <DateField source="date" label="Date" />
                <ReferenceField source="produit" reference="medicaments" label="Médicament">
                  <TextField source="nom" />
                </ReferenceField>
                <TextField source="dose" label="Dose" />
                <ReferenceField source="veterinaire" reference="veterinarians" label="Intervenant">
                  <TextField source="nom" />
                </ReferenceField>
                <TextField source="notes" label="Notes" />
              </Datagrid>
            </ArrayField>
          </div>
        </div>
      </Tab>
    </TabbedShowLayout>
  </Show>
);