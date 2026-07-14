import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import OwnerForm, { OwnerFormValues } from "../../components/OwnerForm";
import { useCreateOwner } from "../../hooks/ownersHooks";
import { CreateOwnerData } from "../services/ownersService";

const OwnerCreatePage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  const initialData = useMemo(() => ({
    name: "",
    email: "",
    contactInfo: "",
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
    const createData: CreateOwnerData = {
      ...data,
      email: data.email || undefined,
      contactInfo: data.contactInfo || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      city: data.city || undefined,
    };
    createMutation.mutate(createData);
  };
  
  const handleCancel = () => {
    navigate('/admin/owners');
  };
  
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
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
    </div>
  );
};

export default OwnerCreatePage;
