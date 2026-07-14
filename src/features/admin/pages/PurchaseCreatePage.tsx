import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import PurchaseForm, { PurchaseFormValues } from "../components/PurchaseForm";
import { useCreatePurchase } from "../hooks/purchasesHooks";
import { CreatePurchaseData } from "../services/purchasesService";

const PurchaseCreatePage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const initialData = useMemo<PurchaseFormValues>(() => ({
    ownerId: "",
    purchaseDate: today,
    supplierId: "",
    invoiceNumber: "",
    healthStatus: "",
    notes: "",
    items: [{ cattleId: "", price: 0, weightAtPurchase: undefined, healthStatus: "" }],
  }), [today]);

  const createMutation = useCreatePurchase({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Achat créé avec succès" });
      navigate('/admin/purchases');
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Erreur lors de la création";
      uiToast({ title: "Erreur", description: msg, variant: "destructive" });
    },
  });

  const handleSubmit = (data: PurchaseFormValues) => {
    const createData: CreatePurchaseData = {
      ownerId: data.ownerId,
      purchaseDate: data.purchaseDate,
      supplierId: data.supplierId || undefined,
      invoiceNumber: data.invoiceNumber || undefined,
      healthStatus: data.healthStatus || undefined,
      notes: data.notes || undefined,
      items: data.items.map((item) => ({
        cattleId: item.cattleId,
        price: item.price,
        weightAtPurchase: item.weightAtPurchase || undefined,
        healthStatus: item.healthStatus || undefined,
      })),
    };
    createMutation.mutate(createData);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/purchases')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nouvel achat de bétail</h1>
          <p className="text-muted-foreground mt-2">Enregistrer un nouvel achat</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <PurchaseForm
          mode="create"
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/purchases')}
          isPending={createMutation.isPending}
        />
      </div>
    </div>
  );
};

export default PurchaseCreatePage;
