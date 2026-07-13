import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { herdBooksService, HerdBook, CreateHerdBookData, UpdateHerdBookData } from "@/features/admin/services/herdBooksService";
import { ownersService, Owner } from "@/features/admin/services/ownersService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useCreateHerdBook, useUpdateHerdBook, useDeleteHerdBook } from "../hooks/herdBooksHooks";

const HerdBooksListPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<HerdBook | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [formData, setFormData] = useState<CreateHerdBookData>({ reference: "", year: new Date().getFullYear(), description: "", ownerId: "" });

  const createHerdBookMutation = useCreateHerdBook();
  const updateHerdBookMutation = useUpdateHerdBook();
  const deleteHerdBookMutation = useDeleteHerdBook();

  const { data: data, isLoading } = useQuery({
    queryKey: queryKeys.herdBooks.list({ page, q: search }),
    queryFn: () =>
      herdBooksService.getHerdBooksList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const response = await ownersService.getOwnersList({ page: 1, per_page: 50 });
        if (response.success) {
          setOwners(response.data || []);
        }
      } catch (error) {
        console.error("Error loading owners", error);
      }
    };

    loadOwners();
  }, []);

  const handleCreate = () => {
    if (!formData.reference?.trim()) {
      toast({ title: "Erreur", description: "Veuillez saisir une référence", variant: "destructive" });
      return;
    }

    if (!formData.year || Number.isNaN(Number(formData.year))) {
      toast({ title: "Erreur", description: "Veuillez saisir une année valide", variant: "destructive" });
      return;
    }

    if (!formData.ownerId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un propriétaire", variant: "destructive" });
      return;
    }

    createHerdBookMutation.mutate(formData);
    setIsCreateDialogOpen(false);
    setFormData({ reference: "", year: new Date().getFullYear(), description: "", ownerId: "" });
  };

  const handleUpdate = () => {
    if (selectedItem) {
      updateHerdBookMutation.mutate({ id: selectedItem.id, data: formData });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteHerdBookMutation.mutate(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
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
              <div><Label>ID</Label><p className="text-sm font-medium font-mono">{selectedItem.id}</p></div>
              <div><Label>Référence</Label><p className="text-sm font-medium">{selectedItem.reference}</p></div>
              <div><Label>Année</Label><p className="text-sm font-medium">{selectedItem.year}</p></div>
              <div><Label>Propriétaire</Label><p className="text-sm font-medium">{selectedItem.owner?.name || "-"}</p></div>
              <div><Label>Description</Label><p className="text-sm font-medium">{selectedItem.description || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un livre de troupeau" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createHerdBookMutation.isPending}>
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
            <Label>Propriétaire</Label>
            <Select value={formData.ownerId} onValueChange={(value) => setFormData({ ...formData, ownerId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un propriétaire" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le livre de troupeau" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateHerdBookMutation.isPending}>
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
            <Label>Propriétaire</Label>
            <Select value={formData.ownerId} onValueChange={(value) => setFormData({ ...formData, ownerId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un propriétaire" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer le livre de troupeau" description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.reference}" ?`} onConfirm={() => deleteHerdBookMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteHerdBookMutation.isPending} />
    </div>
  );
};

export default HerdBooksListPage;
