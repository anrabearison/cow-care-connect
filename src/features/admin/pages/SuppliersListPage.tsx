import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/admin/DataTable";
import { useSuppliers } from "@/features/admin/hooks/purchasesHooks";
import { Supplier } from "@/features/admin/services/purchasesService";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const SuppliersListPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading } = useSuppliers({ page, q: search });

    const columns: Column<Supplier>[] = [
        { key: "name", header: "Nom" },
        { key: "phone", header: "Téléphone", render: (item) => item.phone || "-" },
        { key: "email", header: "Email", render: (item) => item.email || "-" },
        { key: "address", header: "Adresse", render: (item) => item.address || "-" },
    ];

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        Fournisseurs
                    </h1>
                    <p className="text-muted-foreground mt-2">Gestion des fournisseurs de bétail</p>
                </div>
                <Button onClick={() => navigate("/admin/suppliers/new")}>Créer</Button>
            </div>

            <DataTable
                data={data?.data || []}
                columns={columns}
                loading={isLoading}
                onView={(item) => navigate(`/admin/suppliers/${item.id}`)}
                onEdit={(item) => navigate(`/admin/suppliers/${item.id}/edit`)}
                canView canEdit
                pagination={{ page, pageSize: 10, total: data?.total || 0, onPageChange: setPage }}
                search={{ value: search, onChange: setSearch }}
            />
        </div>
    );
};

export default SuppliersListPage;
