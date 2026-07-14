import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { herdBookCattleService, HerdBookCattle } from "@/features/admin/services/herdBookCattleService";
import { useDeleteHerdBookCattle } from "../hooks/herdBookCattleHooks";
import { queryKeys } from "@/lib/queryKeys";

const HerdBookCattleListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<HerdBookCattle | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const deleteHerdBookCattleMutation = useDeleteHerdBookCattle();

  const { data: data, isLoading } = useQuery({
    queryKey: queryKeys.herdBookCattle.list({ page, q: search }),
    queryFn: () =>
      herdBookCattleService.getHerdBookCattleList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const handleDelete = () => {
    if (selectedItem) {
      deleteHerdBookCattleMutation.mutate(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const columns: Column<HerdBookCattle>[] = [
    { key: "herdBook", header: "Livre de troupeau", render: (item) => {
      if (!item.herdBook) return "-";
      if (typeof item.herdBook === 'string') return item.herdBook;
      const hb = item.herdBook as { name?: string; reference?: string; year?: number };
      const name = hb.name || hb.reference || '-';
      const year = hb.year ? ` (${hb.year})` : '';
      return `${name}${year}`;
    }},
    { key: "cattle", header: "Bovin", render: (item) => {
      if (!item.cattle) return "-";
      if (typeof item.cattle === 'string') return item.cattle;
      if (item.cattle.name) return String(item.cattle.name);
      return "-";
    }},
    { key: "category", header: "Catégorie", render: (item) => {
      if (!item.category) return "-";
      if (typeof item.category === 'string') return item.category;
      if (item.category.name) return String(item.category.name);
      return "-";
    }},
    { key: "status", header: "Statut", render: (item) => {
      if (!item.status) return "-";
      if (typeof item.status === 'string') return item.status;
      if (item.status.name) return String(item.status.name);
      return "-";
    }},
    { key: "nCarnet", header: "N° Carnet", render: (item) => item.nCarnet || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Inscriptions bovins</h1>
          <p className="text-muted-foreground mt-2">Gestion des inscriptions bovins</p>
        </div>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => navigate(`/admin/herd-book-cattle/${item.id}/edit`)}
        onView={(item) => navigate(`/admin/herd-book-cattle/${item.id}`)}
        onDelete={(item) => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
        onAdd={() => navigate('/admin/herd-book-cattle/new')}
        canEdit canDelete canView canAdd
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />

      <ConfirmDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        title="Supprimer l'inscription" 
        description={`Êtes-vous sûr de vouloir supprimer cette inscription ?`} 
        onConfirm={handleDelete} 
        confirmText="Supprimer" 
        cancelText="Annuler" 
        variant="destructive" 
        loading={deleteHerdBookCattleMutation.isPending} 
      />
    </div>
  );
};

export default HerdBookCattleListPage;
