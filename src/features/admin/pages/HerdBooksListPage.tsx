import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { herdBooksService, HerdBook } from "@/features/admin/services/herdBooksService";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteHerdBook } from "../hooks/herdBooksHooks";
import { queryKeys } from "@/lib/queryKeys";

const HerdBooksListPage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<HerdBook | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteHerdBookMutation = useDeleteHerdBook({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Livre de troupeau supprimé avec succès" });
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Erreur lors de la suppression";
      uiToast({ title: "Erreur", description: msg, variant: "destructive" });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.herdBooks.list({ page, q: search }),
    queryFn: () =>
      herdBooksService.getHerdBooksList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      deleteHerdBookMutation.mutate(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const columns: Column<HerdBook>[] = [
    { key: "reference", header: "Référence" },
    { key: "year", header: "Année" },
    {
      key: "owner", header: "Propriétaire", render: (item) => {
        if (!item.owner) return "-";
        if (typeof item.owner === 'string') return item.owner;
        if (item.owner.name) return String(item.owner.name);
        return "-";
      }
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Livres de troupeau</h1>
          <p className="text-muted-foreground mt-2">Gestion des livres de troupeau</p>
        </div>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => navigate(`/admin/herd-books/${item.id}/edit`)}
        onView={(item) => navigate(`/admin/herd-books/${item.id}`)}
        onDelete={(item) => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
        onAdd={() => navigate('/admin/herd-books/new')}
        canEdit canDelete canView canAdd
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le livre de troupeau"
        description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.reference}" ?`}
        onConfirm={handleDeleteConfirm}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteHerdBookMutation.isPending}
      />
    </div>
  );
};

export default HerdBooksListPage;
