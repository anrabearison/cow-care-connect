import { useAuth } from '@/features/auth/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { isSuperAdmin } from '@/constants/roles';

export const OwnerBadge = () => {
    const { user } = useAuth();

    // Return null for SUPER_ADMIN or if owner name is not available
    if (isSuperAdmin(user?.role) || !user?.owner?.name) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary" className="font-normal">
                {user.owner.name}
            </Badge>
        </div>
    );
};
