import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCreateTreatment } from '../../hooks/treatmentsHooks';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface FormState {
  cattleId: string;
  type: string;
  date: string;
  product: string;
  dosageQuantity: string;
  dosageUnit: string;
  dosageAnimalWeight: string;
  dosageNotes: string;
  administrationRoute: string;
  veterinarian: string;
  notes: string;
}

const initialFormState: FormState = {
  cattleId: '',
  type: '',
  date: '',
  product: '',
  dosageQuantity: '',
  dosageUnit: '',
  dosageAnimalWeight: '',
  dosageNotes: '',
  administrationRoute: '',
  veterinarian: '',
  notes: '',
};

const TreatmentsCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createTreatmentMutation = useCreateTreatment();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormState | null>(null);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.cattleId) nextErrors.cattleId = 'Le bovin est obligatoire';
    if (!formData.type) nextErrors.type = 'Le type est obligatoire';
    if (!formData.date) nextErrors.date = 'La date est obligatoire';
    if (!formData.product) nextErrors.product = 'Le produit est obligatoire';
    if (!formData.veterinarian) nextErrors.veterinarian = 'Le vétérinaire est obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPendingData(formData);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmCreate = () => {
    if (!pendingData) return;
    createTreatmentMutation.mutate({
      cattleId: pendingData.cattleId,
      type: pendingData.type,
      date: pendingData.date,
      product: pendingData.product,
      dosage: {
        quantity: Number(pendingData.dosageQuantity) || 0,
        unit: pendingData.dosageUnit,
        animalWeight: pendingData.dosageAnimalWeight ? Number(pendingData.dosageAnimalWeight) : undefined,
        notes: pendingData.dosageNotes || undefined,
      },
      administrationRoute: pendingData.administrationRoute || undefined,
      veterinarian: pendingData.veterinarian,
      notes: pendingData.notes || undefined,
    }, {
      onSuccess: () => {
        toast({ title: 'Succès', description: 'Traitement créé avec succès' });
        navigate('/admin/treatments');
      },
      onError: (error) => {
        toast({ 
          title: 'Erreur', 
          description: error instanceof Error ? error.message : 'Erreur lors de la création',
          variant: 'destructive' 
        });
      },
    });
    setIsConfirmDialogOpen(false);
    setPendingData(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Nouveau traitement</h1>
        <p className="text-muted-foreground mt-2">Créer un traitement pour un bovin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="cattleId">Bovin *</Label>
            <Input id="cattleId" value={formData.cattleId} onChange={(e) => setFormData({ ...formData, cattleId: e.target.value })} className={errors.cattleId ? 'border-red-500' : ''} />
            {errors.cattleId && <p className="text-sm text-red-500">{errors.cattleId}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type *</Label>
            <Input id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={errors.type ? 'border-red-500' : ''} />
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date *</Label>
            <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={errors.date ? 'border-red-500' : ''} />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product">Produit *</Label>
            <Input id="product" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className={errors.product ? 'border-red-500' : ''} />
            {errors.product && <p className="text-sm text-red-500">{errors.product}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosageQuantity">Quantité</Label>
            <Input id="dosageQuantity" type="number" value={formData.dosageQuantity} onChange={(e) => setFormData({ ...formData, dosageQuantity: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosageUnit">Unité</Label>
            <Input id="dosageUnit" value={formData.dosageUnit} onChange={(e) => setFormData({ ...formData, dosageUnit: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosageAnimalWeight">Poids animal</Label>
            <Input id="dosageAnimalWeight" type="number" value={formData.dosageAnimalWeight} onChange={(e) => setFormData({ ...formData, dosageAnimalWeight: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="administrationRoute">Route d'administration</Label>
            <Input id="administrationRoute" value={formData.administrationRoute} onChange={(e) => setFormData({ ...formData, administrationRoute: e.target.value })} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="dosageNotes">Notes dosage</Label>
            <Textarea id="dosageNotes" value={formData.dosageNotes} onChange={(e) => setFormData({ ...formData, dosageNotes: e.target.value })} rows={2} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="veterinarian">Vétérinaire *</Label>
            <Input id="veterinarian" value={formData.veterinarian} onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })} className={errors.veterinarian ? 'border-red-500' : ''} />
            {errors.veterinarian && <p className="text-sm text-red-500">{errors.veterinarian}</p>}
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/treatments')}>Annuler</Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Créer un traitement"
        description={`Êtes-vous sûr de vouloir créer le traitement "${pendingData?.product}" pour le ${pendingData?.date} ?`}
        onConfirm={handleConfirmCreate}
        confirmText="Créer"
        cancelText="Annuler"
        loading={createTreatmentMutation.isPending}
      />
    </div>
  );
};

export default TreatmentsCreatePage;
