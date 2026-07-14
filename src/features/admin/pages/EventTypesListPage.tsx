import { useState } from "react";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EventType, CreateEventTypeData, UpdateEventTypeData } from "@/features/admin/services/eventTypesService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useEventTypes, useCreateEventType, useUpdateEventType, useDeleteEventType } from "../hooks/eventTypesHooks";

const EventTypesListPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<EventType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateEventTypeData>({ name: "", description: "", icon: "" });

  const createEventTypeMutation = useCreateEventType();
  const updateEventTypeMutation = useUpdateEventType();
  const deleteEventTypeMutation = useDeleteEventType();

  const { data, isLoading } = useEventTypes({ page, q: search });

  const handleCreate = () => {
    createEventTypeMutation.mutate(formData);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", description: "", icon: "" });
  };

  const handleUpdate = () => {
    if (selectedItem) {
      updateEventTypeMutation.mutate({ id: selectedItem.id, data: formData });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteEventTypeMutation.mutate(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const openEditDialog = (item: EventType) => {
    setSelectedItem(item);
    setFormData({ name: item.name, description: item.description || "", icon: item.icon || "" });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({ name: "", description: "", icon: "" });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<EventType>[] = [
    { key: "name", header: "Nom" },
    { key: "icon", header: "Icône", render: (item) => item.icon || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Types d'événements</h1>
          <p className="text-muted-foreground mt-2">Gestion des types d'événements</p>
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
        pagination={{ page, pageSize: 10, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails du type d'événement" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>ID</Label><p className="text-sm font-medium font-mono">{selectedItem.id}</p></div>
              <div><Label>Nom</Label><p className="text-sm font-medium">{selectedItem.name}</p></div>
              <div><Label>Icône</Label><p className="text-sm font-medium">{selectedItem.icon || "-"}</p></div>
              <div><Label>Description</Label><p className="text-sm font-medium">{selectedItem.description || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un type d'événement" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createEventTypeMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Nom *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du type d'événement" />
          </div>
          <div>
            <Label>Icône</Label>
            <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Icône" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du type d'événement" rows={3} />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le type d'événement" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateEventTypeMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Nom *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du type d'événement" />
          </div>
          <div>
            <Label>Icône</Label>
            <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Icône" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du type d'événement" rows={3} />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer le type d'événement" description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.name}" ?`} onConfirm={() => deleteEventTypeMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteEventTypeMutation.isPending} />
    </div>
  );
};

export default EventTypesListPage;
