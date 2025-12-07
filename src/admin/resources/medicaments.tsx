import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Create,
  Show,
  SimpleShowLayout,
  useRecordContext,
  NumberInput,
  FunctionField,
  required,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

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

const DeleteButtonField = () => {
  const record = useRecordContext();
  return (
    <ConfirmDeleteButton
      record={record}
      resource="medicaments"
      title="Supprimer ce médicament"
      message="Êtes-vous sûr de vouloir supprimer ce médicament ?"
    />
  );
};

const DosageField = (props: { source?: string, label?: string }) => {
  return (
    <FunctionField
      {...props}
      render={(record: any) => {
        if (record.dosage && record.dosage.quantite && record.dosage.unite) {
          let text = `${record.dosage.quantite}${record.dosage.unite}`;
          if (record.dosage.poids) {
            text += ` / ${record.dosage.poids}${record.dosage.unite_poids || 'kg'}`;
          }
          return text;
        }
        return record.dosageRecommande || '-';
      }}
    />
  );
};

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
      to={`/admin/medicaments/${record.id}`}
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
      to={`/admin/medicaments/${record.id}/show`}
      label="ra.action.show"
      onClick={(e) => e.stopPropagation()}
    >
      <VisibilityIcon />
    </Button>
  );
};

export const MedicamentList = () => (
  <List filters={medicamentFilters}>
    <Datagrid rowClick={(id, resource, record) => `/admin/medicaments/${id}`}>
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="type" label="Type" />
      <DosageField label="Dosage recommandé" />
      <TextField source="fabricant" label="Fabricant" />
      <CustomShowButton />
      <CustomEditButton />
      <DeleteButtonField />
    </Datagrid>
  </List>
);

const DosageInput = () => (
  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
    <Typography variant="subtitle2" gutterBottom>Dosage Recommandé</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <NumberInput
        source="dosage.quantite"
        label="Quantité"
        helperText="Ex: 1"
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
      />
      <NumberInput
        source="dosage.poids"
        label="Par poids"
        helperText="Ex: 50 (laissez vide pour dose fixe)"
      />
      <SelectInput
        source="dosage.unite_poids"
        label="Unité de poids"
        choices={[
          { id: 'kg', name: 'kg' },
          { id: 'lb', name: 'lb' },
        ]}
        defaultValue="kg"
      />
    </Box>
    <SelectInput
      source="default_route"
      label="Voie d'administration par défaut"
      choices={[
        { id: 'Orale', name: 'Orale' },
        { id: 'Intraveineuse', name: 'Intraveineuse' },
        { id: 'Intramusculaire', name: 'Intramusculaire' },
        { id: 'Sous-cutanée', name: 'Sous-cutanée' },
        { id: 'Topique', name: 'Topique' },
        { id: 'Intra-mammaire', name: 'Intra-mammaire' },
      ]}
    />
    <TextInput
      source="dosage.notes"
      label="Notes sur le dosage"
      multiline
      fullWidth
      helperText="Ex: Administrer en 2 fois à 12h d'intervalle"
    />
  </Box >
);

const WithdrawalInput = () => (
  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
    <Typography variant="subtitle2" gutterBottom>Temps d'attente (Jours)</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <NumberInput source="withdrawal_period_meat" label="Viande" min={0} />
      <NumberInput source="withdrawal_period_milk" label="Lait" min={0} />
    </Box>
  </Box>
);

export const MedicamentEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source="nom" label="Nom" validate={required()} />
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
      <DosageInput />
      <WithdrawalInput />
      <TextInput source="fabricant" label="Fabricant" />
      <TextInput source="notes" label="Notes" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

export const MedicamentCreate = () => (
  <Create>
    <SimpleForm toolbar={<CreateToolbar />}>
      <TextInput source="nom" label="Nom" validate={required()} />
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
      <DosageInput />
      <WithdrawalInput />
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
      <DosageField label="Dosage recommandé" />
      <TextField source="default_route" label="Voie par défaut" />
      <TextField source="withdrawal_period_meat" label="Attente Viande (jours)" />
      <TextField source="withdrawal_period_milk" label="Attente Lait (jours)" />
      <TextField source="dosage.notes" label="Notes dosage" />
      <TextField source="fabricant" label="Fabricant" />
      <TextField source="notes" label="Notes" />
    </SimpleShowLayout>
  </Show>
);
