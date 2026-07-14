import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateUser } from '../hooks/usersHooks';

interface FormState {
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'OWNER_ADMIN' | 'OWNER_USER';
  ownerId: string;
  isActive: boolean;
}

const initialFormState: FormState = {
  name: '',
  email: '',
  role: 'OWNER_USER',
  ownerId: '',
  isActive: true,
};

const UsersEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateUserMutation = useUpdateUser();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name) nextErrors.name = 'Le nom est obligatoire';
    if (!formData.email) nextErrors.email = 'L\'email est obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    updateUserMutation.mutate({
      id,
      data: {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ownerId: formData.ownerId || undefined,
        isActive: formData.isActive,
      },
    });
    toast({ title: 'Succès', description: 'Utilisateur mis à jour avec succès' });
    navigate(`/admin/users/${id}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Modifier l'utilisateur</h1>
        <p className="text-muted-foreground mt-2">Modifier les informations de l'utilisateur</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={errors.email ? 'border-red-500' : ''} />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as any })}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Administrateur</SelectItem>
                <SelectItem value="OWNER_ADMIN">Admin Propriétaire</SelectItem>
                <SelectItem value="OWNER_USER">Utilisateur Propriétaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ownerId">ID Propriétaire</Label>
            <Input id="ownerId" value={formData.ownerId} onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="isActive">Actif</Label>
            <Select value={formData.isActive ? 'true' : 'false'} onValueChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}>
              <SelectTrigger id="isActive">
                <SelectValue placeholder="Sélectionner l'état" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Actif</SelectItem>
                <SelectItem value="false">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/admin/users/${id}`)}>Annuler</Button>
          <Button type="submit">Mettre à jour</Button>
        </div>
      </form>
    </div>
  );
};

export default UsersEditPage;
