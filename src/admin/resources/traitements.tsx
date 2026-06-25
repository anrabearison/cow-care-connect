import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
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
  useRecordContext,
  FunctionField,
  NumberInput,
  required,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

// Filtres pour la liste des traitements
const traitementFilters = [
  <TextInput source="q" label="Rechercher" alwaysOn />,
  <SelectInput source="type" label="Type" choices={[
    { id: 'ANTIBIOTIQUE', name: 'Antibiotique' },
    { id: 'VACCIN', name: 'Vaccin' },
    { id: 'VERMIFUGE', name: 'Vermifuge' },
    { id: 'ANTI_INFLAMMATOIRE', name: 'Anti-inflammatoire' },
    { id: 'VITAMINE', name: 'Vitamine' },
    { id: 'AUTRE', name: 'Autre' },
  ]} />,
  <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
    <AutocompleteInput optionText="name" />
  </ReferenceInput>,
  <ReferenceInput source="product" reference="medicaments" label="Médicament">
    <AutocompleteInput optionText="name" />
  </ReferenceInput>,
  <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
    <AutocompleteInput optionText="name" />
  </ReferenceInput>,
  <DateInput source="date" label="Date" />,
];

const DeleteButtonField = () => {
  const record = useRecordContext();
  return (
    <ConfirmDeleteButton
      record={record}
      resource="treatments"
      title="Supprimer ce traitement"
      message="Êtes-vous sûr de vouloir supprimer ce traitement de l'historique ?"
    />
  );
};

const DosageField = (props: { source?: string, label?: string }) => {
  return (
    <FunctionField
      {...props}
      render={(record: any) => {
        if (record.dosage && typeof record.dosage === 'object') {
          let text = `${record.dosage.quantite}${record.dosage.unite}`;
          if (record.dosage.animalPoids) {
            text += ` (pour ${record.dosage.animalPoids}kg)`;
          }
          return text;
        }
        return record.dosage || '-';
      }}
    />
  );
};

const AdministrationRouteField = (props: any) => {
  return (
    <FunctionField
      {...props}
      render={(record: any) => {
        const routeLabels: Record<string, string> = {
          'IM': 'Intramusculaire',
          'SC': 'Sous-cutanée',
          'IV': 'Intraveineuse',
          'ORAL': 'Orale',
          'TOPICAL': 'Locale / Externe',
          'INTRAMAMMARY': 'Intramammaire',
          'INHALATION': 'Inhalation',
          'OTHER': 'Autre',
        };
        return routeLabels[record.administrationRoute] || record.administrationRoute;
      }}
    />
  );
};

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
      to={`/admin/treatments/${record.id}`}
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
      to={`/admin/treatments/${record.id}/show`}
      label="ra.action.show"
      onClick={(e) => e.stopPropagation()}
    >
      <VisibilityIcon />
    </Button>
  );
};

// Liste des traitements
export const TraitementList = () => (
  <List filters={traitementFilters}>
    <Datagrid rowClick={(id, resource, record) => `/admin/treatments/${id}`}>
      <TextField source="id" label="ID" />
      <ReferenceField source="cattleId" reference="cattle" label="Bovin">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="type" label="Type" />
      <DateField source="date" label="Date" />
      <FunctionField
        label="Médicament"
        render={(record: any) => {
          if (typeof record.product === 'object' && record.product?.name) {
            return record.product.name;
          }
          return record.product || '-';
        }}
      />
      <DosageField label="Dose" />
      <FunctionField
        label="Intervenant"
        render={(record: any) => {
          if (typeof record.veterinarian === 'object' && record.veterinarian?.name) {
            return record.veterinarian.name;
          }
          return record.veterinarian || '-';
        }}
      />
      <CustomShowButton />
      <CustomEditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

const DosageInput = () => (
  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
    <Typography variant="subtitle2" gutterBottom>Dosage Appliqué</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <NumberInput
        source="dosage.quantite"
        label="Quantité"
        helperText="Ex: 10"
        validate={required()}
      />
      <SelectInput
        source="dosage.unite"
        label="Unité"
        choices={[
          { id: 'ML', name: 'ml (millilitres)' },
          { id: 'MG', name: 'mg (milligrammes)' },
          { id: 'G', name: 'g (grammes)' },
          { id: 'UI', name: 'UI (unités internationales)' },
        ]}
        validate={required()}
      />
      <NumberInput
        source="dosage.animalPoids"
        label="Poids de l'animal"
        helperText="Ex: 300 (kg)"
      />
    </Box>
    <SelectInput
      source="administrationRoute"
      label="Voie d'administration"
      choices={[
        { id: 'IM', name: 'Intramusculaire' },
        { id: 'SC', name: 'Sous-cutanée' },
        { id: 'IV', name: 'Intraveineuse' },
        { id: 'ORAL', name: 'Orale' },
        { id: 'TOPICAL', name: 'Locale / Externe' },
        { id: 'INTRAMAMMARY', name: 'Intramammaire' },
        { id: 'INHALATION', name: 'Inhalation' },
        { id: 'OTHER', name: 'Autre' },
      ]}
      validate={required()}
    />
    <TextInput
      source="dosage.notes"
      label="Notes sur le dosage"
      multiline
      fullWidth
    />
  </Box>
);

// Édition d'un traitement
export const TraitementEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <SelectInput
        source="type"
        label="Type"
        choices={[
          { id: 'ANTIBIOTIQUE', name: 'Antibiotique' },
          { id: 'VACCIN', name: 'Vaccin' },
          { id: 'VERMIFUGE', name: 'Vermifuge' },
          { id: 'ANTI_INFLAMMATOIRE', name: 'Anti-inflammatoire' },
          { id: 'VITAMINE', name: 'Vitamine' },
          { id: 'AUTRE', name: 'Autre' },
        ]}
        validate={required()}
      />
      <DateInput source="date" label="Date" validate={required()} />
      <ReferenceInput source="product" reference="medicaments" label="Médicament">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <DosageInput />
      <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

// Création d'un traitement
export const TraitementCreate = () => (
  <Create>
    <SimpleForm toolbar={<CreateToolbar />}>
      <ReferenceInput source="cattleId" reference="cattle" label="Bovin">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <SelectInput
        source="type"
        label="Type"
        choices={[
          { id: 'ANTIBIOTIQUE', name: 'Antibiotique' },
          { id: 'VACCIN', name: 'Vaccin' },
          { id: 'VERMIFUGE', name: 'Vermifuge' },
          { id: 'ANTI_INFLAMMATOIRE', name: 'Anti-inflammatoire' },
          { id: 'VITAMINE', name: 'Vitamine' },
          { id: 'AUTRE', name: 'Autre' },
        ]}
        validate={required()}
      />
      <DateInput source="date" label="Date" validate={required()} />
      <ReferenceInput source="product" reference="medicaments" label="Médicament">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <DosageInput />
      <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
        <AutocompleteInput optionText="name" validate={required()} />
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
        <TextField source="name" />
      </ReferenceField>
      <DosageField label="Dose" />
      <AdministrationRouteField label="Voie" />
      <DateField source="withdrawalEndDate" label="Fin attente" />
      <TextField source="dosage.notes" label="Notes dosage" />
      <ReferenceField source="veterinarian" reference="veterinarians" label="Intervenant">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);
