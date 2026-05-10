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

// Custom Buttons
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from 'react-admin';

const CustomEditButton = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <Button
            component={Link}
            to={`/admin/categories/${record.id}`}
            label="ra.action.edit"
            onClick={(e) => e.stopPropagation()}
        >
            <EditIcon />
        </Button>
    );
};

export const CategoryList = () => (
    <List>
        <Datagrid rowClick={(id, resource, record) => `/admin/categories/${id}`}>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <DateField source="createdAt" label="Créé le" showTime />
            <DateField source="updatedAt" label="Modifié le" showTime />
            <CustomEditButton />
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
            <DateField source="createdAt" label="Créé le" showTime />
            <DateField source="updatedAt" label="Modifié le" showTime />
        </SimpleShowLayout>
    </Show>
);

