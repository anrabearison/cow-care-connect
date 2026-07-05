import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { purchasesService, Purchase, Supplier, CreatePurchaseData } from "@/features/admin/services/purchasesService";
import { ownersService, Owner } from "@/features/admin/services/ownersService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptyItem = () => ({ cattleId: "", price: 0, weightAtPurchase: undefined as number | undefined, healthStatus: "" });

const PurchasesListPage = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [selectedItem, setSelectedItem] = useState<Purchase | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [owners, setOwners] = useState<Owner[]>([]);
    const [formData, setFormData] = useState<CreatePurchaseData>({
        ownerId: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        supplierId: "",
        invoiceNumber: "",
        healthStatus: "",
        notes: "",
        items: [emptyItem()],
    });

    const { data, isLoading } = useQuery({
        queryKey: ["admin-purchases", page],
        queryFn: () => purchasesService.getPurchasesList({ page, per_page: pageSize }),
    });

    const { data: suppliersData } = useQuery({
        queryKey: ["admin-suppliers-all", 1, 50],
        queryFn: () => purchasesService.getSuppliersList({ page: 1, per_page: 50 }),
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

    const createMutation = useMutation({
        mutationFn: (d: CreatePurchaseData) => purchasesService.createPurchase(d),
        onSuccess: () => {
            toast({ title: "Succès", description: "Achat créé avec succès" });
            queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
            setIsCreateDialogOpen(false);
            resetForm();
        },
        onError: () => toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => purchasesService.deletePurchase(id),
        onSuccess: () => {
            toast({ title: "Succès", description: "Achat supprimé" });
            queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
            setIsDeleteDialogOpen(false);
            setSelectedItem(null);
        },
        onError: () => toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" }),
    });

    const resetForm = () => setFormData({
        ownerId: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        supplierId: "",
        invoiceNumber: "",
        healthStatus: "",
        notes: "",
        items: [emptyItem()],
    });

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => setFormData({ ...formData, items: [...formData.items, emptyItem()] });
    const removeItem = (index: number) => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });

    const totalAmount = formData.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    const handleCreate = () => {
        if (!formData.ownerId) {
            toast({ title: "Erreur", description: "Veuillez sélectionner un propriétaire", variant: "destructive" });
            return;
        }

        createMutation.mutate(formData);
    };

    const columns: Column<Purchase>[] = [
        { key: "id", header: "ID", render: (item) => <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span> },
        {
            key: "purchaseDate", header: "Date d'achat",
            render: (item) => new Date(item.purchaseDate).toLocaleDateString("fr-FR"),
        },
        {
            key: "supplier", header: "Fournisseur",
            render: (item) => item.supplier?.name || <span className="text-muted-foreground">-</span>,
        },
        {
            key: "items", header: "Animaux",
            render: (item) => <Badge variant="secondary">{item.items?.length ?? 0} bovin(s)</Badge>,
        },
        {
            key: "totalAmount", header: "Montant total",
            render: (item) => <span className="font-semibold">{Number(item.totalAmount).toLocaleString("fr-FR")} Ar</span>,
        },
        { key: "invoiceNumber", header: "N° Facture", render: (item) => item.invoiceNumber || "-" },
    ];

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        Achats de bétail
                    </h1>
                    <p className="text-muted-foreground mt-2">Historique et gestion des achats</p>
                </div>
            </div>

            <DataTable
                data={data?.data || []}
                columns={columns}
                loading={isLoading}
                onView={(item) => { setSelectedItem(item); setIsViewDialogOpen(true); }}
                onDelete={(item) => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
                onAdd={() => { resetForm(); setIsCreateDialogOpen(true); }}
                canView canDelete canAdd
                pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
            />

            {/* View Dialog */}
            <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails de l'achat" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
                {selectedItem && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Date d'achat</Label><p className="text-sm font-medium">{new Date(selectedItem.purchaseDate).toLocaleDateString("fr-FR")}</p></div>
                            <div><Label>Fournisseur</Label><p className="text-sm font-medium">{selectedItem.supplier?.name || "-"}</p></div>
                            <div><Label>N° Facture</Label><p className="text-sm font-medium">{selectedItem.invoiceNumber || "-"}</p></div>
                            <div><Label>Montant total</Label><p className="text-sm font-semibold">{Number(selectedItem.totalAmount).toLocaleString("fr-FR")} Ar</p></div>
                            <div><Label>État sanitaire</Label><p className="text-sm font-medium">{selectedItem.healthStatus || "-"}</p></div>
                            <div><Label>Notes</Label><p className="text-sm font-medium">{selectedItem.notes || "-"}</p></div>
                        </div>
                        {selectedItem.items?.length > 0 && (
                            <div>
                                <Label className="mb-2 block">Animaux achetés ({selectedItem.items.length})</Label>
                                <div className="space-y-2">
                                    {selectedItem.items.map((item, i) => (
                                        <div key={i} className="border rounded p-3 text-sm space-y-1 bg-muted/40">
                                            <p><span className="font-medium">Bovin :</span> {item.cattle?.name || item.cattleId}</p>
                                            <p><span className="font-medium">Prix :</span> {Number(item.price).toLocaleString("fr-FR")} Ar</p>
                                            {item.weightAtPurchase && <p><span className="font-medium">Poids :</span> {item.weightAtPurchase} kg</p>}
                                            {item.healthStatus && <p><span className="font-medium">État sanitaire :</span> {item.healthStatus}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </FormDialog>

            {/* Create Dialog */}
            <FormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                title="Nouvel achat de bétail"
                submitText="Créer l'achat"
                cancelText="Annuler"
                onSubmit={handleCreate}
                loading={createMutation.isPending}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Propriétaire *</Label>
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
                        <div>
                            <Label>Date d'achat *</Label>
                            <Input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} />
                        </div>
                        <div>
                            <Label>Fournisseur</Label>
                            <select
                                className="w-full border rounded px-3 py-2 text-sm bg-background"
                                value={formData.supplierId}
                                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                            >
                                <option value="">Aucun fournisseur</option>
                                {suppliersData?.data?.map((s: Supplier) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>N° Facture</Label>
                            <Input value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} placeholder="Ex: FAC-2024-001" />
                        </div>
                    </div>
                    <div>
                        <Label>État sanitaire général</Label>
                        <Input value={formData.healthStatus} onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })} placeholder="Bon état, vacciné..." />
                    </div>
                    <div>
                        <Label>Notes</Label>
                        <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes supplémentaires" rows={2} />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Animaux achetés *</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="h-4 w-4 mr-1" /> Ajouter un animal
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {formData.items.map((item, index) => (
                                <div key={index} className="border rounded p-3 space-y-2 bg-muted/30 relative">
                                    {formData.items.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 text-destructive"
                                            onClick={() => removeItem(index)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                    <p className="text-xs text-muted-foreground font-medium">Animal #{index + 1}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs">ID Bovin *</Label>
                                            <Input
                                                value={item.cattleId}
                                                onChange={(e) => updateItem(index, "cattleId", e.target.value)}
                                                placeholder="UUID du bovin"
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Prix (Ar) *</Label>
                                            <Input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => updateItem(index, "price", Number(e.target.value))}
                                                placeholder="0"
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Poids (kg)</Label>
                                            <Input
                                                type="number"
                                                value={item.weightAtPurchase || ""}
                                                onChange={(e) => updateItem(index, "weightAtPurchase", e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="Optionnel"
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">État sanitaire</Label>
                                            <Input
                                                value={item.healthStatus || ""}
                                                onChange={(e) => updateItem(index, "healthStatus", e.target.value)}
                                                placeholder="Optionnel"
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex justify-end">
                            <p className="text-sm font-semibold">Total : <span className="text-primary">{totalAmount.toLocaleString("fr-FR")} Ar</span></p>
                        </div>
                    </div>
                </div>
            </FormDialog>

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Supprimer l'achat"
                description={`Êtes-vous sûr de vouloir supprimer cet achat du ${selectedItem ? new Date(selectedItem.purchaseDate).toLocaleDateString("fr-FR") : ""} ?`}
                onConfirm={() => deleteMutation.mutate(selectedItem!.id)}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="destructive"
                loading={deleteMutation.isPending}
            />
        </div>
    );
};

export default PurchasesListPage;
