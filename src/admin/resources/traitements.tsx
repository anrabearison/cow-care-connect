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
      <DosageField label="Dose" />
      <ReferenceField source="veterinarian" reference="veterinarians" label="Intervenant">
        <TextField source="nom" />
      </ReferenceField>
      <ShowButton />
      <EditButton />
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
          { id: 'Antibiotique', name: 'Antibiotique' },
          { id: 'Vaccin', name: 'Vaccin' },
          { id: 'Vermifuge', name: 'Vermifuge' },
          { id: 'Anti-inflammatoire', name: 'Anti-inflammatoire' },
          { id: 'Vitamine', name: 'Vitamine' },
          { id: 'Autre', name: 'Autre' },
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
          { id: 'Antibiotique', name: 'Antibiotique' },
          { id: 'Vaccin', name: 'Vaccin' },
          { id: 'Vermifuge', name: 'Vermifuge' },
          { id: 'Anti-inflammatoire', name: 'Anti-inflammatoire' },
          { id: 'Vitamine', name: 'Vitamine' },
          { id: 'Autre', name: 'Autre' },
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
      <TextField source="dosage.notes" label="Notes dosage" />
      <ReferenceField source="veterinarian" reference="veterinarians" label="Intervenant">
        <TextField source="nom" />
      </ReferenceField>
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);
