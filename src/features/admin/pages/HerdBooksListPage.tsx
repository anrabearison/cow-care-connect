import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { herdBooksService, HerdBook, CreateHerdBookData, UpdateHerdBookData } from "@/features/admin/services/herdBooksService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const HerdBooksListPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<HerdBook | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateHerdBookData>({ reference: "", year: new Date().getFullYear(), description: "", ownerId: "" });

  const { data: data, isLoading } = useQuery({
    queryKey: ["admin-herd-books", page, search],
    queryFn: () =>
      herdBooksService.getHerdBooksList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateHerdBookData) => herdBooksService.createHerdBook(data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Livre de troupeau créé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-books"] });
      setIsCreateDialogOpen(false);
      setFormData({ reference: "", year: new Date().getFullYear(), description: "", ownerId: "" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHerdBookData }) =>
      herdBooksService.updateHerdBook(id, data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Livre de troupeau mis à jour avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-books"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => herdBooksService.deleteHerdBook(id),
    onSuccess: () => {
      toast({ title: "Succès", description: "Livre de troupeau supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-books"] });
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

  const openEditDialog = (item: HerdBook) => {
    setSelectedItem(item);
    setFormData({ reference: item.reference, year: item.year, description: item.description || "", ownerId: item.ownerId || "" });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({ reference: "", year: new Date().getFullYear(), description: "", ownerId: "" });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<HerdBook>[] = [
    { key: "id", header: "ID", render: (item) => <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span> },
    { key: "reference", header: "Référence" },
    { key: "year", header: "Année" },
    { key: "owner", header: "Propriétaire", render: (item) => {
      if (!item.owner) return "-";
      if (typeof item.owner === 'string') return item.owner;
      if (item.owner.name) return String(item.owner.name);
      return "-";
    }},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Livres de troupeau</h1>
          <p className="text-muted-foreground mt-2">Gestion des livres de troupeau</p>
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

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails du livre de troupeau" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Référence</Label><p className="text-sm font-medium">{selectedItem.reference}</p></div>
              <div><Label>Année</Label><p className="text-sm font-medium">{selectedItem.year}</p></div>
              <div><Label>Propriétaire</Label><p className="text-sm font-medium">{selectedItem.owner?.name || "-"}</p></div>
              <div><Label>Description</Label><p className="text-sm font-medium">{selectedItem.description || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un livre de troupeau" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Référence *</Label>
            <Input value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} placeholder="Référence du livre de troupeau" />
          </div>
          <div>
            <Label>Année *</Label>
            <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} placeholder="Année" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du livre de troupeau" rows={3} />
          </div>
          <div>
            <Label>ID Propriétaire</Label>
            <Input value={formData.ownerId} onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })} placeholder="ID du propriétaire" />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le livre de troupeau" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Référence *</Label>
            <Input value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} placeholder="Référence du livre de troupeau" />
          </div>
          <div>
            <Label>Année *</Label>
            <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} placeholder="Année" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du livre de troupeau" rows={3} />
          </div>
          <div>
            <Label>ID Propriétaire</Label>
            <Input value={formData.ownerId} onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })} placeholder="ID du propriétaire" />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer le livre de troupeau" description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.reference}" ?`} onConfirm={() => deleteMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteMutation.isPending} />
    </div>
  );
};

export default HerdBooksListPage;
