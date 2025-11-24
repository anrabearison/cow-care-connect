import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, Show, SimpleShowLayout, useRecordContext } from 'react-admin';
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
            <EditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

export const CategoryEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <TextInput source="id" label="ID" disabled />
            <TextInput source="name" label="Nom" required />
        </SimpleForm>
    </Edit>
);

export const CategoryCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <TextInput source="name" label="Nom" required />
        </SimpleForm>
    </Create>
);

export const CategoryShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
        </SimpleShowLayout>
    </Show>
);
