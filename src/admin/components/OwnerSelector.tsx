import React, { useEffect, useState } from 'react';
import { useDataProvider, usePermissions } from 'react-admin';
import { Select, MenuItem, FormControl, InputLabel, Box, Chip } from '@mui/material';
import { Business } from '@mui/icons-material';
import { isSuperAdmin } from '@/constants/roles';
import { useOwnerSelection } from '../contexts/OwnerSelectionContext';

interface Owner {
    id: string;
    name: string;
}

export const OwnerSelector: React.FC = () => {
    const { permissions } = usePermissions();
    const dataProvider = useDataProvider();
    const { selectedOwnerId, setSelectedOwnerId } = useOwnerSelection();
    const [owners, setOwners] = useState<Owner[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isSuperAdmin(permissions)) {
            setLoading(true);
            dataProvider.getList('owners', {
                pagination: { page: 1, perPage: 100 },
                sort: { field: 'name', order: 'ASC' },
                filter: {},
            })
                .then(({ data }) => {
                    setOwners(data);
                })
                .catch((error) => {
                    console.error('Failed to load owners:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [permissions, dataProvider]);

    if (!isSuperAdmin(permissions)) {
        return null;
    }

    const selectedOwner = owners.find(o => o.id === selectedOwnerId);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <FormControl size="small" sx={{ minWidth: 250 }}>
                <InputLabel id="owner-selector-label">Propriétaire</InputLabel>
                <Select
                    labelId="owner-selector-label"
                    value={selectedOwnerId || ''}
                    onChange={(e) => setSelectedOwnerId(e.target.value || null)}
                    label="Propriétaire"
                    disabled={loading}
                    startAdornment={<Business sx={{ mr: 1, color: 'action.active' }} />}
                >
                    <MenuItem value="">
                        <em>Tous les propriétaires</em>
                    </MenuItem>
                    {owners.map((owner) => (
                        <MenuItem key={owner.id} value={owner.id}>
                            {owner.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedOwner && (
                <Chip
                    label={`Vue: ${selectedOwner.name}`}
                    color="primary"
                    size="small"
                    onDelete={() => setSelectedOwnerId(null)}
                />
            )}
        </Box>
    );
};
