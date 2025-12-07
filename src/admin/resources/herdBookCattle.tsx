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

// Liste des inscriptions
export const HerdBookCattleList = () => (
    <List
        filters={herdBookCattleFilters}
        actions={<ListActions />}
        sort={{ field: 'created_at', order: 'DESC' }}
    >
        <Datagrid rowClick="show">
            <ReferenceField source="herd_book_id" reference="herd-books" label="Livre">
                <FunctionField render={(record: any) => `${record.year} - ${record.reference}`} />
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
                        'STAT001': '#4caf50', // Actif - vert
                        'STAT002': '#ff9800', // Malade - orange
                        'STAT003': '#f44336', // Mort - rouge
                        'STAT004': '#2196f3', // Vendu - bleu
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
            <ShowButton />
            <EditButton />
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

            <ReferenceInput
                source="cattle_id"
                reference="cattle"
                label="Bovin"
            >
                <AutocompleteInput
                    optionText="name"
                    validate={required()}
                    filterToQuery={(searchText) => ({ q: searchText })}
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
                <SelectInput
                    optionText="name"
                    validate={required()}
                    defaultValue="STAT001"
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
