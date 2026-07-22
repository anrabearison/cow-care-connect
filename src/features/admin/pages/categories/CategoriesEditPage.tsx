import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCategory, useUpdateCategory } from "../../hooks/categoriesHooks";
import { UpdateCategoryData } from "@/features/admin/services/categoriesService";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const initialFormState: UpdateCategoryData = {
  name: "",
};

const CategoriesEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<UpdateCategoryData | null>(null);

  const { data: category, isLoading, error } = useCategory(id || "");
  const updateCategoryMutation = useUpdateCategory();

  const initialData = useMemo(() => {
    if (category?.data) {
      return {
        name: category.data.name,
      };
    }
    return initialFormState;
  }, [category?.data]);

  const [formData, setFormData] = useState<UpdateCategoryData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Le nom est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;
    setPendingData(formData);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (!pendingData || !id) return;
    updateCategoryMutation.mutate({ id, data: pendingData }, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès",
        });
        navigate("/admin/categories");
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
          variant: "destructive",
        });
      },
    });
    setIsConfirmDialogOpen(false);
    setPendingData(null);
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
          <h1 className="text-2xl sm:text-3xl font-bold">Modifier la catégorie</h1>
          <p className="text-muted-foreground mt-2">Modifier les informations de la catégorie</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nom de la catégorie"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={updateCategoryMutation.isPending}>
            Annuler
          </Button>
          <Button type="submit" disabled={updateCategoryMutation.isPending}>
            {updateCategoryMutation.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Modifier la catégorie"
        description={`Êtes-vous sûr de vouloir modifier la catégorie "${pendingData?.name}" ?`}
        onConfirm={handleConfirmUpdate}
        confirmText="Modifier"
        cancelText="Annuler"
        loading={updateCategoryMutation.isPending}
      />
    </div>
  );
};

export default CategoriesEditPage;
