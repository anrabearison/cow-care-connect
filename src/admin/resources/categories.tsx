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

const DeleteButtonField = () => {
    const record = useRecordContext();
    return (
        <ConfirmDeleteButton
            record={record}
            resource="categories"
            title="Supprimer cette catégorie"
            message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Tous les bovins associés à cette catégorie devront être réassignés."
        />
    );
};

export const CategoryList = () => (
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

export const CategoryEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <TextField source="id" label="ID" />
            <TextInput source="name" label="Nom" validate={required()} />
        </SimpleForm>
    </Edit>
);

export const CategoryCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <TextInput source="name" label="Nom" validate={required()} helperText="L'ID sera généré automatiquement à partir du nom" />
        </SimpleForm>
    </Create>
);

export const CategoryShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <DateField source="created_at" label="Créé le" showTime />
            <DateField source="updated_at" label="Modifié le" showTime />
        </SimpleShowLayout>
    </Show>
);

