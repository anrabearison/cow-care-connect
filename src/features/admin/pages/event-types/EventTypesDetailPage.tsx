import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEventType, useDeleteEventType } from "../../hooks/eventTypesHooks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";

const EventTypesDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: eventType, isLoading, error } = useEventType(id || "");
  const deleteEventTypeMutation = useDeleteEventType();

  const handleDelete = () => {
    if (id) {
      deleteEventTypeMutation.mutate(id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "Type d'événement supprimé avec succès",
      });
      navigate("/admin/event-types");
    }
  };

  const handleCancel = () => {
    navigate("/admin/event-types");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !eventType?.data) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Type d'événement introuvable</p>
          </div>
        </div>
        <Button onClick={handleCancel}>Retour à la liste</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Détails du type d'événement</h1>
          <p className="text-muted-foreground mt-2">Informations détaillées du type d'événement</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">ID</p>
            <p className="text-sm font-medium font-mono">{eventType.data.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nom</p>
            <p className="text-sm font-medium">{eventType.data.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Icône</p>
            <p className="text-sm font-medium">{eventType.data.icon || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm font-medium">{eventType.data.description || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Créé le</p>
            <p className="text-sm font-medium">{new Date(eventType.data.createdAt).toLocaleDateString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mis à jour le</p>
            <p className="text-sm font-medium">{new Date(eventType.data.updatedAt).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => navigate(`/admin/event-types/${id}/edit`)}>
            Modifier
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            Supprimer
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le type d'événement"
        description={`Êtes-vous sûr de vouloir supprimer "${eventType.data.name}" ?`}
        onConfirm={handleDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteEventTypeMutation.isPending}
      />
    </div>
  );
};

export default EventTypesDetailPage;
