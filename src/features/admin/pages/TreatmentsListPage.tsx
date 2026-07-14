import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { treatmentsService, Treatment, TreatmentDosage } from "@/features/admin/services/treatmentsService";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";

const TreatmentsListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: data, isLoading } = useQuery({
    queryKey: queryKeys.treatments.list({ page, q: search }),
    queryFn: () =>
      treatmentsService.getTreatmentsList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const formatDosage = (dosage?: TreatmentDosage) => {
    if (!dosage?.quantity || !dosage.unit) return "-";
    return `${dosage.quantity} ${dosage.unit}`;
  };

  function getEntityLabel(value: unknown, fallback = "-") {
    if (value === null || value === undefined || value === "") return fallback;
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object") {
      const entity = value as { name?: unknown; label?: unknown; id?: unknown; tagNumber?: unknown };
      if (entity.name) return String(entity.name);
      if (entity.label) return String(entity.label);
      if (entity.tagNumber) return String(entity.tagNumber);
      if (entity.id) return String(entity.id);
    }
    return fallback;
  }

  function getEntityId(value: unknown) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object") {
      const entity = value as { id?: unknown };
      return entity.id ? String(entity.id) : "";
    }
    return "";
  }

  const columns: Column<Treatment>[] = [
    { key: "cattle", header: "Bovin", render: (item) => getEntityLabel(item.cattle, item.cattleId || "-") },
    { key: "medicament", header: "Médicament", render: (item) => getEntityLabel(item.medicamentObj, getEntityLabel(item.product)) },
    { key: "veterinarian", header: "Vétérinaire", render: (item) => getEntityLabel(item.veterinarianObj, getEntityLabel(item.veterinarian)) },
    { key: "date", header: "Date", render: (item) => new Date(item.date).toLocaleDateString("fr-FR") },
    { key: "dosage", header: "Dosage", render: (item) => formatDosage(item.dosage) },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Traitements</h1>
          <p className="text-muted-foreground mt-2">Historique des traitements</p>
        </div>
        <Button onClick={() => navigate("/admin/treatments/new")}>Créer</Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => navigate(`/admin/treatments/${item.id}/edit`)}
        onView={(item) => navigate(`/admin/treatments/${item.id}`)}
        canEdit canView
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />
    </div>
  );
};

export default TreatmentsListPage;
