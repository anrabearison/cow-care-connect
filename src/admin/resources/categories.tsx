import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, Show, SimpleShowLayout } from 'react-admin';

export const CategoryList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="nom" label="Nom" />
            <EditButton />
        </Datagrid>
    </List>
);

export const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" label="ID" disabled />
            <TextInput source="nom" label="Nom" />
        </SimpleForm>
    </Edit>
);

export const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="nom" label="Nom" />
        </SimpleForm>
    </Create>
);

export const CategoryShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="nom" label="Nom" />
        </SimpleShowLayout>
    </Show>
);
