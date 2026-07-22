import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCreateVeterinarian } from '../../hooks/veterinariansHooks';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialty: string;
}

const initialFormState: FormState = {
  name: '',
  phone: '',
  email: '',
  address: '',
  specialty: '',
};

const VeterinariansCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createVeterinarianMutation = useCreateVeterinarian();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormState | null>(null);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name) nextErrors.name = 'Le nom est obligatoire';
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
    createVeterinarianMutation.mutate({
      name: pendingData.name,
      phone: pendingData.phone || undefined,
      email: pendingData.email || undefined,
      address: pendingData.address || undefined,
      specialty: pendingData.specialty || undefined,
    }, {
      onSuccess: () => {
        toast({ title: 'Succès', description: 'Vétérinaire créé avec succès' });
        navigate('/admin/veterinarians');
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
        <h1 className="text-2xl sm:text-3xl font-bold">Nouveau vétérinaire</h1>
        <p className="text-muted-foreground mt-2">Créer un vétérinaire</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="specialty">Spécialité</Label>
            <Input id="specialty" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/veterinarians')}>Annuler</Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Créer un vétérinaire"
        description={`Êtes-vous sûr de vouloir créer le vétérinaire "${pendingData?.name}" ?`}
        onConfirm={handleConfirmCreate}
        confirmText="Créer"
        cancelText="Annuler"
        loading={createVeterinarianMutation.isPending}
      />
    </div>
  );
};

export default VeterinariansCreatePage;
