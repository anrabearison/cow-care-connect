import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useSupplier, useUpdateSupplier } from '../../hooks/purchasesHooks';
import { Loader2 } from 'lucide-react';
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

const SuppliersEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateSupplierMutation = useUpdateSupplier();
  const { data: supplier, isLoading, error } = useSupplier(id!);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormState | null>(null);

  const initialData = useMemo(() => {
    if (!supplier || !supplier.data) return initialFormState;
    return {
      name: supplier.data.name || '',
      contactInfo: supplier.data.contactInfo || '',
      phone: supplier.data.phone || '',
      email: supplier.data.email || '',
      address: supplier.data.address || '',
    };
  }, [supplier]);

  const [formData, setFormData] = useState<FormState>(initialData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
          <p className="text-muted-foreground mt-2">Fournisseur introuvable</p>
        </div>
        <Button onClick={() => navigate('/admin/suppliers')}>Retour à la liste</Button>
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
    setPendingData(formData);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (!pendingData || !id) return;
    updateSupplierMutation.mutate({
      id,
      data: {
        name: pendingData.name,
        contactInfo: pendingData.contactInfo || undefined,
        phone: pendingData.phone || undefined,
        email: pendingData.email || undefined,
        address: pendingData.address || undefined,
      },
    }, {
      onSuccess: () => {
        toast({ title: 'Succès', description: 'Fournisseur mis à jour avec succès' });
        navigate(`/admin/suppliers/${id}`);
      },
      onError: (error) => {
        toast({ 
          title: 'Erreur', 
          description: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
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
        <h1 className="text-2xl sm:text-3xl font-bold">Modifier le fournisseur</h1>
        <p className="text-muted-foreground mt-2">Modifier les informations du fournisseur</p>
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
          <Button type="button" variant="outline" onClick={() => navigate(`/admin/suppliers/${id}`)}>Annuler</Button>
          <Button type="submit">Mettre à jour</Button>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Modifier le fournisseur"
        description={`Êtes-vous sûr de vouloir modifier le fournisseur "${pendingData?.name}" ?`}
        onConfirm={handleConfirmUpdate}
        confirmText="Modifier"
        cancelText="Annuler"
        loading={updateSupplierMutation.isPending}
      />
    </div>
  );
};

export default SuppliersEditPage;
