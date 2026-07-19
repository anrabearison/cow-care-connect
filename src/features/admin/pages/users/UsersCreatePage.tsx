import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useCreateUser } from '../../hooks/usersHooks';
import { useAuth } from '@/features/auth/AuthContext';
import { useOwnersReferenceData } from '../../hooks/useOwnersReferenceData';
import { USER_ROLES, getRoleConstraints, type UserRole } from '@/constants/roles';
import { Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

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
  const { user } = useAuth();
  const createUserMutation = useCreateUser();
  const { owners, isLoading: isLoadingOwners, isError: isErrorOwners } = useOwnersReferenceData();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormState | null>(null);

  // Get role-based constraints
  const roleConstraints = getRoleConstraints(user?.role as UserRole, user?.ownerId);

  // Show owner selector only for SUPER_ADMIN
  const showOwnerSelector = user?.role === 'SUPER_ADMIN';

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name) nextErrors.name = 'Le nom est obligatoire';
    if (!formData.email) nextErrors.email = 'L\'email est obligatoire';
    if (!formData.password) nextErrors.password = 'Le mot de passe est obligatoire';
    if (showOwnerSelector && !formData.ownerId) nextErrors.ownerId = 'Le propriétaire est obligatoire';
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
    // Use role constraints to determine effective values
    const effectiveRole = roleConstraints.forcedRole || pendingData.role;
    const effectiveOwnerId = roleConstraints.forcedOwnerId || (pendingData.ownerId || undefined);

    createUserMutation.mutate({
      name: pendingData.name,
      email: pendingData.email,
      password: pendingData.password,
      role: effectiveRole,
      ownerId: effectiveOwnerId,
    }, {
      onSuccess: () => {
        toast({ title: 'Succès', description: 'Utilisateur créé avec succès' });
        navigate('/admin/users');
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
              <Label htmlFor="ownerId">Propriétaire *</Label>
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
                  <SelectTrigger id="ownerId" className={errors.ownerId ? 'border-red-500' : ''}>
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
              {errors.ownerId && <p className="text-sm text-red-500">{errors.ownerId}</p>}
            </div>
          ) : (
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="ownerId">Propriétaire</Label>
              <div className="p-2 border rounded-md bg-muted">
                {roleConstraints.forcedOwnerId ? 'Propriétaire de votre organisation' : 'Non applicable'}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>Annuler</Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Créer un utilisateur"
        description={`Êtes-vous sûr de vouloir créer l'utilisateur "${pendingData?.name}" (${pendingData?.email}) ?`}
        onConfirm={handleConfirmCreate}
        confirmText="Créer"
        cancelText="Annuler"
        loading={createUserMutation.isPending}
      />
    </div>
  );
};

export default UsersCreatePage;
