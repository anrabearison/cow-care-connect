import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import OwnerForm, { OwnerFormValues } from "../../components/OwnerForm";
import { useCreateOwner } from "../../hooks/ownersHooks";
import { CreateOwnerData } from "../services/ownersService";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const OwnerCreatePage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<OwnerFormValues | null>(null);

  const initialData = useMemo(() => ({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  }), []);

  const createMutation = useCreateOwner({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Propriétaire créé avec succès" });
      navigate('/admin/owners');
    },
    onError: (error) => {
      console.error('Error creating owner:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la création";
      uiToast({ title: "Erreur", description: errorMessage, variant: "destructive" });
    },
  });

  const handleSubmit = (data: OwnerFormValues) => {
    setPendingData(data);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmCreate = () => {
    if (!pendingData) return;

    const createData: CreateOwnerData = {
      ...pendingData,
      email: pendingData.email || undefined,
      phone: pendingData.phone || undefined,
      address: pendingData.address || undefined,
      city: pendingData.city || undefined,
    };
    createMutation.mutate(createData);
    setIsConfirmDialogOpen(false);
    setPendingData(null);
  };

  const handleCancel = () => {
    navigate('/admin/owners');
  };
  
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nouveau propriétaire</h1>
          <p className="text-muted-foreground mt-2">Ajouter un nouveau propriétaire</p>
        </div>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <OwnerForm
          mode="create"
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={createMutation.isPending}
        />
      </div>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Créer un propriétaire"
        description={`Êtes-vous sûr de vouloir créer le propriétaire "${pendingData?.name}" ?`}
        onConfirm={handleConfirmCreate}
        confirmText="Créer"
        cancelText="Annuler"
        loading={createMutation.isPending}
      />
    </div>
  );
};

export default OwnerCreatePage;
