import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useOwner, useDeleteOwner } from "../../hooks/ownersHooks";

const OwnerDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: owner, isLoading, error } = useOwner(id!);
  
  const deleteMutation = useDeleteOwner({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Propriétaire supprimé avec succès" });
      navigate('/admin/owners');
    },
    onError: (error) => {
      console.error('Error deleting owner:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression";
      uiToast({ title: "Erreur", description: errorMessage, variant: "destructive" });
    },
  });
  
  const handleBack = () => {
    navigate('/admin/owners');
  };
  
  const handleEdit = () => {
    navigate(`/admin/owners/${id}/edit`);
  };
  
  const confirmDelete = () => {
    deleteMutation.mutate(id!);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error || !owner) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Erreur</h1>
        </div>
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive">
          Impossible de charger les données du propriétaire.
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Détails du propriétaire</h1>
            <p className="text-muted-foreground mt-2">{owner.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleEdit}>
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
          <CardTitle className="text-lg">Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">ID</Label>
              <p className="font-mono mt-1">{owner.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Nom</Label>
              <p className="font-medium mt-1">{owner.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium mt-1">{owner.email || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Téléphone</Label>
              <p className="font-medium mt-1">{owner.phone || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Ville</Label>
              <p className="font-medium mt-1">{owner.city || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-muted-foreground">Adresse</Label>
              <p className="font-medium mt-1 whitespace-pre-wrap">{owner.address || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le propriétaire"
        description={`Êtes-vous sûr de vouloir supprimer "${owner.name}" ?`}
        onConfirm={confirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default OwnerDetailPage;
