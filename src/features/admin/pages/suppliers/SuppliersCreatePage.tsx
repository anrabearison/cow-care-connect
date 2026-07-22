import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCreateSupplier } from '../../hooks/purchasesHooks';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface FormState {
  name: string;
  contactInfo: string;
  phone: string;
  email: string;
  address: string;
}

const initialFormState: FormState = {
  name: '',
  contactInfo: '',
  phone: '',
  email: '',
  address: '',
};

const SuppliersCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createSupplierMutation = useCreateSupplier();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name) nextErrors.name = 'Le nom est obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmCreate = () => {
    createSupplierMutation.mutate({
      name: formData.name,
      contactInfo: formData.contactInfo || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
    }, {
      onSuccess: () => {
        toast({ title: 'Succès', description: 'Fournisseur créé avec succès' });
        navigate('/admin/suppliers');
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
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Nouveau fournisseur</h1>
        <p className="text-muted-foreground mt-2">Créer un fournisseur</p>
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
            <Label htmlFor="contactInfo">Informations de contact</Label>
            <Textarea id="contactInfo" value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} rows={2} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/suppliers')}>Annuler</Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Créer un fournisseur"
        description={`Êtes-vous sûr de vouloir créer le fournisseur "${formData.name}" ?`}
        onConfirm={handleConfirmCreate}
        confirmText="Créer"
        cancelText="Annuler"
        loading={createSupplierMutation.isPending}
      />
    </div>
  );
};

export default SuppliersCreatePage;
