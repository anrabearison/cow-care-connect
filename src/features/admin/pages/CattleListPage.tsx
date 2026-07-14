import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { cattleService } from "@/features/cattle/services";
import { Cattle } from "@/features/cattle/types";
import { Badge } from "@/components/ui/badge";
import { queryKeys } from "@/lib/queryKeys";

const CattleListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: cattleData, isLoading } = useQuery({
    queryKey: queryKeys.cattle.list({ page, q: search }),
    queryFn: () =>
      cattleService.getCattleList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const columns: Column<Cattle>[] = [
    {
      key: "name",
      header: "Nom",
    },
    {
      key: "tagNumber",
      header: "Numéro de tag",
    },
    {
      key: "gender",
      header: "Sexe",
      render: (item) => (
        <Badge variant={item.gender === "M" ? "default" : "secondary"}>
          {item.gender === "M" ? "Mâle" : "Femelle"}
        </Badge>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      render: (item) => {
        if (!item.category) return "-";
        if (typeof item.category === 'string') return item.category;
        if (item.category.name) return String(item.category.name);
        return "-";
      },
    },
    {
      key: "birthDate",
      header: "Date de naissance",
      render: (item) =>
        item.birthDate ? new Date(item.birthDate).toLocaleDateString("fr-FR") : "-",
    },
    {
      key: "status",
      header: "Statut",
      render: (item) => {
        const statusValue = typeof item.status === 'string' ? item.status : (item.status?.name || "-");
        const statusStr = String(statusValue);
        return (
          <Badge
            variant={
              statusStr === "ACTIVE"
                ? "default"
                : statusStr === "SOLD"
                ? "secondary"
                : "destructive"
            }
          >
            {statusStr}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Bovins</h1>
          <p className="text-muted-foreground mt-2">Gestion du troupeau</p>
        </div>
      </div>

      <DataTable
        data={cattleData?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => navigate(`/admin/cattle/${item.id}/edit`)}
        onView={(item) => navigate(`/admin/cattle/${item.id}`)}
        onAdd={() => navigate('/admin/cattle/new')}
        canEdit={true}
        canDelete={false}
        canView={true}
        canAdd={true}
        pagination={{
          page,
          pageSize,
          total: cattleData?.total || 0,
          onPageChange: setPage,
        }}
        search={{
          value: search,
          onChange: setSearch,
        }}
      />
    </div>
  );
};

export default CattleListPage;
