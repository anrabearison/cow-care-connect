import { API_ENDPOINTS } from '@/config/api';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { useOwnerSelection } from '@/contexts/OwnerSelectionContext';
import { apiClient } from '@/utils/apiClient';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface Owner {
    id: string;
    name: string;
}

export const OwnerSelector = () => {
    const { user } = useAuth();
    const { selectedOwnerName, setSelectedOwnerName } = useOwnerSelection();

    useEffect(() => {
        if (user?.ownerId && (user?.role === 'OWNER_ADMIN' || user?.role === 'OWNER_USER')) {
            apiClient
                .get<Owner>(API_ENDPOINTS.OWNERS.byId(user.ownerId))
                .then((response) => {
                    setSelectedOwnerName(response.name);
                })
                .catch((error) => {
                    console.error('Failed to load owner:', error);
                });
        }
    }, [user, setSelectedOwnerName]);

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

    // For SUPER_ADMIN, return null since they no longer have access to farm-scoped routes
    return null;
};
