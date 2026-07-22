import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateCategory } from "../../hooks/categoriesHooks";
import { CreateCategoryData } from "@/features/admin/services/categoriesService";
import { ArrowLeft } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const initialFormState: CreateCategoryData = {
  name: "",
};

const CategoriesCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateCategoryData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const createCategoryMutation = useCreateCategory();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmCreate = () => {
    createCategoryMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Catégorie créée avec succès",
        });
        navigate("/admin/categories");
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Erreur lors de la création",
          variant: "destructive",
        });
      },
    });
    setIsConfirmDialogOpen(false);
  };

  const handleCancel = () => {
    if (formData.name) {
      if (confirm("Voulez-vous vraiment annuler ? Les modifications non sauvegardées seront perdues.")) {
        navigate("/admin/categories");
      }
    } else {
      navigate("/admin/categories");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nouvelle catégorie</h1>
          <p className="text-muted-foreground mt-2">Créer une nouvelle catégorie</p>
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
          <Button type="button" variant="outline" onClick={handleCancel} disabled={createCategoryMutation.isPending}>
            Annuler
          </Button>
          <Button type="submit" disabled={createCategoryMutation.isPending}>
            {createCategoryMutation.isPending ? "Création..." : "Créer"}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Créer une catégorie"
        description={`Êtes-vous sûr de vouloir créer la catégorie "${formData.name}" ?`}
        onConfirm={handleConfirmCreate}
        confirmText="Créer"
        cancelText="Annuler"
        loading={createCategoryMutation.isPending}
      />
    </div>
  );
};

export default CategoriesCreatePage;
