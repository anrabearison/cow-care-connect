import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { CreatePassportDto } from "../types/passport.types";
import { useCreatePassport } from "../hooks";
import { useHerdBookSelection } from "@/contexts/HerdBookSelectionContext";
import { useHerdBookCattle } from "@/features/herdbook/hooks";
import PassportForm, { PassportFormValues } from "../components/PassportForm";
import { getTodayDate } from "@/utils/dateUtils";

const PassportCreatePage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { selectedHerdBookId } = useHerdBookSelection();
  
  const { data: herdBookCattleData } = useHerdBookCattle(selectedHerdBookId || '', 1, 50);
  const herdBookCattle = herdBookCattleData?.data ?? [];
  
  const today = getTodayDate();
  
  const initialData = useMemo(() => ({
    passportNumber: "",
    location: "",
    issueDate: today,
    district: "",
    applicantName: "",
    cinNumber: "",
    cinIssueDate: "",
    cinIssueLocation: "",
    residenceCommune: "",
    village: "",
    commune: "",
    residenceDistrict: "",
    region: "",
    purchaseCommune: "",
    verificationDate: today,
    arreteDate: today,
  }), [today]);
  
  const createMutation = useCreatePassport({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Passeport créé avec succès" });
      navigate('/admin/passports');
    },
    onError: (error) => {
      console.error('Error creating passport:', error);
      uiToast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
    },
  });
  
  const handleSubmit = (data: PassportFormValues, selectedCattleIds: string[]) => {
    if (selectedCattleIds.length === 0) {
      uiToast({ title: "Erreur", description: "Veuillez sélectionner au moins un bœuf", variant: "destructive" });
      return;
    }
    
    const createData: CreatePassportDto = {
      ...data,
      herdBookId: selectedHerdBookId || '',
      totalCattle: selectedCattleIds.length,
      cattleIds: selectedCattleIds,
    };
    
    createMutation.mutate(createData);
  };
  
  const handleCancel = () => {
    navigate('/admin/passports');
  };
  
  if (!selectedHerdBookId) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Veuillez sélectionner un livre de troupeau</p>
          </div>
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
          <h1 className="text-2xl sm:text-3xl font-bold">Nouveau Passeport Bovin</h1>
          <p className="text-muted-foreground mt-2">Créer un nouveau passeport pour le livre de troupeau sélectionné</p>
        </div>
      </div>
      
      <PassportForm
        mode="create"
        initialData={initialData}
        herdBookId={selectedHerdBookId}
        initialCattleIds={[]}
        herdBookCattle={herdBookCattle}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isPending={createMutation.isPending}
      />
    </div>
  );
};

export default PassportCreatePage;
