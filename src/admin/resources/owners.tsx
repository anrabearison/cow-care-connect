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

// Liste des propriétaires
export const OwnerList = () => (
    <List filters={ownerFilters}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Nom" />
            <TextField source="contact_info" label="Contact" />
            <TextField source="address" label="Adresse" />
            <ShowButton />
            <EditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

// Édition d'un propriétaire
export const OwnerEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <TextInput source="name" label="Nom" required />
            <TextInput source="contact_info" label="Contact" />
            <TextInput source="address" label="Adresse" />
        </SimpleForm>
    </Edit>
);

// Création d'un propriétaire
export const OwnerCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <TextInput source="name" label="Nom" required />
            <TextInput source="contact_info" label="Contact" />
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
            <TextField source="contact_info" label="Contact" />
            <TextField source="address" label="Adresse" />
        </SimpleShowLayout>
    </Show>
);
