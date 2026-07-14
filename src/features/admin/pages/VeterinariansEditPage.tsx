import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useVeterinarian, useUpdateVeterinarian } from '../hooks/veterinariansHooks';
import { Loader2 } from 'lucide-react';

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

const VeterinariansEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateVeterinarianMutation = useUpdateVeterinarian();
  const { data: veterinarian, isLoading, error } = useVeterinarian(id!);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialData = useMemo(() => {
    if (!veterinarian || !veterinarian.data) return initialFormState;
    return {
      name: veterinarian.data.name || '',
      phone: veterinarian.data.phone || '',
      email: veterinarian.data.email || '',
      address: veterinarian.data.address || '',
      specialty: veterinarian.data.specialty || '',
    };
  }, [veterinarian]);

  const [formData, setFormData] = useState<FormState>(initialData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !veterinarian) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
          <p className="text-muted-foreground mt-2">Vétérinaire introuvable</p>
        </div>
        <Button onClick={() => navigate('/admin/veterinarians')}>Retour à la liste</Button>
      </div>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name) nextErrors.name = 'Le nom est obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    updateVeterinarianMutation.mutate({
      id,
      data: {
        name: formData.name,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
        specialty: formData.specialty || undefined,
      },
    });
    toast({ title: 'Succès', description: 'Vétérinaire mis à jour avec succès' });
    navigate(`/admin/veterinarians/${id}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Modifier le vétérinaire</h1>
        <p className="text-muted-foreground mt-2">Modifier les informations du vétérinaire</p>
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
          <Button type="button" variant="outline" onClick={() => navigate(`/admin/veterinarians/${id}`)}>Annuler</Button>
          <Button type="submit">Mettre à jour</Button>
        </div>
      </form>
    </div>
  );
};

export default VeterinariansEditPage;
