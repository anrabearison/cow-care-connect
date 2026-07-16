import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useUser, useUpdateUser } from '../../hooks/usersHooks';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useOwnersReferenceData } from '../../hooks/useOwnersReferenceData';
import { USER_ROLES, getRoleConstraints, type UserRole } from '@/constants/roles';

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
  const { user: currentUser } = useAuth();
  const updateUserMutation = useUpdateUser();
  const { data: user, isLoading, error } = useUser(id!);
  const { owners, isLoading: isLoadingOwners, isError: isErrorOwners } = useOwnersReferenceData();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get role-based constraints
  const roleConstraints = getRoleConstraints(currentUser?.role as UserRole, currentUser?.ownerId);

  // Show owner selector only for SUPER_ADMIN
  const showOwnerSelector = currentUser?.role === 'SUPER_ADMIN';

  const initialData = useMemo(() => {
    if (!user || !user.data) return initialFormState;
    return {
      name: user.data.name || '',
      email: user.data.email || '',
      role: user.data.role || 'OWNER_USER',
      ownerId: user.data.ownerId || '',
      isActive: user.data.isActive ?? true,
    };
  }, [user]);

  const [formData, setFormData] = useState<FormState>(initialData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !user || !user.data) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
          <p className="text-muted-foreground mt-2">Utilisateur introuvable</p>
        </div>
        <Button onClick={() => navigate('/admin/users')}>Retour à la liste</Button>
      </div>
    );
  }

  // OWNER_ADMIN can only edit OWNER_USER users from their own owner
  if (currentUser?.role === USER_ROLES.OWNER_ADMIN) {
    if (user.data.role !== USER_ROLES.OWNER_USER) {
      return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Accès refusé</h1>
            <p className="text-muted-foreground mt-2">Vous ne pouvez modifier que les utilisateurs de rôle Utilisateur Propriétaire.</p>
          </div>
          <Button onClick={() => navigate('/admin/users')}>Retour à la liste</Button>
        </div>
      );
    }
    if (user.data.ownerId !== currentUser.ownerId) {
      return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Accès refusé</h1>
            <p className="text-muted-foreground mt-2">Vous ne pouvez modifier que les utilisateurs de votre propriétaire.</p>
          </div>
          <Button onClick={() => navigate('/admin/users')}>Retour à la liste</Button>
        </div>
      );
    }
  }

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

    // Use role constraints to determine effective values
    const effectiveRole = roleConstraints.forcedRole || formData.role;
    const effectiveOwnerId = roleConstraints.forcedOwnerId || (formData.ownerId || undefined);

    updateUserMutation.mutate({
      id,
      data: {
        name: formData.name,
        email: formData.email,
        role: effectiveRole,
        ownerId: effectiveOwnerId,
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
            {!roleConstraints.canSelectOwner ? (
              <div className="p-2 border rounded-md bg-muted">
                Utilisateur Propriétaire
              </div>
            ) : (
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as FormState['role'] })}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Administrateur</SelectItem>
                  <SelectItem value="OWNER_ADMIN">Admin Propriétaire</SelectItem>
                  <SelectItem value="OWNER_USER">Utilisateur Propriétaire</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          {showOwnerSelector ? (
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="ownerId">Propriétaire</Label>
              {isLoadingOwners ? (
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Chargement des propriétaires...</span>
                </div>
              ) : isErrorOwners ? (
                <div className="p-2 border rounded-md bg-destructive/10 text-destructive">
                  Erreur lors du chargement des propriétaires
                </div>
              ) : (
                <Select value={formData.ownerId} onValueChange={(value) => setFormData({ ...formData, ownerId: value })}>
                  <SelectTrigger id="ownerId">
                    <SelectValue placeholder="Sélectionner un propriétaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="ownerId">Propriétaire</Label>
              <div className="p-2 border rounded-md bg-muted">
                {roleConstraints.forcedOwnerId ? 'Propriétaire de votre organisation' : 'Non applicable'}
              </div>
            </div>
          )}
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
