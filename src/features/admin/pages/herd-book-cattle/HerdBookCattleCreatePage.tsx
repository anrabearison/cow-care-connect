import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CattlePhotosInput, CattlePhotoInputValue } from "@/features/cattle/components/CattlePhotosInput";
import { herdBookCattleService, CreateHerdBookCattleData, CattleData } from "@/features/admin/services/herdBookCattleService";
import { cattleService } from "@/features/cattle/services";
import { ArrowLeft } from "lucide-react";
import { queryKeys } from "@/lib/queryKeys";
import HerdBookCattleForm from "./HerdBookCattleForm";
import { useHerdBookCattleReferenceData } from "../../hooks/useHerdBookCattleReferenceData";

const HerdBookCattleCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { herdBooks, categories, statuses, isLoading: isLoadingRef, isError: isErrorRef, errors, refetch } = useHerdBookCattleReferenceData();
  
  const [unregisteredCattle, setUnregisteredCattle] = useState<{ id: string; name: string }[]>([]);
  const [cattleSourceType, setCattleSourceType] = useState<'existing' | 'new'>('existing');
  const [newCattlePhotos, setNewCattlePhotos] = useState<CattlePhotoInputValue[]>([]);
  const hasExistingCattleOptions = unregisteredCattle.length > 0;
  
  const [formData, setFormData] = useState<CreateHerdBookCattleData>({ 
    herdBookId: "", 
    cattleId: "", 
    nCarnet: "", 
    categoryId: "", 
    statusId: "" 
  });
  
  const [newCattleData, setNewCattleData] = useState<CattleData>({
    name: '',
    nickname: '',
    gender: '',
    birthDate: '',
    character: '',
    brand: '',
    distinctiveSign: '',
    photo: '',
    source: { type: 'ACHETE' },
  });

  const createMutation = useMutation({
    mutationFn: herdBookCattleService.createHerdBookCattle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBookCattle.lists() });
      toast({ title: "Succès", description: "Inscription créée avec succès" });
      navigate('/admin/herd-book-cattle');
    },
    onError: (error) => {
      console.error('Error creating herd book cattle:', error);
      toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
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

          if (options.length === 0) {
            setCattleSourceType('new');
          }
        }
      } catch (error) {
        console.error('Error loading unregistered cattle:', error);
        setUnregisteredCattle([]);
      }
    };

    loadUnregisteredCattle();
  }, [formData.herdBookId]);

  // Set defaults on mount
  useEffect(() => {
    const mostRecentHerdBook = herdBooks[0];
    const defaultHerdBook = mostRecentHerdBook?.id || "";
    
    const defaultStatus = statuses.find(s => 
      s.name?.toLowerCase().includes('bonne santé')
    ) || statuses[0];
    
    const statusId = defaultStatus?.id || "";
    
    setFormData(prev => {
      if (prev.herdBookId === defaultHerdBook && prev.statusId === statusId && prev.categoryId === "") {
        return prev;
      }
      return { ...prev, herdBookId: defaultHerdBook, statusId, categoryId: "" };
    });
    
    setCattleSourceType(prev => {
      const expected = hasExistingCattleOptions ? 'existing' : 'new';
      return prev === expected ? prev : expected;
    });
  }, [herdBooks, statuses, hasExistingCattleOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
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

    const submitData: CreateHerdBookCattleData = { ...formData };

    if (cattleSourceType === 'new') {
      if (!newCattleData.name) {
        toast({ title: "Erreur", description: "Veuillez entrer le nom du bovin", variant: "destructive" });
        return;
      }
      if (!newCattleData.gender) {
        toast({ title: "Erreur", description: "Veuillez sélectionner le sexe du bovin", variant: "destructive" });
        return;
      }
      if (!newCattleData.birthDate) {
        toast({ title: "Erreur", description: "Veuillez entrer la date de naissance", variant: "destructive" });
        return;
      }
      submitData.cattle = {
        ...newCattleData,
        photos: newCattlePhotos,
        photo: newCattlePhotos.find(photo => photo.isPrimary)?.url || newCattlePhotos[0]?.url || '',
      };
      submitData.cattleId = undefined;
    } else {
      if (!formData.cattleId) {
        toast({ title: "Erreur", description: "Veuillez sélectionner un bovin", variant: "destructive" });
        return;
      }
    }

    createMutation.mutate(submitData);
  };

  const handleCancel = () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues.")) {
      navigate('/admin/herd-book-cattle');
    }
  };

  const isFormDirty = formData.herdBookId || formData.categoryId || formData.statusId || 
    (cattleSourceType === 'existing' ? formData.cattleId : newCattleData.name);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => isFormDirty ? handleCancel() : navigate('/admin/herd-book-cattle')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nouvelle inscription bovine</h1>
          <p className="text-muted-foreground mt-2">Créer une nouvelle inscription dans le livre de troupeau</p>
        </div>
      </div>

      {isLoadingRef && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Chargement des données de référence...</p>
          </div>
        </div>
      )}

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

      {!isLoadingRef && !isErrorRef && (
        <>
          {!hasExistingCattleOptions && (
            <p className="text-sm text-muted-foreground">
              Aucun bovin non inscrit n'est disponible pour ce livre de troupeau. Le formulaire utilisera automatiquement le mode « Nouveau bovin ».
            </p>
          )}

          <HerdBookCattleForm
            mode="create"
            formData={formData}
            setFormData={setFormData}
            herdBooks={herdBooks}
            categories={categories}
            statuses={statuses}
            unregisteredCattle={unregisteredCattle}
            cattleSourceType={cattleSourceType}
            setCattleSourceType={setCattleSourceType}
            newCattleData={newCattleData}
            setNewCattleData={setNewCattleData}
            newCattlePhotos={newCattlePhotos}
            setNewCattlePhotos={setNewCattlePhotos}
            hasExistingCattleOptions={hasExistingCattleOptions}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isPending={createMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default HerdBookCattleCreatePage;
