import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useVeterinarians } from "@/features/admin/hooks/veterinariansHooks";
import { Veterinarian } from "@/features/admin/services/veterinariansService";

const VeterinariansListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useVeterinarians({ page, q: search });

  const columns: Column<Veterinarian>[] = [
    { key: "name", header: "Nom" },
    { key: "specialty", header: "Spécialité", render: (item) => item.specialty || "-" },
    { key: "phone", header: "Téléphone", render: (item) => item.phone || "-" },
    { key: "email", header: "Email", render: (item) => item.email || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Vétérinaires</h1>
          <p className="text-muted-foreground mt-2">Gestion des vétérinaires</p>
        </div>
        <Button onClick={() => navigate("/admin/veterinarians/new")}>Créer</Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => navigate(`/admin/veterinarians/${item.id}/edit`)}
        onView={(item) => navigate(`/admin/veterinarians/${item.id}`)}
        canEdit canView
        pagination={{ page, pageSize: 10, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />
    </div>
  );
};

export default VeterinariansListPage;
