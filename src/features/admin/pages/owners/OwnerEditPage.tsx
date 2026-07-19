import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import OwnerForm, { OwnerFormValues } from "../../components/OwnerForm";
import { useOwner, useUpdateOwner } from "../../hooks/ownersHooks";
import { UpdateOwnerData } from "../services/ownersService";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const OwnerEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<OwnerFormValues | null>(null);

  const { data: owner, isLoading, error } = useOwner(id!);

  const initialData = useMemo(() => {
    if (!owner) return null;
    return {
      name: owner.name || "",
      email: owner.email || "",
      phone: owner.phone || "",
      address: owner.address || "",
      city: owner.city || "",
    };
  }, [owner]);

  const updateMutation = useUpdateOwner({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Propriétaire mis à jour avec succès" });
      navigate('/admin/owners');
    },
    onError: (error) => {
      console.error('Error updating owner:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
      uiToast({ title: "Erreur", description: errorMessage, variant: "destructive" });
    },
  });

  const handleSubmit = (data: OwnerFormValues) => {
    setPendingData(data);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (!pendingData) return;

    const updateData: UpdateOwnerData = {
      ...pendingData,
      email: pendingData.email || undefined,
      phone: pendingData.phone || undefined,
      address: pendingData.address || undefined,
      city: pendingData.city || undefined,
    };
    updateMutation.mutate({ id: id!, data: updateData });
    setIsConfirmDialogOpen(false);
    setPendingData(null);
  };

  const handleCancel = () => {
    navigate('/admin/owners');
  };
  
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error || !owner || !initialData) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Modifier le propriétaire</h1>
          <p className="text-muted-foreground mt-2">Mettre à jour les informations du propriétaire</p>
        </div>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <OwnerForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={updateMutation.isPending}
        />
      </div>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Modifier le propriétaire"
        description={`Êtes-vous sûr de vouloir modifier le propriétaire "${pendingData?.name}" ?`}
        onConfirm={handleConfirmUpdate}
        confirmText="Modifier"
        cancelText="Annuler"
        loading={updateMutation.isPending}
      />
    </div>
  );
};

export default OwnerEditPage;
