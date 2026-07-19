import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCategory, useDeleteCategory } from "../../hooks/categoriesHooks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";

const CategoriesDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: category, isLoading, error } = useCategory(id || "");
  const deleteCategoryMutation = useDeleteCategory();

  const handleDelete = () => {
    if (id) {
      deleteCategoryMutation.mutate(id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
      navigate("/admin/categories");
    }
  };

  const handleCancel = () => {
    navigate("/admin/categories");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !category?.data) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Catégorie introuvable</p>
          </div>
        </div>
        <Button onClick={handleCancel}>Retour à la liste</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Détails de la catégorie</h1>
          <p className="text-muted-foreground mt-2">Informations détaillées de la catégorie</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">ID</p>
            <p className="text-sm font-medium font-mono">{category.data.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nom</p>
            <p className="text-sm font-medium">{category.data.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Créé le</p>
            <p className="text-sm font-medium">{new Date(category.data.createdAt).toLocaleDateString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mis à jour le</p>
            <p className="text-sm font-medium">{new Date(category.data.updatedAt).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => navigate(`/admin/categories/${id}/edit`)}>
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
        title="Supprimer la catégorie"
        description={`Êtes-vous sûr de vouloir supprimer "${category.data.name}" ?`}
        onConfirm={handleDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteCategoryMutation.isPending}
      />
    </div>
  );
};

export default CategoriesDetailPage;
