import React from 'react';
import { useRecordContext } from 'react-admin';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

// Mapping des noms de ressources techniques vers les noms français
const RESOURCE_LABELS: Record<string, string> = {
    cattle: 'Bovins',
    categories: 'Catégories',
    users: 'Utilisateurs',
    veterinarians: 'Vétérinaires',
    medicaments: 'Médicaments',
    typeEvenements: "Types d'événements",
    evenements: 'Événements',
    traitements: 'Traitements',
};

export const AdminBreadcrumb: React.FC = () => {
    const record = useRecordContext();
    const location = useLocation();

    // Extraire la ressource et l'action depuis l'URL
    const parseUrl = () => {
        const path = location.pathname;

        // Exemple de chemins:
        // /admin -> dashboard
        // /admin/cattle -> list
        // /admin/cattle/create -> create
        // /admin/cattle/123 -> show

        const parts = path.split('/').filter(Boolean);

        // Si on est juste sur /admin
        if (parts.length <= 1) {
            return { resource: null, action: 'dashboard', id: null };
        }

        const resource = parts[1]; // Le nom de la ressource

        // Déterminer l'action
        if (parts.length === 2) {
            return { resource, action: 'list', id: null };
        }

        if (parts[2] === 'create') {
            return { resource, action: 'create', id: null };
        }

        // Si c'est un nombre, c'est un show
        const id = parts[2];
        return { resource, action: 'show', id };
    };

    const { resource, action, id } = parseUrl();
    const resourceLabel = resource ? RESOURCE_LABELS[resource] || resource : null;

    // Si on est sur le dashboard
    if (!resource || action === 'dashboard') {
        return (
            <div className="bg-white border-b px-6 py-3">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Dashboard
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        );
    }

    // Construire le breadcrumb avec la ressource
    return (
        <div className="bg-white border-b px-6 py-3">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/admin" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    {action === 'list' ? (
                        <BreadcrumbItem>
                            <BreadcrumbPage>{resourceLabel}</BreadcrumbPage>
                        </BreadcrumbItem>
                    ) : (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={`/admin/${resource}`}>{resourceLabel}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {action === 'create' && 'Créer'}
                                    {action === 'show' && `Détails${id ? ` #${id}` : record?.id ? ` #${record.id}` : ''}`}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};
