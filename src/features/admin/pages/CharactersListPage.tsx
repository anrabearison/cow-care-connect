import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { charactersService, Character, CreateCharacterData, UpdateCharacterData } from "@/features/admin/services/charactersService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const CharactersListPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<Character | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCharacterData>({ name: "", description: "" });

  const { data: data, isLoading } = useQuery({
    queryKey: ["admin-characters", page, search],
    queryFn: () =>
      charactersService.getCharactersList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCharacterData) => charactersService.createCharacter(data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Caractère créé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-characters"] });
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCharacterData }) =>
      charactersService.updateCharacter(id, data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Caractère mis à jour avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-characters"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => charactersService.deleteCharacter(id),
    onSuccess: () => {
      toast({ title: "Succès", description: "Caractère supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-characters"] });
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

  const openEditDialog = (item: Character) => {
    setSelectedItem(item);
    setFormData({ name: item.name, description: item.description || "" });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({ name: "", description: "" });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<Character>[] = [
    { key: "id", header: "ID", render: (item) => <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span> },
    { key: "name", header: "Nom" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Caractères</h1>
          <p className="text-muted-foreground mt-2">Gestion des caractères</p>
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

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails du caractère" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nom</Label><p className="text-sm font-medium">{selectedItem.name}</p></div>
              <div><Label>Description</Label><p className="text-sm font-medium">{selectedItem.description || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un caractère" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Nom *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du caractère" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du caractère" rows={3} />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le caractère" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Nom *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du caractère" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du caractère" rows={3} />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer le caractère" description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.name}" ?`} onConfirm={() => deleteMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteMutation.isPending} />
    </div>
  );
};

export default CharactersListPage;
