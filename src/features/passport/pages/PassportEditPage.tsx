import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CreatePassportDto } from "../types/passport.types";
import { usePassport, useUpdatePassport } from "../hooks";
import { useHerdBookCattle } from "@/features/herdbook/hooks";
import PassportForm, { PassportFormValues } from "../components/PassportForm";
import { getTodayDate } from "@/utils/dateUtils";

const PassportEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();
  
  const { data: passport, isLoading, error } = usePassport(id!);
  
  const { data: herdBookCattleData } = useHerdBookCattle(passport?.herdBookId || '', 1, 50);
  const herdBookCattle = herdBookCattleData?.data ?? [];
  
  const today = getTodayDate();
  
  const initialData = useMemo(() => {
    if (!passport) return null;
    return {
      passportNumber: passport.passportNumber || "",
      location: passport.location || "",
      issueDate: passport.issueDate || today,
      district: passport.district || "",
      applicantName: passport.applicantName || passport.applicant?.name || "",
      cinNumber: passport.cinNumber || passport.applicant?.cinNumber || "",
      cinIssueDate: passport.cinIssueDate || passport.applicant?.cinIssueDate || "",
      cinIssueLocation: passport.cinIssueLocation || passport.applicant?.cinIssueLocation || "",
      residenceCommune: typeof passport.residenceCommune === 'string' ? passport.residenceCommune : passport.residenceCommune?.name || passport.residenceCommuneLegacy || "",
      village: typeof passport.village === 'string' ? passport.village : passport.village?.name || passport.villageLegacy || "",
      commune: typeof passport.commune === 'string' ? passport.commune : passport.commune?.name || passport.communeLegacy || "",
      residenceDistrict: typeof passport.residenceDistrict === 'string' ? passport.residenceDistrict : passport.residenceDistrict?.name || passport.residenceDistrictLegacy || "",
      region: typeof passport.region === 'string' ? passport.region : passport.region?.name || passport.regionLegacy || "",
      purchaseCommune: passport.purchaseCommune || "",
      verificationDate: passport.verificationDate || today,
      arreteDate: passport.arreteDate || today,
    };
  }, [passport, today]);

  const initialCattleIds = useMemo(() => {
    return passport?.cattle?.map(hbc => hbc.herdBookCattleId) || [];
  }, [passport]);
  
  const updateMutation = useUpdatePassport({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Passeport mis à jour avec succès" });
      navigate('/admin/passports');
    },
    onError: (error) => {
      console.error('Error updating passport:', error);
      uiToast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });
  
  const handleSubmit = (data: PassportFormValues, selectedCattleIds: string[]) => {
    if (selectedCattleIds.length === 0) {
      uiToast({ title: "Erreur", description: "Veuillez sélectionner au moins un bœuf", variant: "destructive" });
      return;
    }
    
    const updateData: Partial<CreatePassportDto> = {
      ...data,
      totalCattle: selectedCattleIds.length,
      cattleIds: selectedCattleIds,
    };
    
    updateMutation.mutate({ id: id!, data: updateData });
  };
  
  const handleCancel = () => {
    navigate('/admin/passports');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error || !passport || !initialData) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Passeport introuvable</p>
          </div>
        </div>
        <Button onClick={handleCancel}>
          Retour à la liste
        </Button>
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
          <h1 className="text-2xl sm:text-3xl font-bold">Modifier le Passeport</h1>
          <p className="text-muted-foreground mt-2">Modifier les informations du passeport {passport.passportNumber}</p>
        </div>
      </div>
      
      <PassportForm
        mode="edit"
        initialData={initialData}
        herdBookId={passport.herdBookId}
        initialCattleIds={initialCattleIds}
        herdBookCattle={herdBookCattle}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isPending={updateMutation.isPending}
      />
    </div>
  );
};

export default PassportEditPage;
