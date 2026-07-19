import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { ownersService, Owner } from '../services/ownersService';
import { purchasesService, Supplier, CreatePurchaseItemData } from '../services/purchasesService';
import { queryKeys } from '@/lib/queryKeys';
import { Plus, Trash2 } from 'lucide-react';

export interface PurchaseFormValues {
  ownerId: string;
  purchaseDate: string;
  supplierId: string;
  invoiceNumber: string;
  healthStatus: string;
  notes: string;
  items: CreatePurchaseItemData[];
}

interface PurchaseFormProps {
  mode: 'create' | 'edit';
  initialData: PurchaseFormValues;
  onSubmit: (data: PurchaseFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

const emptyItem = (): CreatePurchaseItemData => ({
  cattleId: "",
  price: 0,
  weightAtPurchase: undefined,
  healthStatus: "",
});

const FormField = memo(function FormField({
  id, label, error, required, children,
}: {
  id: string; label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={error ? 'text-destructive' : ''}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
});

const PurchaseForm = ({ mode, initialData, onSubmit, onCancel, isPending }: PurchaseFormProps) => {
  const [formData, setFormData] = useState<PurchaseFormValues>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: ownersData } = useQuery({
    queryKey: queryKeys.owners.list({ page: 1, per_page: 100 }),
    queryFn: () => ownersService.getOwnersList({ page: 1, per_page: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: suppliersData } = useQuery({
    queryKey: queryKeys.suppliers.list({ page: 1, per_page: 100 }),
    queryFn: () => purchasesService.getSuppliersList({ page: 1, per_page: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const owners: Owner[] = ownersData?.data || [];
  const suppliers: Supplier[] = suppliersData?.data || [];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.ownerId) newErrors.ownerId = "Veuillez sélectionner un propriétaire";
    if (!formData.purchaseDate) newErrors.purchaseDate = "La date d'achat est requise";
    if (formData.items.length === 0) newErrors.items = "Ajoutez au moins un animal";
    formData.items.forEach((item, i) => {
      if (!item.cattleId) newErrors[`item_${i}_cattleId`] = "L'ID du bovin est requis";
      if (!item.price || item.price <= 0) newErrors[`item_${i}_price`] = "Le prix doit être supérieur à 0";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const updateItem = (index: number, field: string, value: unknown) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => setFormData({ ...formData, items: [...formData.items, emptyItem()] });
  const removeItem = (index: number) =>
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });

  const totalAmount = formData.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField id="ownerId" label="Propriétaire" error={errors.ownerId} required>
          <Select value={formData.ownerId} onValueChange={(v) => setFormData({ ...formData, ownerId: v })}>
            <SelectTrigger id="ownerId" className={errors.ownerId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Sélectionner un propriétaire" />
            </SelectTrigger>
            <SelectContent>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>{owner.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="purchaseDate" label="Date d'achat" error={errors.purchaseDate} required>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            className={errors.purchaseDate ? 'border-destructive' : ''}
          />
        </FormField>

        <FormField id="supplierId" label="Fournisseur" error={errors.supplierId}>
          <Select value={formData.supplierId || 'none'} onValueChange={(v) => setFormData({ ...formData, supplierId: v === 'none' ? '' : v })}>
            <SelectTrigger id="supplierId">
              <SelectValue placeholder="Aucun fournisseur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun fournisseur</SelectItem>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="invoiceNumber" label="N° Facture" error={errors.invoiceNumber}>
          <Input
            id="invoiceNumber"
            placeholder="Ex: FAC-2024-001"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
          />
        </FormField>

        <FormField id="healthStatus" label="État sanitaire général" error={errors.healthStatus}>
          <Input
            id="healthStatus"
            placeholder="Bon état, vacciné..."
            value={formData.healthStatus}
            onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField id="notes" label="Notes" error={errors.notes}>
            <Textarea
              id="notes"
              placeholder="Notes supplémentaires"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* Items section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className={errors.items ? 'text-destructive' : ''}>
            Animaux achetés <span className="text-destructive">*</span>
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter un animal
          </Button>
        </div>
        {errors.items && <p className="text-sm font-medium text-destructive">{errors.items}</p>}
        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/30 relative">
              {formData.items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 text-destructive"
                  aria-label="Retirer cet article"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              <p className="text-xs text-muted-foreground font-semibold">Animal #{index + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`cattleId-${index}`} className="text-xs">
                    ID Bovin <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`cattleId-${index}`}
                    value={item.cattleId}
                    onChange={(e) => updateItem(index, "cattleId", e.target.value)}
                    placeholder="UUID du bovin"
                    className={`h-8 text-sm ${errors[`item_${index}_cattleId`] ? 'border-destructive' : ''}`}
                  />
                  {errors[`item_${index}_cattleId`] && (
                    <p className="text-xs text-destructive">{errors[`item_${index}_cattleId`]}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`price-${index}`} className="text-xs">
                    Prix (Ar) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`price-${index}`}
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", Number(e.target.value))}
                    placeholder="0"
                    className={`h-8 text-sm ${errors[`item_${index}_price`] ? 'border-destructive' : ''}`}
                  />
                  {errors[`item_${index}_price`] && (
                    <p className="text-xs text-destructive">{errors[`item_${index}_price`]}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`weight-${index}`} className="text-xs">Poids (kg)</Label>
                  <Input
                    id={`weight-${index}`}
                    type="number"
                    value={item.weightAtPurchase || ""}
                    onChange={(e) => updateItem(index, "weightAtPurchase", e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optionnel"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`itemHealth-${index}`} className="text-xs">État sanitaire</Label>
                  <Input
                    id={`itemHealth-${index}`}
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
        <div className="flex justify-end">
          <p className="text-sm font-semibold">
            Total : <span className="text-primary">{totalAmount.toLocaleString('fr-FR')} Ar</span>
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : mode === 'create' ? "Créer l'achat" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseForm;
