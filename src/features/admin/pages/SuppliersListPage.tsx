import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { purchasesService, Supplier, CreateSupplierData, UpdateSupplierData } from "@/features/admin/services/purchasesService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

const SuppliersListPage = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [selectedItem, setSelectedItem] = useState<Supplier | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [formData, setFormData] = useState<CreateSupplierData>({ name: "", contactInfo: "", phone: "", email: "", address: "" });

    const { data, isLoading } = useQuery({
        queryKey: ["admin-suppliers", page, search],
        queryFn: () => purchasesService.getSuppliersList({ q: search || undefined, page, per_page: pageSize }),
    });

    const createMutation = useMutation({
        mutationFn: (d: CreateSupplierData) => purchasesService.createSupplier(d),
        onSuccess: () => {
            toast({ title: "Succès", description: "Fournisseur créé avec succès" });
            queryClient.invalidateQueries({ queryKey: ["admin-suppliers"] });
            setIsCreateDialogOpen(false);
            resetForm();
        },
        onError: () => toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSupplierData }) => purchasesService.updateSupplier(id, data),
        onSuccess: () => {
            toast({ title: "Succès", description: "Fournisseur mis à jour avec succès" });
            queryClient.invalidateQueries({ queryKey: ["admin-suppliers"] });
            setIsEditDialogOpen(false);
            setSelectedItem(null);
        },
        onError: () => toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => purchasesService.deleteSupplier(id),
        onSuccess: () => {
            toast({ title: "Succès", description: "Fournisseur supprimé" });
            queryClient.invalidateQueries({ queryKey: ["admin-suppliers"] });
            setIsDeleteDialogOpen(false);
            setSelectedItem(null);
        },
        onError: () => toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" }),
    });

    const resetForm = () => setFormData({ name: "", contactInfo: "", phone: "", email: "", address: "" });

    const openEditDialog = (item: Supplier) => {
        setSelectedItem(item);
        setFormData({ name: item.name, contactInfo: item.contactInfo || "", phone: item.phone || "", email: item.email || "", address: item.address || "" });
        setIsEditDialogOpen(true);
    };

    const columns: Column<Supplier>[] = [
        { key: "name", header: "Nom" },
        { key: "phone", header: "Téléphone", render: (item) => item.phone || "-" },
        { key: "email", header: "Email", render: (item) => item.email || "-" },
        { key: "address", header: "Adresse", render: (item) => item.address || "-" },
    ];

    const SupplierForm = () => (
        <div className="space-y-4">
            <div>
                <Label>Nom *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du fournisseur" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Téléphone</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+261 34..." />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" />
                </div>
            </div>
            <div>
                <Label>Contact additionnel</Label>
                <Input value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} placeholder="Infos de contact" />
            </div>
            <div>
                <Label>Adresse</Label>
                <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Adresse complète" rows={2} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Building2 className="h-8 w-8 text-primary" />
                    Fournisseurs
                </h1>
                <p className="text-muted-foreground mt-2">Gestion des fournisseurs de bétail</p>
            </div>

            <DataTable
                data={data?.data || []}
                columns={columns}
                loading={isLoading}
                onView={(item) => { setSelectedItem(item); setIsViewDialogOpen(true); }}
                onEdit={openEditDialog}
                onDelete={(item) => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
                onAdd={() => { resetForm(); setIsCreateDialogOpen(true); }}
                canView canEdit canDelete canAdd
                pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
                search={{ value: search, onChange: setSearch }}
            />

            <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails du fournisseur" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
                {selectedItem && (
                    <div className="space-y-3 grid grid-cols-2 gap-4">
                        <div><Label>Nom</Label><p className="text-sm font-medium">{selectedItem.name}</p></div>
                        <div><Label>Téléphone</Label><p className="text-sm font-medium">{selectedItem.phone || "-"}</p></div>
                        <div><Label>Email</Label><p className="text-sm font-medium">{selectedItem.email || "-"}</p></div>
                        <div><Label>Contact</Label><p className="text-sm font-medium">{selectedItem.contactInfo || "-"}</p></div>
                        <div className="col-span-2"><Label>Adresse</Label><p className="text-sm font-medium">{selectedItem.address || "-"}</p></div>
                    </div>
                )}
            </FormDialog>

            <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Nouveau fournisseur" submitText="Créer" cancelText="Annuler" onSubmit={() => createMutation.mutate(formData)} loading={createMutation.isPending}>
                <SupplierForm />
            </FormDialog>

            <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier le fournisseur" submitText="Enregistrer" cancelText="Annuler" onSubmit={() => selectedItem && updateMutation.mutate({ id: selectedItem.id, data: formData })} loading={updateMutation.isPending}>
                <SupplierForm />
            </FormDialog>

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Supprimer le fournisseur"
                description={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.name}" ?`}
                onConfirm={() => deleteMutation.mutate(selectedItem!.id)}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="destructive"
                loading={deleteMutation.isPending}
            />
        </div>
    );
};

export default SuppliersListPage;
