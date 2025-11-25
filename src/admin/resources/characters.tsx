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
            resource="characters"
            title="Supprimer ce caractère"
            message="Êtes-vous sûr de vouloir supprimer ce caractère ? Cette action peut affecter les bovins associés."
        />
    );
};

// Liste des caractères
export const CharactersList = () => (
    <List>
        <Datagrid rowClick="edit">
            <NumberField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <EditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

// Édition d'un caractère
export const CharactersEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <NumberInput source="id" label="ID" disabled />
            <TextInput source="name" label="Nom" validate={required()} />
        </SimpleForm>
    </Edit>
);

// Création d'un caractère
export const CharactersCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <NumberInput source="id" label="ID" validate={required()} />
            <TextInput source="name" label="Nom" validate={required()} />
        </SimpleForm>
    </Create>
);

// Affichage détaillé d'un caractère
export const CharactersShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="id" label="ID" />
            <TextField source="name" label="Nom" />
        </SimpleShowLayout>
    </Show>
);
