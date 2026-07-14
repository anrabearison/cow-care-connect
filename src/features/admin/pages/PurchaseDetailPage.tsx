import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Edit, Trash2, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { usePurchase, useDeletePurchase } from "../hooks/purchasesHooks";

const PurchaseDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: purchase, isLoading, error } = usePurchase(id!);

  const deleteMutation = useDeletePurchase({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Achat supprimé avec succès" });
      navigate('/admin/purchases');
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Erreur lors de la suppression";
      uiToast({ title: "Erreur", description: msg, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !purchase) {
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

  const purchaseDateFormatted = new Date(purchase.purchaseDate).toLocaleDateString("fr-FR");

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/purchases')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Détails de l'achat
            </h1>
            <p className="text-muted-foreground mt-2">Achat du {purchaseDateFormatted}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(`/admin/purchases/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">Date d'achat</Label>
              <p className="font-medium mt-1">{purchaseDateFormatted}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Fournisseur</Label>
              <p className="font-medium mt-1">{purchase.supplier?.name || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">N° Facture</Label>
              <p className="font-medium mt-1">{purchase.invoiceNumber || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Montant total</Label>
              <p className="font-semibold mt-1 text-primary">
                {Number(purchase.totalAmount).toLocaleString("fr-FR")} Ar
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">État sanitaire</Label>
              <p className="font-medium mt-1">{purchase.healthStatus || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Notes</Label>
              <p className="font-medium mt-1 whitespace-pre-wrap">{purchase.notes || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {purchase.items && purchase.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Animaux achetés
              <Badge variant="secondary">{purchase.items.length} bovin(s)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {purchase.items.map((item, i) => (
                <div key={item.id || i} className="border rounded-lg p-4 bg-muted/30 space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Animal #{i + 1}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground text-xs">Bovin</Label>
                      <p className="font-medium">{item.cattle?.name || item.cattleId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Prix</Label>
                      <p className="font-medium">{Number(item.price).toLocaleString("fr-FR")} Ar</p>
                    </div>
                    {item.weightAtPurchase && (
                      <div>
                        <Label className="text-muted-foreground text-xs">Poids</Label>
                        <p className="font-medium">{item.weightAtPurchase} kg</p>
                      </div>
                    )}
                    {item.healthStatus && (
                      <div>
                        <Label className="text-muted-foreground text-xs">État sanitaire</Label>
                        <p className="font-medium">{item.healthStatus}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer l'achat"
        description={`Êtes-vous sûr de vouloir supprimer l'achat du ${purchaseDateFormatted} ?`}
        onConfirm={() => deleteMutation.mutate(id!)}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default PurchaseDetailPage;
