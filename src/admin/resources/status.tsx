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
            to={`/admin/status/${record.id}`}
            label="ra.action.edit"
            onClick={(e) => e.stopPropagation()}
        >
            <EditIcon />
        </Button>
    );
};

// Liste des statuts
export const StatusList = () => (
    <List>
        <Datagrid rowClick={(id, resource, record) => `/admin/status/${id}`}>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <DateField source="createdAt" label="Créé le" showTime />
            <DateField source="updatedAt" label="Modifié le" showTime />
            <CustomEditButton />
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
            <DateField source="createdAt" label="Créé le" showTime />
            <DateField source="updatedAt" label="Modifié le" showTime />
        </SimpleShowLayout>
    </Show>
);

