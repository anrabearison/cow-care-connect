import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useVeterinarian, useDeleteVeterinarian } from '../../hooks/veterinariansHooks';
import { Loader2 } from 'lucide-react';

const VeterinariansDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const deleteVeterinarianMutation = useDeleteVeterinarian();
  const { data: veterinarian, isLoading, error } = useVeterinarian(id!);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !veterinarian || !veterinarian.data) {
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

  const handleDelete = () => {
    if (!id) return;
    deleteVeterinarianMutation.mutate(id);
    toast({ title: 'Succès', description: 'Vétérinaire supprimé avec succès' });
    navigate('/admin/veterinarians');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Détail du vétérinaire</h1>
          <p className="text-muted-foreground mt-2">Consultez les informations du vétérinaire</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/veterinarians/${id}/edit`)}>Modifier</Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>Supprimer</Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le vétérinaire</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce vétérinaire ? Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-lg border bg-background p-6 shadow-sm">
        <p className="text-muted-foreground">Détail du vétérinaire à afficher ici.</p>
      </div>
    </div>
  );
};

export default VeterinariansDetailPage;
