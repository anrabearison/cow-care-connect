import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import PurchaseForm, { PurchaseFormValues } from "../components/PurchaseForm";
import { usePurchase, useUpdatePurchase } from "../hooks/purchasesHooks";
import { UpdatePurchaseData } from "../services/purchasesService";

const PurchaseEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();

  const { data: purchase, isLoading, error } = usePurchase(id!);

  const initialData = useMemo<PurchaseFormValues | null>(() => {
    if (!purchase) return null;
    return {
      ownerId: purchase.ownerId || "",
      purchaseDate: purchase.purchaseDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      supplierId: purchase.supplierId || "",
      invoiceNumber: purchase.invoiceNumber || "",
      healthStatus: purchase.healthStatus || "",
      notes: purchase.notes || "",
      items: purchase.items?.map((item) => ({
        cattleId: item.cattleId || "",
        price: item.price || 0,
        weightAtPurchase: item.weightAtPurchase ?? undefined,
        healthStatus: item.healthStatus || "",
      })) || [{ cattleId: "", price: 0, weightAtPurchase: undefined, healthStatus: "" }],
    };
  }, [purchase]);

  const updateMutation = useUpdatePurchase({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Achat mis à jour avec succès" });
      navigate('/admin/purchases');
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
      uiToast({ title: "Erreur", description: msg, variant: "destructive" });
    },
  });

  const handleSubmit = (data: PurchaseFormValues) => {
    const updateData: UpdatePurchaseData = {
      purchaseDate: data.purchaseDate,
      supplierId: data.supplierId || undefined,
      invoiceNumber: data.invoiceNumber || undefined,
      healthStatus: data.healthStatus || undefined,
      notes: data.notes || undefined,
      items: data.items.map((item) => ({
        cattleId: item.cattleId,
        price: item.price,
        weightAtPurchase: item.weightAtPurchase ?? undefined,
        healthStatus: item.healthStatus || undefined,
      })),
    };
    updateMutation.mutate({ id: id!, data: updateData });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !purchase || !initialData) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/purchases')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Erreur</h1>
        </div>
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive">
          Impossible de charger les données de l'achat.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/purchases')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Modifier l'achat</h1>
          <p className="text-muted-foreground mt-2">
            Achat du {new Date(purchase.purchaseDate).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <PurchaseForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/purchases')}
          isPending={updateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default PurchaseEditPage;
