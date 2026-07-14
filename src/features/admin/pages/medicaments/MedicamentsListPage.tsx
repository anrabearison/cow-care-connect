import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/shared/DataTable";
import { useMedicaments } from "../../hooks/medicamentsHooks";
import { Medicament } from "@/features/admin/services/medicamentsService";
import { Button } from "@/components/ui/button";

const MedicamentsListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMedicaments({ page, q: search });

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
        pagination={{ page, pageSize: 10, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />
    </div>
  );
};

export default MedicamentsListPage;
