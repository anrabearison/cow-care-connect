import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useTreatment, useUpdateTreatment } from '../hooks/treatmentsHooks';
import { Loader2 } from 'lucide-react';

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

const TreatmentsEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateTreatmentMutation = useUpdateTreatment();
  const { data: treatment, isLoading, error } = useTreatment(id!);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialData = useMemo(() => {
    if (!treatment || !treatment.data) return initialFormState;
    return {
      cattleId: treatment.data.cattleId || '',
      type: typeof treatment.data.type === 'string' ? treatment.data.type : treatment.data.type?.name || '',
      date: treatment.data.date || '',
      product: typeof treatment.data.product === 'string' ? treatment.data.product : treatment.data.product?.name || '',
      dosageQuantity: treatment.data.dosage?.quantity?.toString() || '',
      dosageUnit: treatment.data.dosage?.unit || '',
      dosageAnimalWeight: treatment.data.dosage?.animalWeight?.toString() || '',
      dosageNotes: treatment.data.dosage?.notes || '',
      administrationRoute: treatment.data.administrationRoute || '',
      veterinarian: typeof treatment.data.veterinarian === 'string' ? treatment.data.veterinarian : treatment.data.veterinarian?.name || '',
      notes: treatment.data.notes || '',
    };
  }, [treatment]);

  const [formData, setFormData] = useState<FormState>(initialData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !treatment) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
          <p className="text-muted-foreground mt-2">Traitement introuvable</p>
        </div>
        <Button onClick={() => navigate('/admin/treatments')}>Retour à la liste</Button>
      </div>
    );
  }

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
    if (!validate() || !id) return;

    updateTreatmentMutation.mutate({
      id,
      data: {
        cattleId: formData.cattleId,
        type: formData.type,
        date: formData.date,
        product: formData.product,
        dosage: {
          quantity: Number(formData.dosageQuantity) || 0,
          unit: formData.dosageUnit,
          animalWeight: formData.dosageAnimalWeight ? Number(formData.dosageAnimalWeight) : undefined,
          notes: formData.dosageNotes || undefined,
        },
        administrationRoute: formData.administrationRoute || undefined,
        veterinarian: formData.veterinarian,
        notes: formData.notes || undefined,
      },
    });
    toast({ title: 'Succès', description: 'Traitement mis à jour avec succès' });
    navigate(`/admin/treatments/${id}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Modifier le traitement</h1>
        <p className="text-muted-foreground mt-2">Modifier les informations du traitement</p>
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
          <Button type="button" variant="outline" onClick={() => navigate(`/admin/treatments/${id}`)}>Annuler</Button>
          <Button type="submit">Mettre à jour</Button>
        </div>
      </form>
    </div>
  );
};

export default TreatmentsEditPage;
