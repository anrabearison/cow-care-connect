import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    EditButton,
    DeleteButton,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    Create,
    Show,
    SimpleShowLayout,
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
            resource="status"
            title="Supprimer ce statut"
            message="Êtes-vous sûr de vouloir supprimer ce statut ? Cette action peut affecter les bovins associés."
        />
    );
};

// Liste des statuts
export const StatusList = () => (
    <List>
        <Datagrid rowClick="edit">
            <NumberField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <EditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

// Édition d'un statut
export const StatusEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <NumberInput source="id" label="ID" disabled />
            <TextInput source="name" label="Nom" validate={required()} />
        </SimpleForm>
    </Edit>
);

// Création d'un statut
export const StatusCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <NumberInput source="id" label="ID" validate={required()} />
            <TextInput source="name" label="Nom" validate={required()} />
        </SimpleForm>
    </Create>
);

// Affichage détaillé d'un statut
export const StatusShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="id" label="ID" />
            <TextField source="name" label="Nom" />
        </SimpleShowLayout>
    </Show>
);
