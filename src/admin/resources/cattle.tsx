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
  required,
} from 'react-admin';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

// Delete button component with confirmation
const DeleteButtonField = () => {
  const record = useRecordContext();
  return (
    <ConfirmDeleteButton
      record={record}
      resource="cattle"
      title="Supprimer ce bovin"
      message="Êtes-vous sûr de vouloir supprimer ce bovin ? Cette action supprimera également tous les événements et traitements associés."
    />
  );
};

// Filtres pour la liste des bovins
const cattleFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <SelectInput source="gender" label="Genre" choices={[
    { id: 'M', name: 'Mâle' },
    { id: 'F', name: 'Femelle' },
  ]} />,
  <SelectInput source="category" label="Catégorie" choices={[
    { id: 'Taureau', name: 'Taureau' },
    { id: 'Veau', name: 'Veau' },
    { id: 'Zébu', name: 'Zébu' },
    { id: 'Vache', name: 'Vache' },
  ]} />,
  <SelectInput source="character" label="Caractère" choices={[
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
      <TextField source="name" label="Nom" />
      <TextField source="nickname" label="Surnom" />
      <TextField source="category" label="Catégorie" />
      <TextField source="gender" label="Genre" />
      <NumberField source="herdBookNumber" label="N° Carnet" />
      <TextField source="brand" label="Marque" />
      <TextField source="distinctiveSign" label="Signe Particulier" />
      <TextField source="character" label="Caractère" />
      <DateField source="birthDate" label="Date de naissance" />
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
        render={(record: any) => record.events?.length || 0}
      />
      <FunctionField
        label="Traitements"
        render={(record: any) => record.treatments?.length || 0}
      />
      <ShowButton />
      <EditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

// Édition d'un bovin
export const CattleEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source="name" label="Nom" required />
      <TextInput source="nickname" label="Surnom" />
      <NumberInput source="herdBookNumber" label="N° Carnet" />
      <TextInput source="brand" label="Marque" />
      <TextInput source="distinctiveSign" label="Signe Particulier" />
      <SelectInput
        source="gender"
        label="Genre"
        choices={[
          { id: 'M', name: 'Mâle' },
          { id: 'F', name: 'Femelle' },
        ]}
        required
      />
      <SelectInput
        source="category"
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
        source="character"
        label="Caractère"
        choices={[
          { id: 'Docile', name: 'Docile' },
          { id: 'Agressif', name: 'Agressif' },
          { id: 'Timide', name: 'Timide' },
          { id: 'Energique', name: 'Énergique' },
        ]}
        required
      />
      <DateInput source="birthDate" label="Date de naissance" required />
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
      <TextInput source="source.supplier" label="Fournisseur" />
      <DateInput source="source.purchaseDate" label="Date d'achat" />
      <SelectInput
        source="source.purchaseCategory"
        label="Catégorie à l'achat"
        choices={[
          { id: 'Taureau', name: 'Taureau' },
          { id: 'Veau', name: 'Veau' },
          { id: 'Zébu', name: 'Zébu' },
          { id: 'Vache', name: 'Vache' },
        ]}
      />
      <NumberInput source="source.purchasePrice" label="Prix d'achat (Ar)" />
      <NumberInput source="source.purchaseWeight" label="Poids à l'achat (kg)" />
      <TextInput source="source.purchaseHealthStatus" label="État de santé à l'achat" />
      <TextInput source="source.purchaseNotes" label="Remarques achat" multiline rows={3} />

      <ArrayInput source="events" label="Événements">
        <SimpleFormIterator inline>
          <ReferenceInput source="type" reference="typeEvenements" label="Type">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
          <DateInput source="date" label="Date" />
          <TextInput source="description" label="Description" />
          <TextInput source="details" label="Détails" multiline />
        </SimpleFormIterator>
      </ArrayInput>

      <ArrayInput source="treatments" label="Traitements">
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
          <ReferenceInput source="product" reference="medicaments" label="Médicament">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
          <TextInput source="dosage" label="Dose" />
          <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
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
    <SimpleForm toolbar={<CreateToolbar />}>
      <TextInput source="name" label="Nom" required />
      <TextInput source="nickname" label="Surnom" />
      <NumberInput source="herdBookNumber" label="N° Carnet" />
      <TextInput source="brand" label="Marque" />
      <TextInput source="distinctiveSign" label="Signe Particulier" />
      <SelectInput
        source="gender"
        label="Genre"
        choices={[
          { id: 'M', name: 'Mâle' },
          { id: 'F', name: 'Femelle' },
        ]}
        required
      />
      <SelectInput
        source="category"
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
        source="character"
        label="Caractère"
        choices={[
          { id: 'Docile', name: 'Docile' },
          { id: 'Agressif', name: 'Agressif' },
          { id: 'Timide', name: 'Timide' },
          { id: 'Energique', name: 'Énergique' },
        ]}
        required
      />
      <DateInput source="birthDate" label="Date de naissance" required />
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
      <TextInput source="source.supplier" label="Fournisseur" />
      <DateInput source="source.purchaseDate" label="Date d'achat" />
      <SelectInput
        source="source.purchaseCategory"
        label="Catégorie à l'achat"
        choices={[
          { id: 'Taureau', name: 'Taureau' },
          { id: 'Veau', name: 'Veau' },
          { id: 'Zébu', name: 'Zébu' },
          { id: 'Vache', name: 'Vache' },
        ]}
      />
      <NumberInput source="source.purchasePrice" label="Prix d'achat (Ar)" />
      <NumberInput source="source.purchaseWeight" label="Poids à l'achat (kg)" />
      <TextInput source="source.purchaseHealthStatus" label="État de santé à l'achat" />
      <TextInput source="source.purchaseNotes" label="Remarques achat" multiline rows={3} />

      <ArrayInput source="events" label="Événements">
        <SimpleFormIterator inline>
          <ReferenceInput source="type" reference="typeEvenements" label="Type">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
          <DateInput source="date" label="Date" />
          <TextInput source="description" label="Description" />
          <TextInput source="details" label="Détails" multiline />
        </SimpleFormIterator>
      </ArrayInput>

      <ArrayInput source="treatments" label="Traitements">
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
          <ReferenceInput source="product" reference="medicaments" label="Médicament">
            <AutocompleteInput optionText="nom" />
          </ReferenceInput>
          <TextInput source="dosage" label="Dose" />
          <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
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
    <TabbedShowLayout syncWithLocation={false}>
      <Tab label={<>Informations<br />Générales</>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ImageField source="photo" label={false} className="[&_img]:max-w-full [&_img]:max-h-80 [&_img]:rounded-lg [&_img]:shadow-md [&_img]:object-cover" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Identité</h3>
            <InlineField label="Identifiant"><TextField source="id" /></InlineField>
            <InlineField label="Nom"><TextField source="name" /></InlineField>
            <InlineField label="Surnom"><TextField source="nickname" /></InlineField>
            <InlineField label="N° Carnet"><NumberField source="herdBookNumber" /></InlineField>
            <InlineField label="Catégorie"><TextField source="category" /></InlineField>
            <InlineField label="Genre"><TextField source="gender" /></InlineField>
            <InlineField label="Marque"><TextField source="brand" /></InlineField>
            <InlineField label="Signe Particulier"><TextField source="distinctiveSign" /></InlineField>
            <InlineField label="Caractère"><TextField source="character" /></InlineField>
            <InlineField label="Date de naissance"><DateField source="birthDate" /></InlineField>
          </div>
        </div>
      </Tab>

      <Tab label={<>Origine &<br />Achat</>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Source</h3>
            <InlineField label="Type de source"><TextField source="source.type" /></InlineField>
            <InlineField label="Fournisseur"><TextField source="source.supplier" /></InlineField>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Détails de l'achat</h3>
            <InlineField label="Date d'achat"><DateField source="source.purchaseDate" /></InlineField>
            <InlineField label="Catégorie à l'achat"><TextField source="source.purchaseCategory" /></InlineField>
            <InlineField label="Prix d'achat"><NumberField source="source.purchasePrice" options={{ style: 'currency', currency: 'MGA' }} /></InlineField>
            <InlineField label="Poids à l'achat"><NumberField source="source.purchaseWeight" /> kg</InlineField>
          </div>
          <div className="col-span-full space-y-2">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">État initial</h3>
            <InlineField label="État de santé"><TextField source="source.purchaseHealthStatus" /></InlineField>
            <InlineField label="Remarques"><TextField source="source.purchaseNotes" /></InlineField>
          </div>
        </div>
      </Tab>

      <Tab label={<>Santé &<br />Suivi</>}>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Historique des Événements</h3>
            <ArrayField source="events" label={false}>
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
            <ArrayField source="treatments" label={false}>
              <Datagrid bulkActionButtons={false} hover={false}>
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
              </Datagrid>
            </ArrayField>
          </div>
        </div>
      </Tab>
    </TabbedShowLayout>
  </Show>
);