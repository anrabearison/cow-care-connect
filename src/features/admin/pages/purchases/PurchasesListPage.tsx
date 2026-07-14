import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { purchasesService, Purchase } from "@/features/admin/services/purchasesService";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useDeletePurchase } from "../../hooks/purchasesHooks";
import { queryKeys } from "@/lib/queryKeys";

const PurchasesListPage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<Purchase | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deletePurchaseMutation = useDeletePurchase({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Achat supprimé avec succès" });
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Erreur lors de la suppression";
      uiToast({ title: "Erreur", description: msg, variant: "destructive" });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.purchases.list({ page }),
    queryFn: () => purchasesService.getPurchasesList({ page, per_page: pageSize }),
  });

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      deletePurchaseMutation.mutate(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const columns: Column<Purchase>[] = [
    {
      key: "purchaseDate", header: "Date d'achat",
      render: (item) => new Date(item.purchaseDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "supplier", header: "Fournisseur",
      render: (item) => item.supplier?.name || <span className="text-muted-foreground">-</span>,
    },
    {
      key: "items", header: "Animaux",
      render: (item) => <Badge variant="secondary">{item.items?.length ?? 0} bovin(s)</Badge>,
    },
    {
      key: "totalAmount", header: "Montant total",
      render: (item) => <span className="font-semibold">{Number(item.totalAmount).toLocaleString("fr-FR")} Ar</span>,
    },
    { key: "invoiceNumber", header: "N° Facture", render: (item) => item.invoiceNumber || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Achats de bétail
          </h1>
          <p className="text-muted-foreground mt-2">Historique et gestion des achats</p>
        </div>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onView={(item) => navigate(`/admin/purchases/${item.id}`)}
        onEdit={(item) => navigate(`/admin/purchases/${item.id}/edit`)}
        onDelete={(item) => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
        onAdd={() => navigate('/admin/purchases/new')}
        canView canEdit canDelete canAdd
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer l'achat"
        description={`Êtes-vous sûr de vouloir supprimer cet achat du ${selectedItem ? new Date(selectedItem.purchaseDate).toLocaleDateString("fr-FR") : ""} ?`}
        onConfirm={handleDeleteConfirm}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deletePurchaseMutation.isPending}
      />
    </div>
  );
};

export default PurchasesListPage;
