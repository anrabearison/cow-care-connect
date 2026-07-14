import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { medicamentsService, Medicament } from "@/features/admin/services/medicamentsService";
import { queryKeys } from "@/lib/queryKeys";

const MedicamentsListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: data, isLoading } = useQuery({
    queryKey: queryKeys.medicaments.list({ page, q: search }),
    queryFn: () =>
      medicamentsService.getMedicamentsList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const columns: Column<Medicament>[] = [
    { key: "name", header: "Nom" },
    { key: "type", header: "Type" },
    { key: "manufacturer", header: "Fabricant", render: (item) => item.manufacturer || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Médicaments</h1>
          <p className="text-muted-foreground mt-2">Gestion des médicaments</p>
        </div>
        <Button onClick={() => navigate("/admin/medicaments/new")}>Créer</Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => navigate(`/admin/medicaments/${item.id}/edit`)}
        onView={(item) => navigate(`/admin/medicaments/${item.id}`)}
        canEdit canView
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />
    </div>
  );
};

export default MedicamentsListPage;
