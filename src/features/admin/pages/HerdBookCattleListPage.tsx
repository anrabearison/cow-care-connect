import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { herdBookCattleService, HerdBookCattle, CreateHerdBookCattleData, UpdateHerdBookCattleData, CattleData, CattleSourceData } from "@/features/admin/services/herdBookCattleService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const HerdBookCattleListPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<HerdBookCattle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateHerdBookCattleData>({ herdBookId: "", cattleId: "", nCarnet: "", categoryId: "", statusId: "STA001" });

  const { data: data, isLoading } = useQuery({
    queryKey: ["admin-herd-book-cattle", page, search],
    queryFn: () =>
      herdBookCattleService.getHerdBookCattleList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateHerdBookCattleData) => herdBookCattleService.createHerdBookCattle(data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Inscription créée avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-book-cattle"] });
      setIsCreateDialogOpen(false);
      setFormData({ herdBookId: "", cattleId: "", nCarnet: "", categoryId: "", statusId: "STA001" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHerdBookCattleData }) =>
      herdBookCattleService.updateHerdBookCattle(id, data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Inscription mise à jour avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-book-cattle"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => herdBookCattleService.deleteHerdBookCattle(id),
    onSuccess: () => {
      toast({ title: "Succès", description: "Inscription supprimée avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-book-cattle"] });
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    },
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: formData });
    }
  };

  const openEditDialog = (item: HerdBookCattle) => {
    setSelectedItem(item);
    setFormData({ herdBookId: item.herdBookId, cattleId: item.cattleId || "", nCarnet: item.nCarnet || "", categoryId: item.categoryId, statusId: item.statusId });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({ herdBookId: "", cattleId: "", nCarnet: "", categoryId: "", statusId: "STA001" });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<HerdBookCattle>[] = [
    { key: "id", header: "ID", render: (item) => <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span> },
    { key: "herdBook", header: "Livre de troupeau", render: (item) => {
      if (!item.herdBook) return "-";
      if (typeof item.herdBook === 'string') return item.herdBook;
      if (item.herdBook.name) return String(item.herdBook.name);
      return "-";
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
    <div className="space-y-6">
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
        onEdit={openEditDialog}
        onView={(item) => { setSelectedItem(item); setIsViewDialogOpen(true); }}
        onDelete={(item) => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
        onAdd={openCreateDialog}
        canEdit canDelete canView canAdd
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails de l'inscription" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Livre de troupeau</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.herdBook) return "-";
                if (typeof selectedItem.herdBook === 'string') return selectedItem.herdBook;
                if (selectedItem.herdBook.name) return selectedItem.herdBook.name;
                return "-";
              })()}</p></div>
              <div><Label>Bovin</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.cattle) return "-";
                if (typeof selectedItem.cattle === 'string') return selectedItem.cattle;
                if (selectedItem.cattle.name) return selectedItem.cattle.name;
                return "-";
              })()}</p></div>
              <div><Label>N° Carnet</Label><p className="text-sm font-medium">{selectedItem.nCarnet || "-"}</p></div>
              <div><Label>Catégorie</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.category) return "-";
                if (typeof selectedItem.category === 'string') return selectedItem.category;
                if (selectedItem.category.name) return selectedItem.category.name;
                return "-";
              })()}</p></div>
              <div><Label>Statut</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.status) return "-";
                if (typeof selectedItem.status === 'string') return selectedItem.status;
                if (selectedItem.status.name) return selectedItem.status.name;
                return "-";
              })()}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer une inscription" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>ID Livre de troupeau *</Label>
            <Input value={formData.herdBookId} onChange={(e) => setFormData({ ...formData, herdBookId: e.target.value })} placeholder="ID du livre de troupeau" />
          </div>
          <div>
            <Label>ID Bovin (optionnel si création bovin imbriquée)</Label>
            <Input value={formData.cattleId} onChange={(e) => setFormData({ ...formData, cattleId: e.target.value })} placeholder="ID du bovin existant" />
          </div>
          <div>
            <Label>N° Carnet</Label>
            <Input value={formData.nCarnet} onChange={(e) => setFormData({ ...formData, nCarnet: e.target.value })} placeholder="Numéro de carnet" />
          </div>
          <div>
            <Label>ID Catégorie *</Label>
            <Input value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} placeholder="ID de la catégorie" />
          </div>
          <div>
            <Label>ID Statut</Label>
            <Input value={formData.statusId} onChange={(e) => setFormData({ ...formData, statusId: e.target.value })} placeholder="ID du statut" />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier l'inscription" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>ID Livre de troupeau *</Label>
            <Input value={formData.herdBookId} onChange={(e) => setFormData({ ...formData, herdBookId: e.target.value })} placeholder="ID du livre de troupeau" />
          </div>
          <div>
            <Label>ID Bovin (optionnel si création bovin imbriquée)</Label>
            <Input value={formData.cattleId} onChange={(e) => setFormData({ ...formData, cattleId: e.target.value })} placeholder="ID du bovin existant" />
          </div>
          <div>
            <Label>N° Carnet</Label>
            <Input value={formData.nCarnet} onChange={(e) => setFormData({ ...formData, nCarnet: e.target.value })} placeholder="Numéro de carnet" />
          </div>
          <div>
            <Label>ID Catégorie *</Label>
            <Input value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} placeholder="ID de la catégorie" />
          </div>
          <div>
            <Label>ID Statut</Label>
            <Input value={formData.statusId} onChange={(e) => setFormData({ ...formData, statusId: e.target.value })} placeholder="ID du statut" />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer l'inscription" description={`Êtes-vous sûr de vouloir supprimer cette inscription ?`} onConfirm={() => deleteMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteMutation.isPending} />
    </div>
  );
};

export default HerdBookCattleListPage;
