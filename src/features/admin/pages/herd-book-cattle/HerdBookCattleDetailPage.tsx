import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { herdBookCattleService, HerdBookCattle } from "@/features/admin/services/herdBookCattleService";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import { queryKeys } from "@/lib/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

const HerdBookCattleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: item, isLoading, error } = useQuery({
    queryKey: queryKeys.herdBookCattle.details(id!),
    queryFn: () => herdBookCattleService.getHerdBookCattleById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: herdBookCattleService.deleteHerdBookCattle,
    onSuccess: () => {
      toast({ title: "Succès", description: "Inscription supprimée avec succès" });
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBookCattle.lists() });
      navigate('/admin/herd-book-cattle');
    },
    onError: (error) => {
      console.error('Error deleting herd book cattle:', error);
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    },
  });

  const handleDelete = () => {
    if (item?.data) {
      deleteMutation.mutate(item.data.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !item?.data) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/herd-book-cattle')} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Inscription introuvable</p>
          </div>
        </div>
        <Button onClick={() => navigate('/admin/herd-book-cattle')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const data = item.data;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/herd-book-cattle')} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Détails de l'inscription</h1>
            <p className="text-muted-foreground mt-2">Informations de l'inscription</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/herd-book-cattle/${data.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID</Label>
              <p className="text-sm font-medium font-mono mt-1">{data.id}</p>
            </div>
            <div>
              <Label>Livre de troupeau</Label>
              <p className="text-sm font-medium mt-1">
                {(() => {
                  if (!data.herdBook) return "-";
                  if (typeof data.herdBook === 'string') return data.herdBook;
                  const hb = data.herdBook as { name?: string; reference?: string; year?: number };
                  const name = hb.name || hb.reference || '-';
                  const year = hb.year ? ` (${hb.year})` : '';
                  return `${name}${year}`;
                })()}
              </p>
            </div>
            <div>
              <Label>Bovin</Label>
              <p className="text-sm font-medium mt-1">
                {(() => {
                  if (!data.cattle) return "-";
                  if (typeof data.cattle === 'string') return data.cattle;
                  if (data.cattle.name) return data.cattle.name;
                  return "-";
                })()}
              </p>
            </div>
            <div>
              <Label>N° Carnet</Label>
              <p className="text-sm font-medium mt-1">{data.nCarnet || "-"}</p>
            </div>
            <div>
              <Label>Catégorie</Label>
              <p className="text-sm font-medium mt-1">
                {(() => {
                  if (!data.category) return "-";
                  if (typeof data.category === 'string') return data.category;
                  if (data.category.name) return data.category.name;
                  return "-";
                })()}
              </p>
            </div>
            <div>
              <Label>Statut</Label>
              <p className="text-sm font-medium mt-1">
                {(() => {
                  if (!data.status) return "-";
                  if (typeof data.status === 'string') return data.status;
                  if (data.status.name) return data.status.name;
                  return "-";
                })()}
              </p>
            </div>
            <div>
              <Label>Date de création</Label>
              <p className="text-sm font-medium mt-1">
                {new Date(data.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <Label>Date de mise à jour</Label>
              <p className="text-sm font-medium mt-1">
                {new Date(data.updatedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer l'inscription"
        description="Êtes-vous sûr de vouloir supprimer cette inscription ?"
        onConfirm={handleDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default HerdBookCattleDetailPage;
