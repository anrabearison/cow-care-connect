import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useHerdBook, useDeleteHerdBook } from "../hooks/herdBooksHooks";

const HerdBookDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: herdBook, isLoading, error } = useHerdBook(id!);

  const deleteMutation = useDeleteHerdBook({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Livre de troupeau supprimé avec succès" });
      navigate('/admin/herd-books');
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Erreur lors de la suppression";
      uiToast({ title: "Erreur", description: msg, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !herdBook) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/herd-books')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Erreur</h1>
        </div>
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive">
          Impossible de charger les données du livre de troupeau.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/herd-books')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Détails du livre de troupeau</h1>
            <p className="text-muted-foreground mt-2">{herdBook.reference} – {herdBook.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(`/admin/herd-books/${id}/edit`)}>
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">Référence</Label>
              <p className="font-medium mt-1">{herdBook.reference}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Année</Label>
              <p className="font-medium mt-1">{herdBook.year}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Propriétaire</Label>
              <p className="font-medium mt-1">
                {typeof herdBook.owner === 'object' ? herdBook.owner?.name : herdBook.owner || "-"}
              </p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-muted-foreground">Description</Label>
              <p className="font-medium mt-1 whitespace-pre-wrap">{herdBook.description || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le livre de troupeau"
        description={`Êtes-vous sûr de vouloir supprimer "${herdBook.reference}" ?`}
        onConfirm={() => deleteMutation.mutate(id!)}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default HerdBookDetailPage;
