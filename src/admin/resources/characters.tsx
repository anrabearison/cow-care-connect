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
            resource="characters"
            title="Supprimer ce caractère"
            message="Êtes-vous sûr de vouloir supprimer ce caractère ? Cette action peut affecter les bovins associés."
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
            to={`/admin/characters/${record.id}`}
            label="ra.action.edit"
            onClick={(e) => e.stopPropagation()}
        >
            <EditIcon />
        </Button>
    );
};

// Liste des caractères
export const CharactersList = () => (
    <List>
        <Datagrid rowClick={(id, resource, record) => `/admin/characters/${id}`}>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <DateField source="createdAt" label="Créé le" showTime />
            <DateField source="updatedAt" label="Modifié le" showTime />
            <CustomEditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

// Édition d'un caractère
export const CharactersEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <TextField source="id" label="ID" />
            <TextInput source="name" label="Nom" validate={required()} />
        </SimpleForm>
    </Edit>
);

// Création d'un caractère
export const CharactersCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <TextInput source="name" label="Nom" validate={required()} helperText="L'ID sera généré automatiquement à partir du nom" />
        </SimpleForm>
    </Create>
);

// Affichage détaillé d'un caractère
export const CharactersShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <DateField source="createdAt" label="Créé le" showTime />
            <DateField source="updatedAt" label="Modifié le" showTime />
        </SimpleShowLayout>
    </Show>
);

