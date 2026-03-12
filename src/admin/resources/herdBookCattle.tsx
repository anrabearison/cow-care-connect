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
    DateInput,
    Create,
    Show,
    SimpleShowLayout,
    ReferenceField,
    ReferenceInput,
    AutocompleteInput,
    SelectInput,
    FunctionField,
    required,
    ShowButton,
    CreateButton,
    ExportButton,
    FilterButton,
    TopToolbar,
    useRecordContext,
    FormDataConsumer,
    NumberInput,
} from 'react-admin';
import { EditToolbar, CreateToolbar, ConfirmDeleteButton } from '../components/ConfirmToolbars';

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
            resource="herd-book-cattle"
            title="Supprimer cette inscription"
            message="Êtes-vous sûr de vouloir supprimer cette inscription de bovin dans le livre de troupeau ?"
        />
    );
};

// Filtres pour la liste des inscriptions
const herdBookCattleFilters = [
    <TextInput
        source="q"
        label="Rechercher"
        placeholder="N° carnet..."
        alwaysOn
    />,
    <ReferenceInput
        source="herd_book_id"
        reference="herd-books"
        label="Livre de troupeau"
    >
        <SelectInput optionText={(record) => `${record.year} - ${record.reference}`} />
    </ReferenceInput>,
    <ReferenceInput
        source="cattle_id"
        reference="cattle"
        label="Bovin"
    >
        <AutocompleteInput optionText="name" />
    </ReferenceInput>,
    <ReferenceInput
        source="category_id"
        reference="categories"
        label="Catégorie"
    >
        <SelectInput optionText="name" />
    </ReferenceInput>,
    <ReferenceInput
        source="status_id"
        reference="status"
        label="Statut"
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
            to={`/admin/herd-book-cattle/${record.id}`}
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
            to={`/admin/herd-book-cattle/${record.id}/show`}
            label="ra.action.show"
            onClick={(e) => e.stopPropagation()}
        >
            <VisibilityIcon />
        </Button>
    );
};

// Liste des inscriptions
export const HerdBookCattleList = () => (
    <List
        filters={herdBookCattleFilters}
        actions={<ListActions />}
        sort={{ field: 'created_at', order: 'DESC' }}
    >
        <Datagrid rowClick={(id, resource, record) => `/admin/herd-book-cattle/${id}/show`}>
            <ReferenceField source="herd_book_id" reference="herd-books" label="Livre">
                <FunctionField render={(record: any) => `${record.year} - ${record.reference}`} />
            </ReferenceField>
            <ReferenceField source="herd_book.owner_id" reference="owners" label="Propriétaire" link="show">
                <TextField source="name" />
            </ReferenceField>
            <FunctionField
                label="Photo"
                render={(record: any) => (
                    record.cattle?.photo ? (
                        <img
                            src={record.cattle.photo}
                            alt={record.cattle.name}
                            style={{
                                width: 40,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 6
                            }}
                        />
                    ) : (
                        <div style={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 6,
                            fontSize: '16px'
                        }}>
                            🐄
                        </div>
                    )
                )}
            />
            <FunctionField
                label="Nom"
                render={(record: any) => record.cattle?.name || '-'}
            />
            <FunctionField
                label="Surnom"
                render={(record: any) => record.cattle?.nickname || '-'}
            />
            <FunctionField
                label="Date de naissance"
                render={(record: any) => record.cattle?.birthDate ? new Date(record.cattle.birthDate).toLocaleDateString() : '-'}
            />
            <FunctionField
                label="Signe particulier"
                render={(record: any) => record.cattle?.distinctiveSign || '-'}
            />
            <FunctionField
                label="Source"
                render={(record: any) => record.cattle?.source?.type || '-'}
            />
            <TextField source="n_carnet" label="N° Carnet" />
            <ReferenceField source="category_id" reference="categories" label="Catégorie">
                <TextField source="name" />
            </ReferenceField>
            <FunctionField
                label="Statut"
                render={(record: any) => {
                    const statusColors: Record<string, string> = {
                        'STA001': '#4caf50', // Actif - vert
                        'STA002': '#ff9800', // Malade - orange
                        'STA003': '#f44336', // Mort - rouge
                        'STA004': '#2196f3', // Vendu - bleu
                    };
                    const color = statusColors[record.status_id || ''] || '#9e9e9e';

                    return (
                        <span style={{
                            padding: '4px 12px',
                            borderRadius: 12,
                            backgroundColor: `${color}20`,
                            color: color,
                            fontWeight: 500,
                            fontSize: '0.85em',
                            display: 'inline-block'
                        }}>
                            {record.status?.name || 'Inconnu'}
                        </span>
                    );
                }}
            />
            <DateField source="created_at" label="Date d'inscription" showTime />
            <CustomShowButton />
            <CustomEditButton />
            <DeleteButtonField />
        </Datagrid>
    </List>
);

// Édition d'une inscription
export const HerdBookCattleEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            <ReferenceInput
                source="herd_book_id"
                reference="herd-books"
                label="Livre de troupeau"
            >
                <SelectInput
                    optionText={(record) => `${record.year} - ${record.reference}`}
                    validate={required()}
                />
            </ReferenceInput>

            <ReferenceInput
                source="cattle_id"
                reference="cattle"
                label="Bovin"
            >
                <AutocompleteInput
                    optionText="name"
                    validate={required()}
                />
            </ReferenceInput>

            <TextInput
                source="n_carnet"
                label="N° Carnet"
                helperText="Numéro de carnet pour cette année (optionnel)"
            />

            <ReferenceInput
                source="category_id"
                reference="categories"
                label="Catégorie"
            >
                <SelectInput optionText="name" validate={required()} />
            </ReferenceInput>

            <ReferenceInput
                source="status_id"
                reference="status"
                label="Statut"
            >
                <SelectInput optionText="name" validate={required()} />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

// Création d'une inscription
export const HerdBookCattleCreate = () => (
    <Create>
        <SimpleForm toolbar={<CreateToolbar />}>
            <ReferenceInput
                source="herd_book_id"
                reference="herd-books"
                label="Livre de troupeau"
                sort={{ field: 'year', order: 'DESC' }}
            >
                <SelectInput
                    optionText={(record) => `${record.year} - ${record.reference}`}
                    validate={required()}
                />
            </ReferenceInput>

            <TextInput source="cattle.name" label="Nom du bovin" required />
            
            <SelectInput
                source="cattle.gender"
                label="Genre"
                choices={[
                    { id: 'M', name: 'Mâle' },
                    { id: 'F', name: 'Femelle' },
                ]}
                validate={required()}
            />
            
            <DateInput 
                source="cattle.birthDate" 
                label="Date de naissance" 
                validate={required()} 
            />
            
            <ReferenceInput source="cattle.character" reference="characters" label="Caractère">
                <AutocompleteInput optionText="name" validate={required()} />
            </ReferenceInput>
            
            <SelectInput
                source="cattle.source.type"
                label="Type de source"
                choices={[
                    { id: 'ACHETE', name: 'Acheté' },
                    { id: 'NE_DANS_TROUPEAU', name: 'Né dans le troupeau' },
                ]}
                validate={required()}
            />

            <FormDataConsumer>
                {({ formData, ...rest }) => formData?.cattle?.source?.type === 'ACHETE' && (
                    <div style={{ paddingLeft: '2em', borderLeft: '3px solid #e0e0e0', marginLeft: '1em', marginBottom: '1em' }}>
                        <TextInput source="cattle.source.supplier" label="Fournisseur" {...rest} fullWidth />
                        <DateInput source="cattle.source.purchaseDate" label="Date d'achat" {...rest} fullWidth />
                        <NumberInput source="cattle.source.purchasePrice" label="Prix d'achat (Ar)" {...rest} fullWidth />
                        <NumberInput source="cattle.source.purchaseWeight" label="Poids à l'achat (kg)" {...rest} fullWidth />
                        <TextInput source="cattle.source.purchaseHealthStatus" label="État de santé à l'achat" {...rest} fullWidth />
                        <TextInput source="cattle.source.purchaseNotes" label="Remarques achat" multiline rows={3} {...rest} fullWidth />
                    </div>
                )}
            </FormDataConsumer>

            <FormDataConsumer>
                {({ formData, ...rest }) => formData?.cattle?.source?.type === 'NE_DANS_TROUPEAU' && (
                    <div style={{ paddingLeft: '2em', borderLeft: '3px solid #e0e0e0', marginLeft: '1em', marginBottom: '1em' }}>
                        <ReferenceInput source="cattle.source.motherId" reference="cattle" filter={{ gender: 'F' }} label="Mère (optionnel)" {...rest}>
                            <AutocompleteInput optionText="name" fullWidth />
                        </ReferenceInput>
                    </div>
                )}
            </FormDataConsumer>

            <TextInput
                source="n_carnet"
                label="N° Carnet"
                helperText="Numéro de carnet pour cette année (optionnel)"
            />

            <ReferenceInput
                source="category_id"
                reference="categories"
                label="Catégorie"
            >
                <SelectInput optionText="name" validate={required()} />
            </ReferenceInput>

            <ReferenceInput
                source="status_id"
                reference="status"
                label="Statut"
            >
                <SelectInput
                    optionText="name"
                    validate={required()}
                    defaultValue="STA001"
                />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

// Affichage détaillé d'une inscription
export const HerdBookCattleShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />

            <ReferenceField source="herd_book_id" reference="herd-books" label="Livre de troupeau" link="show">
                <FunctionField render={(record: any) => `${record.year} - ${record.reference}`} />
            </ReferenceField>

            <ReferenceField source="herd_book.owner_id" reference="owners" label="Propriétaire" link="show">
                <TextField source="name" />
            </ReferenceField>

            <ReferenceField source="cattle_id" reference="cattle" label="Bovin" link="show">
                <FunctionField
                    render={(record: any) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {record.photo && (
                                <img
                                    src={record.photo}
                                    alt={record.name}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        objectFit: 'cover',
                                        borderRadius: 8
                                    }}
                                />
                            )}
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{record.name}</div>
                                {record.nickname && (
                                    <div style={{ fontSize: '0.85em', color: '#666', fontStyle: 'italic' }}>
                                        "{record.nickname}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                />
            </ReferenceField>

            <TextField source="n_carnet" label="N° Carnet" />

            <ReferenceField source="category_id" reference="categories" label="Catégorie">
                <TextField source="name" />
            </ReferenceField>

            <ReferenceField source="status_id" reference="status" label="Statut">
                <TextField source="name" />
            </ReferenceField>

            <DateField source="created_at" label="Date d'inscription" showTime />
            <DateField source="updated_at" label="Dernière modification" showTime />
        </SimpleShowLayout>
    </Show>
);
