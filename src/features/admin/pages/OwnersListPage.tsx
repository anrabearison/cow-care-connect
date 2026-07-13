import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ownersService, Owner, CreateOwnerData, UpdateOwnerData } from "@/features/admin/services/ownersService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOwner, useUpdateOwner, useDeleteOwner } from "../hooks/ownersHooks";
import { queryKeys } from "@/lib/queryKeys";

const OwnersListPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<Owner | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateOwnerData>({ name: "", email: "", contactInfo: "", phone: "", address: "", city: "" });

  const createOwnerMutation = useCreateOwner();
  const updateOwnerMutation = useUpdateOwner();
  const deleteOwnerMutation = useDeleteOwner();

  const { data: data, isLoading } = useQuery({
    queryKey: queryKeys.owners.list({ page, q: search }),
    queryFn: () =>
      ownersService.getOwnersList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const handleCreate = () => {
    createOwnerMutation.mutate(formData);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", email: "", contactInfo: "", phone: "", address: "", city: "" });
  };

  const handleUpdate = () => {
    if (selectedItem) {
      updateOwnerMutation.mutate({ id: selectedItem.id, data: formData });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteOwnerMutation.mutate(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const openEditDialog = (item: Owner) => {
    setSelectedItem(item);
    setFormData({ name: item.name, email: item.email || "", contactInfo: item.contactInfo || "", phone: item.phone || "", address: item.address || "", city: item.city || "" });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    setFormData({ name: "", email: "", contactInfo: "", phone: "", address: "", city: "" });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<Owner>[] = [
    { key: "name", header: "Nom" },
    { key: "email", header: "Email", render: (item) => item.email || "-" },
    { key: "phone", header: "Téléphone", render: (item) => item.phone || "-" },
    { key: "city", header: "Ville", render: (item) => item.city || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Propriétaires</h1>
          <p className="text-muted-foreground mt-2">Gestion des propriétaires</p>
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

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails du propriétaire" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>ID</Label><p className="text-sm font-medium font-mono">{selectedItem.id}</p></div>
              <div><Label>Nom</Label><p className="text-sm font-medium">{selectedItem.name}</p></div>
              <div><Label>Email</Label><p className="text-sm font-medium">{selectedItem.email || "-"}</p></div>
              <div><Label>Téléphone</Label><p className="text-sm font-medium">{selectedItem.phone || "-"}</p></div>
              <div><Label>Contact Info</Label><p className="text-sm font-medium">{selectedItem.contactInfo || "-"}</p></div>
              <div><Label>Adresse</Label><p className="text-sm font-medium">{selectedItem.address || "-"}</p></div>
              <div><Label>Ville</Label><p className="text-sm font-medium">{selectedItem.city || "-"}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer un propriétaire" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createOwnerMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Nom *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du propriétaire" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
          </div>
          <div>
            <Label>Contact Info</Label>
            <Input value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} placeholder="Informations de contact" />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Téléphone" />
          </div>
          <div>
            <Label>Adresse</Label>
            <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Adresse" rows={3} />
          </div>
          <div>
            <Label>Ville</Label>
            <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Ville" />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le propriétaire" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateOwnerMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label>Nom *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du propriétaire" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
          </div>
          <div>
            <Label>Contact Info</Label>
            <Input value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} placeholder="Informations de contact" />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Téléphone" />
          </div>
          <div>
            <Label>Adresse</Label>
            <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Adresse" rows={3} />
          </div>
          <div>
            <Label>Ville</Label>
            <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Ville" />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer le propriétaire" description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.name}" ?`} onConfirm={() => deleteOwnerMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteOwnerMutation.isPending} />
    </div>
  );
};

export default OwnersListPage;
