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
    Create,
    Show,
    SimpleShowLayout,
    useRecordContext,
} from 'react-admin';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

const ownerFilters = [
    <TextInput source="q" label="Rechercher" alwaysOn />,
];

const DeleteButtonField = () => {
    const record = useRecordContext();
    return (
        <ConfirmDeleteButton
            record={record}
            resource="owners"
            title="Supprimer ce propriétaire"
            message="Êtes-vous sûr de vouloir supprimer ce propriétaire ? Toutes ses données (utilisateurs, bétail) seront perdues."
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
            to={`/admin/owners/${record.id}`}
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
            to={`/admin/owners/${record.id}/show`}
            label="ra.action.show"
            onClick={(e) => e.stopPropagation()}
        >
            <VisibilityIcon />
        </Button>
    );
};

// Liste des propriétaires
export const OwnerList = () => (
    <List filters={ownerFilters}>
        <Datagrid rowClick={(id, resource, record) => `/admin/owners/${id}`}>
            <TextField source="name" label="Nom" />
            <TextField source="contactInfo" label="Contact" />
            <TextField source="address" label="Adresse" />
            <CustomShowButton />
            <CustomEditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

// Édition d'un propriétaire
export const OwnerEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <TextInput source="name" label="Nom" required />
            <TextInput source="contactInfo" label="Contact" />
            <TextInput source="address" label="Adresse" />
        </SimpleForm>
    </Edit>
);

// Création d'un propriétaire
export const OwnerCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <TextInput source="name" label="Nom" required />
            <TextInput source="contactInfo" label="Contact" />
            <TextInput source="address" label="Adresse" />
        </SimpleForm>
    </Create>
);

// Affichage détaillé d'un propriétaire
export const OwnerShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <TextField source="contactInfo" label="Contact" />
            <TextField source="address" label="Adresse" />
        </SimpleShowLayout>
    </Show>
);
