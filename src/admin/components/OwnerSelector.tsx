import React, { useEffect, useState } from 'react';
import { useDataProvider, usePermissions } from 'react-admin';
import { Select, MenuItem, FormControl, Box, Chip, IconButton } from '@mui/material';
import { Business, Close } from '@mui/icons-material';
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
                    // Validate that the selected owner still exists
                    if (selectedOwnerId && !data.find((o: Owner) => o.id === selectedOwnerId)) {
                        console.warn(`Selected owner ${selectedOwnerId} not found in loaded owners, resetting selection`);
                        setSelectedOwnerId(null);
                    }
                })
                .catch((error) => {
                    console.error('Failed to load owners:', error);
                    // Reset selection on error
                    setSelectedOwnerId(null);
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 2 }}>
            <Business sx={{ color: 'white', fontSize: 20 }} />
            <FormControl
                size="small"
                sx={{
                    minWidth: 220,
                    '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.7)',
                        },
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'white',
                    },
                }}
            >
                <Select
                    value={loading || owners.length === 0 ? '' : (selectedOwnerId || '')}
                    onChange={(e) => {
                        setSelectedOwnerId(e.target.value || null);
                        // Refresh the page to ensure all data is updated
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }}
                    disabled={loading}
                    displayEmpty
                    sx={{
                        color: 'white',
                        fontSize: '0.875rem',
                        '& .MuiSelect-select': {
                            py: 1,
                        },
                    }}
                >
                    <MenuItem value="">
                        <em>{loading ? 'Chargement...' : 'Tous les propriétaires'}</em>
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
                    label={selectedOwner.name}
                    size="small"
                    onDelete={() => {
                        setSelectedOwnerId(null);
                        // Refresh the page to ensure all data is updated
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }}
                    deleteIcon={<Close sx={{ fontSize: 16 }} />}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                                color: 'white',
                            },
                        },
                    }}
                />
            )}
        </Box>
    );
};
