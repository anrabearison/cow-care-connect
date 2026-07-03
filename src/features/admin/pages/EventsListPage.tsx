import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { eventsService, Event, CreateEventData, UpdateEventData } from "@/features/admin/services/eventsService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EventsListPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({ cattleId: "", eventTypeId: "", type: "", date: "", description: "", details: "" });

  const { data: data, isLoading } = useQuery({
    queryKey: ["admin-events", page, search],
    queryFn: () =>
      eventsService.getEventsList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEventData) => eventsService.createEvent(data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Événement créé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setIsCreateDialogOpen(false);
      setFormData({ cattleId: "", eventTypeId: "", type: "", date: "", description: "", details: "" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      eventsService.updateEvent(id, data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Événement mis à jour avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsService.deleteEvent(id),
    onSuccess: () => {
      toast({ title: "Succès", description: "Événement supprimé avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
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

  const openEditDialog = (item: Event) => {
    setSelectedItem(item);
    setFormData({ cattleId: item.cattleId, eventTypeId: item.eventTypeId || "", type: item.type || "", date: item.date, description: item.description || "", details: item.details || "" });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({ cattleId: "", eventTypeId: "", type: "", date: "", description: "", details: "" });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<Event>[] = [
    { key: "id", header: "ID", render: (item) => <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span> },
    { key: "cattle", header: "Bovin", render: (item) => {
      if (!item.cattle) return "-";
      if (typeof item.cattle === 'string') return item.cattle;
      if (item.cattle.name) return String(item.cattle.name);
      return "-";
    }},
    { key: "eventType", header: "Type", render: (item) => {
      if (!item.eventType) return "-";
      if (typeof item.eventType === 'string') return item.eventType;
      if (item.eventType.name) return String(item.eventType.name);
      return "-";
    }},
    { key: "date", header: "Date", render: (item) => new Date(item.date).toLocaleDateString("fr-FR") },
    { key: "description", header: "Description", render: (item) => item.description?.slice(0, 50) + (item.description?.length > 50 ? "..." : "") || "-" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Événements</h1>
          <p className="text-muted-foreground mt-2">Historique des événements</p>
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

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails de l'événement" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Bovin</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.cattle) return "-";
                if (typeof selectedItem.cattle === 'string') return selectedItem.cattle;
                if (selectedItem.cattle.name) return selectedItem.cattle.name;
                return "-";
              })()}</p></div>
              <div><Label>Type</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.eventType) return "-";
                if (typeof selectedItem.eventType === 'string') return selectedItem.eventType;
                if (selectedItem.eventType.name) return selectedItem.eventType.name;
                return "-";
              })()}</p></div>
              <div><Label>Date</Label><p className="text-sm font-medium">{new Date(selectedItem.date).toLocaleDateString("fr-FR")}</p></div>
              <div><Label>Description</Label><p className="text-sm font-medium">{selectedItem.description || "-"}</p></div>
              <div><Label>Détails</Label><p className="text-sm font-medium">{selectedItem.details || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un événement" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>ID Bovin *</Label>
            <Input value={formData.cattleId} onChange={(e) => setFormData({ ...formData, cattleId: e.target.value })} placeholder="ID du bovin" />
          </div>
          <div>
            <Label>ID Type d'événement</Label>
            <Input value={formData.eventTypeId} onChange={(e) => setFormData({ ...formData, eventTypeId: e.target.value })} placeholder="ID du type d'événement" />
          </div>
          <div>
            <Label>Type</Label>
            <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Type d'événement" />
          </div>
          <div>
            <Label>Date *</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows={3} />
          </div>
          <div>
            <Label>Détails</Label>
            <Textarea value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} placeholder="Détails" rows={3} />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier l'événement" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>ID Bovin *</Label>
            <Input value={formData.cattleId} onChange={(e) => setFormData({ ...formData, cattleId: e.target.value })} placeholder="ID du bovin" />
          </div>
          <div>
            <Label>ID Type d'événement</Label>
            <Input value={formData.eventTypeId} onChange={(e) => setFormData({ ...formData, eventTypeId: e.target.value })} placeholder="ID du type d'événement" />
          </div>
          <div>
            <Label>Type</Label>
            <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Type d'événement" />
          </div>
          <div>
            <Label>Date *</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows={3} />
          </div>
          <div>
            <Label>Détails</Label>
            <Textarea value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} placeholder="Détails" rows={3} />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer l'événement" description={`Êtes-vous sûr de vouloir supprimer cet événement ?`} onConfirm={() => deleteMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteMutation.isPending} />
    </div>
  );
};

export default EventsListPage;
