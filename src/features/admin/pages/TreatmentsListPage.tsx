import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { treatmentsService, Treatment, CreateTreatmentData, UpdateTreatmentData, TreatmentDosageData } from "@/features/admin/services/treatmentsService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const TreatmentsListPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<Treatment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTreatmentData>({
    cattleId: "",
    type: "",
    date: "",
    product: "",
    dosage: {
      quantity: 0,
      unit: "",
      animalWeight: undefined,
      notes: ""
    },
    administrationRoute: "",
    veterinarian: "",
    notes: ""
  });

  const { data: data, isLoading } = useQuery({
    queryKey: ["admin-treatments", page, search],
    queryFn: () =>
      treatmentsService.getTreatmentsList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTreatmentData) => treatmentsService.createTreatment(data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Traitement créé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-treatments"] });
      setIsCreateDialogOpen(false);
      setFormData({
        cattleId: "",
        type: "",
        date: "",
        product: "",
        dosage: {
          quantity: 0,
          unit: "",
          animalWeight: undefined,
          notes: ""
        },
        administrationRoute: "",
        veterinarian: "",
        notes: ""
      });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTreatmentData }) =>
      treatmentsService.updateTreatment(id, data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Traitement mis à jour avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-treatments"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => treatmentsService.deleteTreatment(id),
    onSuccess: () => {
      toast({ title: "Succès", description: "Traitement supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-treatments"] });
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

  const openEditDialog = (item: Treatment) => {
    setSelectedItem(item);
    setFormData({
      cattleId: getEntityId(item.cattle) || item.cattleId,
      type: getEntityId(item.type),
      date: item.date,
      product: getEntityId(item.medicamentObj) || getEntityId(item.product),
      dosage: {
        quantity: item.dosage.quantity,
        unit: item.dosage.unit,
        animalWeight: item.dosage.animalWeight,
        notes: item.dosage.notes || ""
      },
      administrationRoute: item.administrationRoute || "",
      veterinarian: getEntityId(item.veterinarianObj) || getEntityId(item.veterinarian),
      notes: item.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({
      cattleId: "",
      type: "",
      date: "",
      product: "",
      dosage: {
        quantity: 0,
        unit: "",
        animalWeight: undefined,
        notes: ""
      },
      administrationRoute: "",
      veterinarian: "",
      notes: ""
    });
    setIsCreateDialogOpen(true);
  };

  const formatDosage = (dosage?: TreatmentDosageData) => {
    if (!dosage?.quantity || !dosage.unit) return "-";
    return `${dosage.quantity} ${dosage.unit}`;
  };

  function getEntityLabel(value: unknown, fallback = "-") {
    if (value === null || value === undefined || value === "") return fallback;
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object") {
      const entity = value as { name?: unknown; label?: unknown; id?: unknown; tagNumber?: unknown };
      if (entity.name) return String(entity.name);
      if (entity.label) return String(entity.label);
      if (entity.tagNumber) return String(entity.tagNumber);
      if (entity.id) return String(entity.id);
    }
    return fallback;
  }

  function getEntityId(value: unknown) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object") {
      const entity = value as { id?: unknown };
      return entity.id ? String(entity.id) : "";
    }
    return "";
  }

  const columns: Column<Treatment>[] = [
    { key: "id", header: "ID", render: (item) => <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span> },
    { key: "cattle", header: "Bovin", render: (item) => getEntityLabel(item.cattle, item.cattleId || "-") },
    { key: "medicament", header: "Médicament", render: (item) => getEntityLabel(item.medicamentObj, getEntityLabel(item.product)) },
    { key: "veterinarian", header: "Vétérinaire", render: (item) => getEntityLabel(item.veterinarianObj, getEntityLabel(item.veterinarian)) },
    { key: "date", header: "Date", render: (item) => new Date(item.date).toLocaleDateString("fr-FR") },
    { key: "dosage", header: "Dosage", render: (item) => formatDosage(item.dosage) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Traitements</h1>
          <p className="text-muted-foreground mt-2">Historique des traitements</p>
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

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails du traitement" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Bovin</Label><p className="text-sm font-medium">{getEntityLabel(selectedItem.cattle, selectedItem.cattleId || "-")}</p></div>
              <div><Label>Médicament</Label><p className="text-sm font-medium">{getEntityLabel(selectedItem.medicamentObj, getEntityLabel(selectedItem.product))}</p></div>
              <div><Label>Vétérinaire</Label><p className="text-sm font-medium">{getEntityLabel(selectedItem.veterinarianObj, getEntityLabel(selectedItem.veterinarian))}</p></div>
              <div><Label>Date</Label><p className="text-sm font-medium">{new Date(selectedItem.date).toLocaleDateString("fr-FR")}</p></div>
              <div><Label>Dosage</Label><p className="text-sm font-medium">{formatDosage(selectedItem.dosage)}</p></div>
              <div><Label>Notes</Label><p className="text-sm font-medium">{selectedItem.notes || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un traitement" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>ID Bovin *</Label>
            <Input value={formData.cattleId} onChange={(e) => setFormData({ ...formData, cattleId: e.target.value })} placeholder="ID du bovin" />
          </div>
          <div>
            <Label>Type *</Label>
            <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Type de traitement" />
          </div>
          <div>
            <Label>Date *</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div>
            <Label>Produit (ID Médicament) *</Label>
            <Input value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} placeholder="ID du médicament" />
          </div>
          <div>
            <Label>Quantité *</Label>
            <Input type="number" value={formData.dosage?.quantity || 0} onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage!, quantity: Number(e.target.value) } })} placeholder="Quantité" />
          </div>
          <div>
            <Label>Unité *</Label>
            <Input value={formData.dosage?.unit || ''} onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage!, unit: e.target.value } })} placeholder="Unité" />
          </div>
          <div>
            <Label>Poids animal</Label>
            <Input type="number" value={formData.dosage?.animalWeight || ""} onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage!, animalWeight: e.target.value ? Number(e.target.value) : undefined } })} placeholder="Poids de l'animal" />
          </div>
          <div>
            <Label>Notes dosage</Label>
            <Textarea value={formData.dosage?.notes || ''} onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage!, notes: e.target.value } })} placeholder="Notes sur le dosage" rows={2} />
          </div>
          <div>
            <Label>Route d'administration</Label>
            <Input value={formData.administrationRoute} onChange={(e) => setFormData({ ...formData, administrationRoute: e.target.value })} placeholder="Route d'administration" />
          </div>
          <div>
            <Label>Vétérinaire (ID) *</Label>
            <Input value={formData.veterinarian} onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })} placeholder="ID du vétérinaire" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes" rows={3} />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le traitement" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>ID Bovin *</Label>
            <Input value={formData.cattleId} onChange={(e) => setFormData({ ...formData, cattleId: e.target.value })} placeholder="ID du bovin" />
          </div>
          <div>
            <Label>Type *</Label>
            <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Type de traitement" />
          </div>
          <div>
            <Label>Date *</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div>
            <Label>Produit (ID Médicament) *</Label>
            <Input value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} placeholder="ID du médicament" />
          </div>
          <div>
            <Label>Quantité *</Label>
            <Input type="number" value={formData.dosage?.quantity || 0} onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage!, quantity: Number(e.target.value) } })} placeholder="Quantité" />
          </div>
          <div>
            <Label>Unité *</Label>
            <Input value={formData.dosage?.unit || ""} onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage!, unit: e.target.value } })} placeholder="Unité" />
          </div>
          <div>
            <Label>Poids animal</Label>
            <Input type="number" value={formData.dosage?.animalWeight || ""} onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage!, animalWeight: e.target.value ? Number(e.target.value) : undefined } })} placeholder="Poids de l'animal" />
          </div>
          <div>
            <Label>Notes dosage</Label>
            <Textarea value={formData.dosage?.notes || ""} onChange={(e) => setFormData({ ...formData, dosage: { ...formData.dosage!, notes: e.target.value } })} placeholder="Notes sur le dosage" rows={2} />
          </div>
          <div>
            <Label>Route d'administration</Label>
            <Input value={formData.administrationRoute} onChange={(e) => setFormData({ ...formData, administrationRoute: e.target.value })} placeholder="Route d'administration" />
          </div>
          <div>
            <Label>Vétérinaire (ID) *</Label>
            <Input value={formData.veterinarian} onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })} placeholder="ID du vétérinaire" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes" rows={3} />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer le traitement" description={`Êtes-vous sûr de vouloir supprimer ce traitement ?`} onConfirm={() => deleteMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteMutation.isPending} />
    </div>
  );
};

export default TreatmentsListPage;
