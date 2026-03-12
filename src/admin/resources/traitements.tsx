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
    <AutocompleteInput optionText="nom" />
  </ReferenceInput>,
  <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
    <AutocompleteInput optionText="nom" />
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
          if (record.dosage.animal_poids) {
            text += ` (pour ${record.dosage.animal_poids}kg)`;
          }
          return text;
        }
        return record.dosage || '-';
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
      <ReferenceField source="product" reference="medicaments" label="Médicament">
        <TextField source="nom" />
      </ReferenceField>
      <DosageField label="Dose" />
      <ReferenceField source="veterinarian" reference="veterinarians" label="Intervenant">
        <TextField source="nom" />
      </ReferenceField>
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
          { id: 'ml', name: 'ml (millilitres)' },
          { id: 'mg', name: 'mg (milligrammes)' },
          { id: 'g', name: 'g (grammes)' },
          { id: 'UI', name: 'UI (unités internationales)' },
        ]}
        validate={required()}
      />
      <NumberInput
        source="dosage.animal_poids"
        label="Poids de l'animal"
        helperText="Ex: 300 (kg)"
      />
    </Box>
    <SelectInput
      source="administration_route"
      label="Voie d'administration"
      choices={[
        { id: 'Intramusculaire', name: 'Intramusculaire' },
        { id: 'Sous-cutanée', name: 'Sous-cutanée' },
        { id: 'Intraveineuse', name: 'Intraveineuse' },
        { id: 'Orale', name: 'Orale' },
        { id: 'Locale / Externe', name: 'Locale / Externe' },
        { id: 'Intramammaire', name: 'Intramammaire' },
        { id: 'Inhalation', name: 'Inhalation' },
        { id: 'Autre', name: 'Autre' },
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
        <AutocompleteInput optionText="nom" validate={required()} />
      </ReferenceInput>
      <DosageInput />
      <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
        <AutocompleteInput optionText="nom" validate={required()} />
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
        <AutocompleteInput optionText="nom" validate={required()} />
      </ReferenceInput>
      <DosageInput />
      <ReferenceInput source="veterinarian" reference="veterinarians" label="Intervenant">
        <AutocompleteInput optionText="nom" validate={required()} />
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
      <DosageField label="Dose" />
      <TextField source="administration_route" label="Voie" />
      <DateField source="withdrawal_end_date" label="Fin attente" />
      <TextField source="dosage.notes" label="Notes dosage" />
      <ReferenceField source="veterinarian" reference="veterinarians" label="Intervenant">
        <TextField source="nom" />
      </ReferenceField>
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);
