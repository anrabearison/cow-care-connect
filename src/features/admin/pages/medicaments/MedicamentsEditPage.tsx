import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useMedicament, useUpdateMedicament } from '../../hooks/medicamentsHooks';
import { Loader2 } from 'lucide-react';

interface FormState {
  name: string;
  type: string;
  dosageQuantity: string;
  dosageUnit: string;
  dosageWeight: string;
  dosageWeightUnit: string;
  dosageNotes: string;
  defaultRoute: string;
  withdrawalPeriodMeat: string;
  withdrawalPeriodMilk: string;
  manufacturer: string;
  notes: string;
}

const initialFormState: FormState = {
  name: '',
  type: '',
  dosageQuantity: '',
  dosageUnit: '',
  dosageWeight: '',
  dosageWeightUnit: '',
  dosageNotes: '',
  defaultRoute: '',
  withdrawalPeriodMeat: '',
  withdrawalPeriodMilk: '',
  manufacturer: '',
  notes: '',
};

const MedicamentsEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateMedicamentMutation = useUpdateMedicament();
  const { data: medicament, isLoading, error } = useMedicament(id!);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialData = useMemo(() => {
    if (!medicament || !medicament.data) return initialFormState;
    return {
      name: medicament.data.name || '',
      type: medicament.data.type || '',
      dosageQuantity: medicament.data.dosageQuantity?.toString() || '',
      dosageUnit: medicament.data.dosageUnit || '',
      dosageWeight: medicament.data.dosageWeight?.toString() || '',
      dosageWeightUnit: medicament.data.dosageWeightUnit || '',
      dosageNotes: medicament.data.dosageNotes || '',
      defaultRoute: medicament.data.defaultRoute || '',
      withdrawalPeriodMeat: medicament.data.withdrawalPeriodMeat?.toString() || '',
      withdrawalPeriodMilk: medicament.data.withdrawalPeriodMilk?.toString() || '',
      manufacturer: medicament.data.manufacturer || '',
      notes: medicament.data.notes || '',
    };
  }, [medicament]);

  const [formData, setFormData] = useState<FormState>(initialData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !medicament) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
          <p className="text-muted-foreground mt-2">Médicament introuvable</p>
        </div>
        <Button onClick={() => navigate('/admin/medicaments')}>Retour à la liste</Button>
      </div>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name) nextErrors.name = 'Le nom est obligatoire';
    if (!formData.type) nextErrors.type = 'Le type est obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    updateMedicamentMutation.mutate({
      id,
      data: {
        name: formData.name,
        type: formData.type,
        dosageQuantity: formData.dosageQuantity ? Number(formData.dosageQuantity) : undefined,
        dosageUnit: formData.dosageUnit || undefined,
        dosageWeight: formData.dosageWeight ? Number(formData.dosageWeight) : undefined,
        dosageWeightUnit: formData.dosageWeightUnit || undefined,
        dosageNotes: formData.dosageNotes || undefined,
        defaultRoute: formData.defaultRoute || undefined,
        withdrawalPeriodMeat: formData.withdrawalPeriodMeat ? Number(formData.withdrawalPeriodMeat) : undefined,
        withdrawalPeriodMilk: formData.withdrawalPeriodMilk ? Number(formData.withdrawalPeriodMilk) : undefined,
        manufacturer: formData.manufacturer || undefined,
        notes: formData.notes || undefined,
      },
    });
    toast({ title: 'Succès', description: 'Médicament mis à jour avec succès' });
    navigate(`/admin/medicaments/${id}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Modifier le médicament</h1>
        <p className="text-muted-foreground mt-2">Modifier les informations du médicament</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type *</Label>
            <Input id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={errors.type ? 'border-red-500' : ''} />
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="manufacturer">Fabricant</Label>
            <Input id="manufacturer" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="defaultRoute">Route d'administration par défaut</Label>
            <Input id="defaultRoute" value={formData.defaultRoute} onChange={(e) => setFormData({ ...formData, defaultRoute: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosageQuantity">Quantité dosage</Label>
            <Input id="dosageQuantity" type="number" value={formData.dosageQuantity} onChange={(e) => setFormData({ ...formData, dosageQuantity: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosageUnit">Unité dosage</Label>
            <Input id="dosageUnit" value={formData.dosageUnit} onChange={(e) => setFormData({ ...formData, dosageUnit: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosageWeight">Poids dosage</Label>
            <Input id="dosageWeight" type="number" value={formData.dosageWeight} onChange={(e) => setFormData({ ...formData, dosageWeight: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosageWeightUnit">Unité poids dosage</Label>
            <Input id="dosageWeightUnit" value={formData.dosageWeightUnit} onChange={(e) => setFormData({ ...formData, dosageWeightUnit: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="withdrawalPeriodMeat">Délai d'attente viande (jours)</Label>
            <Input id="withdrawalPeriodMeat" type="number" value={formData.withdrawalPeriodMeat} onChange={(e) => setFormData({ ...formData, withdrawalPeriodMeat: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="withdrawalPeriodMilk">Délai d'attente lait (jours)</Label>
            <Input id="withdrawalPeriodMilk" type="number" value={formData.withdrawalPeriodMilk} onChange={(e) => setFormData({ ...formData, withdrawalPeriodMilk: e.target.value })} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="dosageNotes">Notes dosage</Label>
            <Textarea id="dosageNotes" value={formData.dosageNotes} onChange={(e) => setFormData({ ...formData, dosageNotes: e.target.value })} rows={2} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/admin/medicaments/${id}`)}>Annuler</Button>
          <Button type="submit">Mettre à jour</Button>
        </div>
      </form>
    </div>
  );
};

export default MedicamentsEditPage;
