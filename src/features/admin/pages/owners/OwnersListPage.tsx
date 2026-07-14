import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ownersService, Owner } from "@/features/admin/services/ownersService";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteOwner } from "../../hooks/ownersHooks";
import { queryKeys } from "@/lib/queryKeys";

const OwnersListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<Owner | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteOwnerMutation = useDeleteOwner();

  const { data: data, isLoading } = useQuery({
    queryKey: queryKeys.owners.list({ page, q: search }),
    queryFn: () =>
      ownersService.getOwnersList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const handleCreate = () => {
    navigate('/admin/owners/new');
  };

  const handleEdit = (item: Owner) => {
    navigate(`/admin/owners/${item.id}/edit`);
  };

  const handleView = (item: Owner) => {
    navigate(`/admin/owners/${item.id}`);
  };

  const handleDeleteClick = (item: Owner) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      deleteOwnerMutation.mutate(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const columns: Column<Owner>[] = [
    { key: "name", header: "Nom" },
    { key: "email", header: "Email", render: (item) => item.email || "-" },
    { key: "phone", header: "Téléphone", render: (item) => item.phone || "-" },
    { key: "city", header: "Ville", render: (item) => item.city || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Propriétaires</h1>
          <p className="text-muted-foreground mt-2">Gestion des propriétaires</p>
        </div>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDeleteClick}
        onAdd={handleCreate}
        canEdit canDelete canView canAdd
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />

      <ConfirmDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        title="Supprimer le propriétaire" 
        description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.name}" ?`} 
        onConfirm={handleDeleteConfirm} 
        confirmText="Supprimer" 
        cancelText="Annuler" 
        variant="destructive" 
        loading={deleteOwnerMutation.isPending} 
      />
    </div>
  );
};

export default OwnersListPage;
