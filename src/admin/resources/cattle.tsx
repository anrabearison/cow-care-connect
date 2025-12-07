import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  Create,
  Show,
  ImageField,
  FunctionField,
  ArrayInput,
  SimpleFormIterator,
  ArrayField,
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
  TabbedShowLayout,
  Tab,
  useRecordContext,
  required,
  RaRecord,
  ShowButton,
  CreateButton,
  ExportButton,
  FilterButton,
  TopToolbar,
} from 'react-admin';
import { CloudinaryImageInput } from '../components/CloudinaryImageInput';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';
import { Cattle } from '../../features/cattle/types';
import { OwnerReferenceInput } from '../components/OwnerReferenceInput';

// Custom ListActions without RefreshButton
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

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
  <TextInput
    source="q"
    label="Rechercher"
    placeholder="Nom, surnom, marque, signe..."
    alwaysOn
  />,
  <SelectInput
    source="gender"
    label="Genre"
    choices={[
      { id: 'M', name: '♂ Mâle' },
      { id: 'F', name: '♀ Femelle' },
    ]}
  />,
  <ReferenceInput
    source="category"
    reference="categories"
    label="Catégorie"
  >
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <ReferenceInput
    source="character"
    reference="characters"
    label="Caractère"
  >
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <ReferenceInput
    source="status"
    reference="status"
    label="Statut"
  >
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <SelectInput
    source="source_type"
    label="Type de source"
    choices={[
      { id: 'Acheté', name: '🛒 Acheté' },
      { id: 'Né dans le troupeau', name: '🐄 Né dans le troupeau' },
    ]}
  />,
];

// Custom Buttons
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from 'react-admin';

const CustomEditButton = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Button
      component={Link}
      to={`/admin/cattle/${record.id}`}
      label="ra.action.edit"
      onClick={(e) => e.stopPropagation()}
    >
      <EditIcon />
    </Button>
  );
};

const CustomShowButton = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Button
      component={Link}
      to={`/admin/cattle/${record.id}/show`}
      label="ra.action.show"
      onClick={(e) => e.stopPropagation()}
    >
      <VisibilityIcon />
    </Button>
  );
};

// Liste des bovins
export const CattleList = () => (
  <List filters={cattleFilters} actions={<ListActions />}>
    <Datagrid rowClick={(id, resource, record) => `/admin/cattle/${id}/show`}>
      <FunctionField
        label="Photo"
        render={(record: Cattle) =>
          record.photo ? (
            <img
              src={record.photo}
              alt={record.name}
              style={{
                width: 60,
                height: 60,
                objectFit: 'cover',
                borderRadius: 8,
                border: '2px solid #e0e0e0'
              }}
            />
          ) : (
            <div style={{
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: 8,
              color: '#999',
              fontSize: '24px'
            }}>
              🐄
            </div>
          )
        }
      />
      <FunctionField
        label="Identité"
        render={(record: Cattle) => (
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.95em' }}>{record.name}</div>
            {record.nickname && (
              <div style={{ fontSize: '0.85em', color: '#666', fontStyle: 'italic' }}>
                "{record.nickname}"
              </div>
            )}
          </div>
        )}
      />
      <FunctionField
        label="Genre"
        render={(record: Cattle) => (
          <span style={{ fontSize: '1.3em' }}>
            {record.gender === 'M' ? '♂️' : '♀️'}
          </span>
        )}
      />
      <TextField source="category.name" label="Catégorie" />
      <NumberField source="herdBookNumber" label="N° Carnet" />
      <FunctionField
        label="Statut"
        render={(record: Cattle) => {
          const statusColors: Record<string, string> = {
            'STAT001': '#4caf50', // Actif - vert
            'STAT002': '#ff9800', // Malade - orange
            'STAT003': '#f44336', // Mort - rouge
            'STAT004': '#2196f3', // Vendu - bleu
          };
          const color = statusColors[record.status?.id || ''] || '#9e9e9e';

          return (
            <span style={{
              padding: '4px 12px',
              borderRadius: 12,
              backgroundColor: `${color}20`,
              color: color,
              fontWeight: 500,
              fontSize: '0.85em',
              display: 'inline-block'
            }}>
              {record.status?.name || 'Inconnu'}
            </span>
          );
        }}
      />
      <CustomShowButton />
      <CustomEditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

// Édition d'un bovin
export const CattleEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <OwnerReferenceInput />
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
      <ReferenceInput source="category.id" reference="categories" label="Catégorie">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="character.id" reference="characters" label="Caractère">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="status.id" reference="status" label="Statut">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <DateInput source="birthDate" label="Date de naissance" required />
      <CloudinaryImageInput source="photo" label="Photo" />
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
      <OwnerReferenceInput />
      <TextInput source="name" label="Nom" required />
      <TextInput source="nickname" label="Surnom" />
      <ReferenceInput
        source="herd_book_id"
        reference="herd-books"
        label="Livre de troupeau *"
        sort={{ field: 'year', order: 'DESC' }}
      >
        <SelectInput
          optionText={(record) => `${record.year} - ${record.reference}`}
          validate={required()}
        />
      </ReferenceInput>
      <TextInput
        source="n_carnet"
        label="N° Carnet"
        helperText="Numéro de carnet pour ce livre de troupeau (optionnel)"
      />
      <NumberInput source="herdBookNumber" label="N° Carnet (ancien)" />
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
      <ReferenceInput source="category.id" reference="categories" label="Catégorie">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="character.id" reference="characters" label="Caractère">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="status.id" reference="status" label="Statut">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <DateInput source="birthDate" label="Date de naissance" required />
      <CloudinaryImageInput source="photo" label="Photo" />
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
interface InlineFieldProps {
  label: string;
  children: React.ReactNode;
}

const InlineField: React.FC<InlineFieldProps> = ({ label, children }) => {
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

const GeneralInfoTab = () => (
  <Grid container spacing={3}>
    {/* En-tête avec Photo et Infos Principales */}
    <Grid item xs={12} md={4}>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{
            width: '100%',
            height: 300,
            overflow: 'hidden',
            borderRadius: 2,
            mb: 2,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ImageField
              source="photo"
              label={false}
              sx={{
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }
              }}
            />
          </Box>
          <Typography variant="h5" gutterBottom>
            <TextField source="name" />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            <TextField source="nickname" />
          </Typography>
          <Box mt={1}>
            <FunctionField
              render={(record: Cattle) => (
                <Chip
                  label={record.status?.name || 'Inconnu'}
                  color={record.status?.id === 'STAT004' ? 'success' : 'warning'}
                  variant="outlined"
                />
              )}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>

    {/* Détails */}
    <Grid item xs={12} md={8}>
      <Grid container spacing={3}>
        {/* Carte Identité */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📋 Identité
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InlineField label="Identifiant"><TextField source="id" /></InlineField>
                  <InlineField label="N° Carnet"><NumberField source="herdBookNumber" /></InlineField>
                  <InlineField label="Date de naissance"><DateField source="birthDate" /></InlineField>
                  <InlineField label="Genre">
                    <FunctionField render={(record: Cattle) =>
                      record.gender === 'M' ? '♂ Mâle' : '♀ Femelle'
                    } />
                  </InlineField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InlineField label="Catégorie"><TextField source="category.name" /></InlineField>
                  <InlineField label="Caractère"><TextField source="character.name" /></InlineField>
                  <InlineField label="Marque"><TextField source="brand" /></InlineField>
                  <InlineField label="Signe Particulier"><TextField source="distinctiveSign" /></InlineField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Grid>
  </Grid>
);

const OriginTab = () => (
  <Card>
    <CardContent>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Source</Typography>
          <Divider sx={{ mb: 2 }} />
          <InlineField label="Type de source"><TextField source="source.type" /></InlineField>
          <InlineField label="Fournisseur"><TextField source="source.supplier" /></InlineField>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Détails de l'achat</Typography>
          <Divider sx={{ mb: 2 }} />
          <InlineField label="Date d'achat"><DateField source="source.purchaseDate" /></InlineField>
          <InlineField label="Catégorie à l'achat"><TextField source="source.purchaseCategory" /></InlineField>
          <InlineField label="Prix d'achat"><NumberField source="source.purchasePrice" options={{ style: 'currency', currency: 'MGA' }} /></InlineField>
          <InlineField label="Poids à l'achat"><NumberField source="source.purchaseWeight" /> kg</InlineField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>État initial</Typography>
          <Divider sx={{ mb: 2 }} />
          <InlineField label="État de santé"><TextField source="source.purchaseHealthStatus" /></InlineField>
          <InlineField label="Remarques"><TextField source="source.purchaseNotes" /></InlineField>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const HealthTab = () => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Historique des Événements</Typography>
          <ArrayField source="events" label={false}>
            <Datagrid bulkActionButtons={false} hover={false} sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
              <ReferenceField source="type" reference="typeEvenements" label="Type">
                <TextField source="nom" />
              </ReferenceField>
              <DateField source="date" label="Date" />
              <TextField source="description" label="Description" />
              <TextField source="details" label="Détails" />
            </Datagrid>
          </ArrayField>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Traitements Vétérinaires</Typography>
          <ArrayField source="treatments" label={false}>
            <Datagrid bulkActionButtons={false} hover={false} sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
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
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Affichage détaillé d'un bovin
export const CattleShow = () => (
  <Show>
    <TabbedShowLayout syncWithLocation={false}>
      <Tab label="Informations Générales">
        <GeneralInfoTab />
      </Tab>

      <Tab label="Origine & Achat">
        <OriginTab />
      </Tab>

      <Tab label="Santé & Suivi">
        <HealthTab />
      </Tab>

      <Tab label="Livres de troupeau">
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Inscriptions dans les livres de troupeau
            </Typography>
            <ArrayField source="herd_book_entries" label={false}>
              <Datagrid bulkActionButtons={false} hover={false}>
                <ReferenceField source="herd_book_id" reference="herd-books" label="Livre" link="show">
                  <FunctionField render={(record: any) => `${record.year} - ${record.reference}`} />
                </ReferenceField>
                <TextField source="n_carnet" label="N° Carnet" />
                <ReferenceField source="category_id" reference="categories" label="Catégorie">
                  <TextField source="name" />
                </ReferenceField>
                <FunctionField
                  label="Statut"
                  render={(record: any) => {
                    const statusColors: Record<string, string> = {
                      'STAT001': '#4caf50',
                      'STAT002': '#ff9800',
                      'STAT003': '#f44336',
                      'STAT004': '#2196f3',
                    };
                    const color = statusColors[record.status_id || ''] || '#9e9e9e';

                    return (
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 12,
                        backgroundColor: `${color}20`,
                        color: color,
                        fontWeight: 500,
                        fontSize: '0.85em',
                        display: 'inline-block'
                      }}>
                        {record.status?.name || 'Inconnu'}
                      </span>
                    );
                  }}
                />
                <DateField source="created_at" label="Date d'inscription" />
                <ShowButton resource="herd-book-cattle" />
              </Datagrid>
            </ArrayField>
          </CardContent>
        </Card>
      </Tab>
    </TabbedShowLayout>
  </Show>
);