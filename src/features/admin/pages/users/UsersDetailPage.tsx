import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useUser, useDeleteUser } from '../../hooks/usersHooks';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { USER_ROLES, type UserRole, getRoleLabel, getRoleColor } from '@/constants/roles';

const UsersDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const deleteUserMutation = useDeleteUser();
  const { data: user, isLoading, error } = useUser(id!);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDelete = () => {
    if (!id) return;
    deleteUserMutation.mutate(id);
    toast({ title: 'Succès', description: 'Utilisateur supprimé avec succès' });
    navigate('/admin/users');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Détail de l'utilisateur</h1>
          <p className="text-muted-foreground mt-2">Consultez les informations de l'utilisateur</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/users/${id}/edit`)}>Modifier</Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>Supprimer</Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-lg border bg-background p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nom</label>
            <p className="text-lg font-semibold">{user.data.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg">{user.data.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Rôle</label>
            <div className="mt-1">
              <Badge style={{ backgroundColor: getRoleColor(user.data.role as UserRole) }}>
                {getRoleLabel(user.data.role as UserRole)}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">État</label>
            <div className="mt-1">
              <Badge variant={user.data.isActive ? "default" : "outline"}>
                {user.data.isActive ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </div>
          {user.data.owner ? (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Propriétaire</label>
              <p className="text-lg">{user.data.owner.name}</p>
              {user.data.owner.phone && (
                <p className="text-sm text-muted-foreground">{user.data.owner.phone}</p>
              )}
              {user.data.owner.address && (
                <p className="text-sm text-muted-foreground">{user.data.owner.address}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Propriétaire</label>
              <p className="text-lg text-muted-foreground">Aucun — rôle plateforme</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersDetailPage;
