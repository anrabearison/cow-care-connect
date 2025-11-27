import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
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
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <DateField source="created_at" label="Créé le" showTime />
            <DateField source="updated_at" label="Modifié le" showTime />
            <EditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

// Édition d'un statut
export const StatusEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <TextField source="id" label="ID" />
            <TextInput source="name" label="Nom" validate={required()} />
        </SimpleForm>
    </Edit>
);

// Création d'un statut
export const StatusCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <TextInput source="name" label="Nom" validate={required()} helperText="L'ID sera généré automatiquement à partir du nom" />
        </SimpleForm>
    </Create>
);

// Affichage détaillé d'un statut
export const StatusShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <DateField source="created_at" label="Créé le" showTime />
            <DateField source="updated_at" label="Modifié le" showTime />
        </SimpleShowLayout>
    </Show>
);

