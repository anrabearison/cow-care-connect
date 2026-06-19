import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    Create,
    Show,
    TabbedShowLayout,
    Tab,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    FunctionField,
    required,
    ShowButton,
    CreateButton,
    ExportButton,
    FilterButton,
    TopToolbar,
    ArrayField,
    useRecordContext,
    usePermissions,
    useGetIdentity,
} from 'react-admin';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';
import { isOwnerAdmin } from '../../constants/roles';

// Custom ListActions
const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

// Delete button component with confirmation
const DeleteButtonField = () => {
    const record = useRecordContext();
    return (
        <ConfirmDeleteButton
            record={record}
            resource="herd-books"
            title="Supprimer ce livre de troupeau"
            message="Êtes-vous sûr de vouloir supprimer ce livre de troupeau ? Cette action supprimera également toutes les inscriptions de bovins associées."
        />
    );
};

// Filtres pour la liste des livres de troupeau
const herdBookFilters = [
    <TextInput
        source="q"
        label="Rechercher"
        placeholder="Référence, description..."
        alwaysOn
    />,
    <NumberInput
        source="year"
        label="Année"
    />,
    <ReferenceInput
        source="ownerId"
        reference="owners"
        label="Propriétaire"
    >
        <SelectInput optionText="name" />
    </ReferenceInput>,
];

// Custom Buttons
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from 'react-admin';

const CustomEditButton = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <Button
            component={Link}
            to={`/admin/herd-books/${record.id}`}
            label="ra.action.edit"
            onClick={(e) => e.stopPropagation()}
        >
            <EditIcon />
        </Button>
    );
};

const CustomShowButton = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <Button
            component={Link}
            to={`/admin/herd-books/${record.id}/show`}
            label="ra.action.show"
            onClick={(e) => e.stopPropagation()}
        >
            <VisibilityIcon />
        </Button>
    );
};

// Liste des livres de troupeau
export const HerdBookList = () => (
    <List filters={herdBookFilters} actions={<ListActions />} sort={{ field: 'year', order: 'DESC' }}>
        <Datagrid rowClick={(id, resource, record) => `/admin/herd-books/${id}/show`}>
            <NumberField source="year" label="Année" />
            <TextField source="reference" label="Référence" />
            <ReferenceField source="ownerId" reference="owners" label="Propriétaire">
                <TextField source="name" />
            </ReferenceField>
            <FunctionField
                label="Description"
                render={(record: any) =>
                    record.description
                        ? (record.description.length > 50
                            ? `${record.description.substring(0, 50)}...`
                            : record.description)
                        : '-'
                }
            />
            <FunctionField
                label="Bovins"
                render={(record: any) => record.cattleCount || 0}
            />
            <DateField source="createdAt" label="Créé le" showTime />
            <CustomShowButton />
            <CustomEditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

// Édition d'un livre de troupeau
export const HerdBookEdit = () => {
    const { permissions } = usePermissions();
    return (
        <Edit>
            <SimpleForm toolbar={<EditToolbar />}>
                <NumberInput
                    source="year"
                    label="Année"
                    validate={[required(), (value) => {
                        if (value < 2000) return 'L\'année doit être >= 2000';
                        if (value > new Date().getFullYear() + 1) return 'L\'année ne peut pas être trop loin dans le futur';
                        return undefined;
                    }]}
                />
                <TextInput
                    source="reference"
                    label="Référence"
                    validate={[required()]}
                    helperText="Ex: LT-2024-001"
                />
                <ReferenceInput
                    source="ownerId"
                    reference="owners"
                    label="Propriétaire"
                >
                    <SelectInput optionText="name" validate={required()} disabled={isOwnerAdmin(permissions)} />
                </ReferenceInput>
                <TextInput
                    source="description"
                    label="Description"
                    multiline
                    rows={3}
                />
            </SimpleForm>
        </Edit>
    );
};

// Création d'un livre de troupeau
export const HerdBookCreate = () => {
    const { permissions } = usePermissions();
    const { data: identity } = useGetIdentity();

    const defaultValues = {
        year: new Date().getFullYear(),
        ...(isOwnerAdmin(permissions) && identity?.ownerId ? { ownerId: identity.ownerId } : {})
    };

    return (
        <Create>
            <SimpleForm toolbar={<CreateToolbar />} defaultValues={defaultValues}>
                <NumberInput
                    source="year"
                    label="Année"
                    validate={[required(), (value) => {
                        if (value < 2000) return 'L\'année doit être >= 2000';
                        if (value > new Date().getFullYear() + 1) return 'L\'année ne peut pas être trop loin dans le futur';
                        return undefined;
                    }]}
                />
                <TextInput
                    source="reference"
                    label="Référence"
                    validate={[required()]}
                    helperText="Ex: LT-2024-001"
                />
                <ReferenceInput
                    source="ownerId"
                    reference="owners"
                    label="Propriétaire"
                >
                    <SelectInput optionText="name" validate={required()} disabled={isOwnerAdmin(permissions)} />
                </ReferenceInput>
                <TextInput
                    source="description"
                    label="Description"
                    multiline
                    rows={3}
                />
            </SimpleForm>
        </Create>
    );
};

// Helper component for inline field display
interface InlineFieldProps {
    label: string;
    children: React.ReactNode;
}

const InlineField: React.FC<InlineFieldProps> = ({ label, children }) => {
    const record = useRecordContext();
    return (
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1">
            <span className="text-sm font-medium text-gray-500 min-w-[140px] shrink-0">{label}:</span>
            <div className="text-gray-900 font-medium">
                {React.Children.map(children, child =>
                    React.isValidElement(child) ? React.cloneElement(child, { record } as any) : child
                )}
            </div>
        </div>
    );
};

// Affichage détaillé d'un livre de troupeau
export const HerdBookShow = () => (
    <Show>
        <TabbedShowLayout syncWithLocation={false}>
            <Tab label="Informations">
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            📋 Informations du livre
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <InlineField label="Année"><NumberField source="year" /></InlineField>
                            <InlineField label="Référence"><TextField source="reference" /></InlineField>
                            <InlineField label="Propriétaire">
                                <ReferenceField source="ownerId" reference="owners">
                                    <TextField source="name" />
                                </ReferenceField>
                            </InlineField>
                            <InlineField label="Description"><TextField source="description" /></InlineField>
                            <InlineField label="Créé le"><DateField source="createdAt" showTime /></InlineField>
                            <InlineField label="Modifié le"><DateField source="updatedAt" showTime /></InlineField>
                        </Box>
                    </CardContent>
                </Card>
            </Tab>

            <Tab label="Bovins inscrits">
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Bovins inscrits dans ce livre
                        </Typography>
                        <ArrayField source="cattleEntries" label={false}>
                            <Datagrid bulkActionButtons={false} hover={false}>
                                <FunctionField
                                    label="Photo"
                                    render={(record: any) =>
                                        record.cattle?.photo ? (
                                            <img
                                                src={record.cattle.photo}
                                                alt={record.cattle.name}
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    objectFit: 'cover',
                                                    borderRadius: 8
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: 50,
                                                height: 50,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: 8,
                                                fontSize: '20px'
                                            }}>
                                                🐄
                                            </div>
                                        )
                                    }
                                />
                                <FunctionField
                                    label="Bovin"
                                    render={(record: any) => record.cattle?.name || '-'}
                                />
                                <TextField source="nCarnet" label="N° Carnet" />
                                <ReferenceField source="categoryId" reference="categories" label="Catégorie">
                                    <TextField source="name" />
                                </ReferenceField>
                                <ReferenceField source="statusId" reference="status" label="Statut">
                                    <TextField source="name" />
                                </ReferenceField>
                                <DateField source="createdAt" label="Date d'inscription" />
                                <ShowButton resource="herd-book-cattle" />
                            </Datagrid>
                        </ArrayField>
                    </CardContent>
                </Card>
            </Tab>
        </TabbedShowLayout>
    </Show>
);
