import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { useOwnerSelection } from '@/contexts/OwnerSelectionContext';
import { apiClient, setOwnerIdGetter } from '@/utils/apiClient';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface Owner {
    id: string;
    name: string;
}

const refreshOwnerScopedQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
    await queryClient.invalidateQueries();
    await queryClient.refetchQueries({ type: 'active' });
};

export const OwnerSelector = () => {
    const { user } = useAuth();
    const { selectedOwnerId, setSelectedOwnerId, selectedOwnerName, setSelectedOwnerName } = useOwnerSelection();
    const [owners, setOwners] = useState<Owner[]>([]);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user?.ownerId && (user?.role === 'OWNER_ADMIN' || user?.role === 'OWNER_USER')) {
            setSelectedOwnerId(user.ownerId);
            apiClient
                .get<Owner>(`/api/v1/owners/${user.ownerId}`)
                .then((response) => {
                    setSelectedOwnerName(response.name);
                })
                .catch((error) => {
                    console.error('Failed to load owner:', error);
                });
        } else if (user?.role === 'SUPER_ADMIN') {
            setLoading(true);
            apiClient
                .get<{ data: Owner[] }>('/api/v1/owners')
                .then((response) => {
                    setOwners(response.data || []);
                })
                .catch((error) => {
                    console.error('Failed to load owners:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user, setSelectedOwnerId, setSelectedOwnerName]);

    const handleOwnerChange = async (ownerId: string) => {
        if (ownerId === '__all__') {
            setOwnerIdGetter(() => null);
            setSelectedOwnerId(null);
            setSelectedOwnerName(null);
        } else {
            const owner = owners.find((o) => o.id === ownerId);
            setOwnerIdGetter(() => ownerId);
            setSelectedOwnerId(ownerId);
            setSelectedOwnerName(owner?.name || null);
        }

        await refreshOwnerScopedQueries(queryClient);
    };

    const handleClearSelection = async () => {
        setOwnerIdGetter(() => null);
        setSelectedOwnerId(null);
        setSelectedOwnerName(null);
        await refreshOwnerScopedQueries(queryClient);
    };

    if (user?.role === 'OWNER_ADMIN' || user?.role === 'OWNER_USER') {
        return (
            <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="font-normal">
                    {selectedOwnerName || 'Chargement...'}
                </Badge>
            </div>
        );
    }

    if (user?.role !== 'SUPER_ADMIN') {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={selectedOwnerId || '__all__'} onValueChange={handleOwnerChange} disabled={loading}>
                <SelectTrigger className="w-[150px] sm:w-[200px] h-9">
                    <SelectValue placeholder="Tous les propriétaires" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="__all__">Tous les propriétaires</SelectItem>
                    {owners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                            {owner.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {selectedOwnerId && selectedOwnerName && (
                <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
                    onClick={handleClearSelection}
                >
                    <span className="hidden sm:inline">Vue: </span>{selectedOwnerName}
                    <X className="ml-1 h-3 w-3" />
                </Badge>
            )}
        </div>
    );
};
