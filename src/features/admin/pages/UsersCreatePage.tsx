import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useCreateUser } from '../hooks/usersHooks';

interface FormState {
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'OWNER_ADMIN' | 'OWNER_USER';
  ownerId: string;
}

const initialFormState: FormState = {
  name: '',
  email: '',
  password: '',
  role: 'OWNER_USER',
  ownerId: '',
};

const UsersCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createUserMutation = useCreateUser();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name) nextErrors.name = 'Le nom est obligatoire';
    if (!formData.email) nextErrors.email = 'L\'email est obligatoire';
    if (!formData.password) nextErrors.password = 'Le mot de passe est obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createUserMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ownerId: formData.ownerId || undefined,
    });
    toast({ title: 'Succès', description: 'Utilisateur créé avec succès' });
    navigate('/admin/users');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Nouvel utilisateur</h1>
        <p className="text-muted-foreground mt-2">Créer un utilisateur</p>
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
            <Label htmlFor="password">Mot de passe *</Label>
            <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={errors.password ? 'border-red-500' : ''} />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
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
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="ownerId">ID Propriétaire</Label>
            <Input id="ownerId" value={formData.ownerId} onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>Annuler</Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>
    </div>
  );
};

export default UsersCreatePage;
