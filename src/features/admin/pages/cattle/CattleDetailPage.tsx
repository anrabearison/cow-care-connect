import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ArrowLeft, Edit, Loader2, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCattleById } from '@/features/cattle/hooks';
import { useDeleteCattle } from '@/features/cattle/hooks';
import { useToast } from '@/components/ui/use-toast';

const CattleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { cattle, loading, error } = useCattleById(id || '');
  const deleteCattleMutation = useDeleteCattle();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (!cattle) return;
    deleteCattleMutation.mutate(cattle.id, {
      onSuccess: () => {
        toast({ title: 'Succès', description: 'Bovin supprimé avec succès' });
        navigate('/admin/cattle');
      },
    });
  };

  const statusLabel = useMemo(() => {
    if (!cattle?.status) return '-';
    if (typeof cattle.status === 'string') return cattle.status;
    return cattle.status.name || '-';
  }, [cattle?.status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !cattle) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cattle')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Bovin introuvable</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cattle')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Détails du bovin</h1>
            <p className="text-muted-foreground mt-2">Informations du bovin</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/cattle/${cattle.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" /> Modifier
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Nom</Label>
            <p className="text-sm font-medium mt-1">{cattle.name}</p>
          </div>
          <div>
            <Label>Surnom</Label>
            <p className="text-sm font-medium mt-1">{cattle.nickname || '-'}</p>
          </div>
          <div>
            <Label>Sexe</Label>
            <p className="text-sm font-medium mt-1">{cattle.gender === 'M' ? 'Mâle' : 'Femelle'}</p>
          </div>
          <div>
            <Label>Date de naissance</Label>
            <p className="text-sm font-medium mt-1">{new Date(cattle.birthDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <Label>Catégorie</Label>
            <p className="text-sm font-medium mt-1">{cattle.category ? String(cattle.category.name || '-') : '-'}</p>
          </div>
          <div>
            <Label>Statut</Label>
            <p className="text-sm font-medium mt-1">{statusLabel}</p>
          </div>
          <div>
            <Label>N° Carnet</Label>
            <p className="text-sm font-medium mt-1">{cattle.nCarnet || '-'}</p>
          </div>
          <div>
            <Label>Source</Label>
            <p className="text-sm font-medium mt-1">{cattle.source?.type || '-'}</p>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le bovin"
        description="Êtes-vous sûr de vouloir supprimer ce bovin ?"
        onConfirm={handleDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteCattleMutation.isPending}
      />
    </div>
  );
};

export default CattleDetailPage;
