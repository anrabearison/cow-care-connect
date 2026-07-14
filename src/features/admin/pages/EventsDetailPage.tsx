import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteEvent } from '../hooks/eventsHooks';

const EventsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const deleteEventMutation = useDeleteEvent();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    if (!id) return;
    deleteEventMutation.mutate(id);
    toast({ title: 'Succès', description: 'Événement supprimé avec succès' });
    navigate('/admin/events');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Détail de l'événement</h1>
          <p className="text-muted-foreground mt-2">Consultez les informations de l'événement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/edit`)}>Modifier</Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>Supprimer</Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'événement</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-lg border bg-background p-6 shadow-sm">
        <p className="text-muted-foreground">Détail de l'événement à afficher ici.</p>
      </div>
    </div>
  );
};

export default EventsDetailPage;
