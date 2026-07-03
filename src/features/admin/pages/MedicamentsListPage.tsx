import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { medicamentsService, Medicament, CreateMedicamentData, UpdateMedicamentData } from "@/features/admin/services/medicamentsService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const MedicamentsListPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<Medicament | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateMedicamentData>({ id: "", name: "", type: "", dosageQuantite: undefined, dosageUnite: "", dosagePoids: undefined, dosageUnitePoids: "", dosageNotes: "", defaultRoute: "", withdrawalPeriodMeat: undefined, withdrawalPeriodMilk: undefined, dosageRecommandeOld: "", fabricant: "", notes: "" });

  const { data: data, isLoading } = useQuery({
    queryKey: ["admin-medicaments", page, search],
    queryFn: () =>
      medicamentsService.getMedicamentsList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateMedicamentData) => medicamentsService.createMedicament(data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Médicament créé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-medicaments"] });
      setIsCreateDialogOpen(false);
      setFormData({ id: "", name: "", type: "", dosageQuantite: undefined, dosageUnite: "", dosagePoids: undefined, dosageUnitePoids: "", dosageNotes: "", defaultRoute: "", withdrawalPeriodMeat: undefined, withdrawalPeriodMilk: undefined, dosageRecommandeOld: "", fabricant: "", notes: "" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicamentData }) =>
      medicamentsService.updateMedicament(id, data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Médicament mis à jour avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-medicaments"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => medicamentsService.deleteMedicament(id),
    onSuccess: () => {
      toast({ title: "Succès", description: "Médicament supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-medicaments"] });
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

  const openEditDialog = (item: Medicament) => {
    setSelectedItem(item);
    setFormData({ id: item.id, name: item.name, type: item.type, dosageQuantite: item.dosageQuantite, dosageUnite: item.dosageUnite || "", dosagePoids: item.dosagePoids, dosageUnitePoids: item.dosageUnitePoids || "", dosageNotes: item.dosageNotes || "", defaultRoute: item.defaultRoute || "", withdrawalPeriodMeat: item.withdrawalPeriodMeat, withdrawalPeriodMilk: item.withdrawalPeriodMilk, dosageRecommandeOld: item.dosageRecommandeOld || "", fabricant: item.fabricant || "", notes: item.notes || "" });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({ id: "", name: "", type: "", dosageQuantite: undefined, dosageUnite: "", dosagePoids: undefined, dosageUnitePoids: "", dosageNotes: "", defaultRoute: "", withdrawalPeriodMeat: undefined, withdrawalPeriodMilk: undefined, dosageRecommandeOld: "", fabricant: "", notes: "" });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<Medicament>[] = [
    { key: "id", header: "ID", render: (item) => <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span> },
    { key: "name", header: "Nom" },
    { key: "type", header: "Type" },
    { key: "fabricant", header: "Fabricant", render: (item) => item.fabricant || "-" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Médicaments</h1>
          <p className="text-muted-foreground mt-2">Gestion des médicaments</p>
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

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails du médicament" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nom</Label><p className="text-sm font-medium">{selectedItem.name}</p></div>
              <div><Label>Type</Label><p className="text-sm font-medium">{selectedItem.type}</p></div>
              <div><Label>Fabricant</Label><p className="text-sm font-medium">{selectedItem.fabricant || "-"}</p></div>
              <div><Label>Notes</Label><p className="text-sm font-medium">{selectedItem.notes || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un médicament" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>ID *</Label>
            <Input value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="ID du médicament" />
          </div>
          <div>
            <Label>Nom *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du médicament" />
          </div>
          <div>
            <Label>Type *</Label>
            <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Type de médicament" />
          </div>
          <div>
            <Label>Fabricant</Label>
            <Input value={formData.fabricant} onChange={(e) => setFormData({ ...formData, fabricant: e.target.value })} placeholder="Fabricant" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes" rows={3} />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le médicament" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Nom *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du médicament" />
          </div>
          <div>
            <Label>Type *</Label>
            <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Type de médicament" />
          </div>
          <div>
            <Label>Fabricant</Label>
            <Input value={formData.fabricant} onChange={(e) => setFormData({ ...formData, fabricant: e.target.value })} placeholder="Fabricant" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes" rows={3} />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer le médicament" description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.name}" ?`} onConfirm={() => deleteMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteMutation.isPending} />
    </div>
  );
};

export default MedicamentsListPage;
