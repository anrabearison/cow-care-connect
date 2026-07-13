import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { medicamentsService, Medicament, CreateMedicamentData, UpdateMedicamentData } from "@/features/admin/services/medicamentsService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMedicament, useUpdateMedicament, useDeleteMedicament } from "../hooks/medicamentsHooks";

const MedicamentsListPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<Medicament | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateMedicamentData>({ name: "", type: "", dosageQuantity: undefined, dosageUnit: "", dosageWeight: undefined, dosageWeightUnit: "", dosageNotes: "", defaultRoute: "", withdrawalPeriodMeat: undefined, withdrawalPeriodMilk: undefined, manufacturer: "", notes: "" });

  const createMedicamentMutation = useCreateMedicament();
  const updateMedicamentMutation = useUpdateMedicament();
  const deleteMedicamentMutation = useDeleteMedicament();

  const { data: data, isLoading } = useQuery({
    queryKey: queryKeys.medicaments.list({ page, q: search }),
    queryFn: () =>
      medicamentsService.getMedicamentsList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const handleCreate = () => {
    createMedicamentMutation.mutate(formData);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", type: "", dosageQuantity: undefined, dosageUnit: "", dosageWeight: undefined, dosageWeightUnit: "", dosageNotes: "", defaultRoute: "", withdrawalPeriodMeat: undefined, withdrawalPeriodMilk: undefined, manufacturer: "", notes: "" });
  };

  const handleUpdate = () => {
    if (selectedItem) {
      updateMedicamentMutation.mutate({ id: selectedItem.id, data: formData });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteMedicamentMutation.mutate(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const openEditDialog = (item: Medicament) => {
    setSelectedItem(item);
    setFormData({ name: item.name, type: item.type, dosageQuantity: item.dosageQuantity, dosageUnit: item.dosageUnit || "", dosageWeight: item.dosageWeight, dosageWeightUnit: item.dosageWeightUnit || "", dosageNotes: item.dosageNotes || "", defaultRoute: item.defaultRoute || "", withdrawalPeriodMeat: item.withdrawalPeriodMeat, withdrawalPeriodMilk: item.withdrawalPeriodMilk, manufacturer: item.manufacturer || "", notes: item.notes || "" });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({ name: "", type: "", dosageQuantity: undefined, dosageUnit: "", dosageWeight: undefined, dosageWeightUnit: "", dosageNotes: "", defaultRoute: "", withdrawalPeriodMeat: undefined, withdrawalPeriodMilk: undefined, manufacturer: "", notes: "" });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<Medicament>[] = [
    { key: "name", header: "Nom" },
    { key: "type", header: "Type" },
    { key: "manufacturer", header: "Fabricant", render: (item) => item.manufacturer || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Médicaments</h1>
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
              <div><Label>ID</Label><p className="text-sm font-medium font-mono">{selectedItem.id}</p></div>
              <div><Label>Nom</Label><p className="text-sm font-medium">{selectedItem.name}</p></div>
              <div><Label>Type</Label><p className="text-sm font-medium">{selectedItem.type}</p></div>
              <div><Label>Fabricant</Label><p className="text-sm font-medium">{selectedItem.manufacturer || "-"}</p></div>
              <div><Label>Notes</Label><p className="text-sm font-medium">{selectedItem.notes || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un médicament" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createMedicamentMutation.isPending}>
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
            <Input value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} placeholder="Fabricant" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes" rows={3} />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le médicament" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateMedicamentMutation.isPending}>
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
            <Input value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} placeholder="Fabricant" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes" rows={3} />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer le médicament" description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.name}" ?`} onConfirm={() => deleteMedicamentMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteMedicamentMutation.isPending} />
    </div>
  );
};

export default MedicamentsListPage;
