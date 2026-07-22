import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { herdBookCattleService, HerdBookCattle, UpdateHerdBookCattleData } from "@/features/admin/services/herdBookCattleService";
import { cattleService } from "@/features/cattle/services";
import { ArrowLeft, Loader2 } from "lucide-react";
import { queryKeys } from "@/lib/queryKeys";
import HerdBookCattleForm from "./HerdBookCattleForm";
import { useHerdBookCattleReferenceData } from "../../hooks/useHerdBookCattleReferenceData";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const HerdBookCattleEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<UpdateHerdBookCattleData | null>(null);
  
  const { herdBooks, categories, statuses, isLoading: isLoadingRef, isError: isErrorRef, errors, refetch } = useHerdBookCattleReferenceData();
  
  const [unregisteredCattle, setUnregisteredCattle] = useState<{ id: string; name: string }[]>([]);
  
  const [formData, setFormData] = useState<UpdateHerdBookCattleData>({ 
    herdBookId: "", 
    cattleId: "", 
    nCarnet: undefined as unknown as number, 
    categoryId: "", 
    statusId: "" 
  });

  const { data: item, isLoading, error } = useQuery({
    queryKey: queryKeys.herdBookCattle.details(id!),
    queryFn: () => herdBookCattleService.getHerdBookCattleById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHerdBookCattleData }) => 
      herdBookCattleService.updateHerdBookCattle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBookCattle.lists() });
      toast({ title: "Succès", description: "Inscription mise à jour avec succès" });
      navigate('/admin/herd-book-cattle');
    },
    onError: (error) => {
      console.error('Error updating herd book cattle:', error);
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  // Show error if reference data failed to load
  useEffect(() => {
    if (isErrorRef) {
      const errorMessages = [];
      if (errors.herdBooks) errorMessages.push("livres de troupeau");
      if (errors.categories) errorMessages.push("catégories");
      if (errors.statuses) errorMessages.push("statuts");
      
      toast({
        title: "Erreur de chargement",
        description: `Impossible de charger les données de référence (${errorMessages.join(', ')}). Veuillez réessayer.`,
        variant: "destructive"
      });
    }
  }, [isErrorRef, errors, toast]);

  // Load unregistered cattle when herdBookId changes
  useEffect(() => {
    const loadUnregisteredCattle = async () => {
      if (!formData.herdBookId) {
        setUnregisteredCattle([]);
        return;
      }
      try {
        const response = await cattleService.getCattleList({
          excludedHerdBookId: formData.herdBookId,
          page: 1,
          per_page: 50,
        });

        if (response.success && response.data) {
          const options = (response.data as Array<{ id: string; name: string }>).map(c => ({
            id: c.id,
            name: c.name || 'Bovin sans nom',
          }));
          setUnregisteredCattle(options);
        }
      } catch (error) {
        console.error('Error loading unregistered cattle:', error);
        setUnregisteredCattle([]);
      }
    };

    loadUnregisteredCattle();
  }, [formData.herdBookId]);

  // Pre-fill form when data is loaded
  useEffect(() => {
    if (item?.data) {
      setFormData({
        herdBookId: item.data.herdBookId,
        cattleId: item.data.cattleId || "",
        nCarnet: item.data.nCarnet || undefined as unknown as number,
        categoryId: item.data.categoryId,
        statusId: item.data.statusId,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.herdBookId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un livre de troupeau", variant: "destructive" });
      return;
    }

    if (!formData.categoryId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une catégorie", variant: "destructive" });
      return;
    }

    if (!formData.statusId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un statut", variant: "destructive" });
      return;
    }

    setPendingData(formData);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (!pendingData || !id) return;
    updateMutation.mutate({ id: id!, data: pendingData });
    setIsConfirmDialogOpen(false);
    setPendingData(null);
  };

  const handleCancel = () => {
    const isFormDirty = formData.herdBookId || formData.categoryId || formData.statusId || formData.nCarnet;
    if (isFormDirty) {
      if (window.confirm("Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues.")) {
        navigate('/admin/herd-book-cattle');
      }
    } else {
      navigate('/admin/herd-book-cattle');
    }
  };

  if (isLoading || isLoadingRef) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !item?.data) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/herd-book-cattle')} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Inscription introuvable</p>
          </div>
        </div>
        <Button onClick={() => navigate('/admin/herd-book-cattle')}>
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
          <h1 className="text-2xl sm:text-3xl font-bold">Modifier l'inscription</h1>
          <p className="text-muted-foreground mt-2">Modifier les informations de l'inscription</p>
        </div>
      </div>

      {isErrorRef && (
        <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <div>
            <p className="font-medium text-destructive">Erreur de chargement des données de référence</p>
            <p className="text-sm text-muted-foreground mt-1">Veuillez réessayer pour continuer.</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Réessayer
          </Button>
        </div>
      )}

      <HerdBookCattleForm
        mode="edit"
        formData={formData}
        setFormData={setFormData}
        herdBooks={herdBooks}
        categories={categories}
        statuses={statuses}
        unregisteredCattle={unregisteredCattle}
        cattleIdDisabled={true}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isPending={updateMutation.isPending}
      />

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Modifier l'inscription"
        description="Êtes-vous sûr de vouloir modifier cette inscription dans le livre de troupeau ?"
        onConfirm={handleConfirmUpdate}
        confirmText="Modifier"
        cancelText="Annuler"
        loading={updateMutation.isPending}
      />
    </div>
  );
};

export default HerdBookCattleEditPage;
