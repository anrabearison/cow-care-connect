import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCreateCattle } from '@/features/cattle/hooks';
import { Cattle } from '@/features/cattle/types';
import { useCattleReferenceData } from '../../hooks/useCattleReferenceData';
import CattleForm, { CattleFormState } from './CattleForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

const initialFormState: CattleFormState = {
  name: '',
  nickname: '',
  gender: '',
  birthDate: '',
  characterId: '',
  brand: '',
  distinctiveSign: '',
  nCarnet: '',
  sourceType: 'ACHETE',
  motherId: '',
  fatherId: '',
  purchaseSupplier: '',
  purchaseDate: '',
  purchasePrice: '',
  purchaseWeight: '',
  purchaseHealthStatus: '',
  purchaseNotes: '',
};

const CattleCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCattleMutation = useCreateCattle();
  const { characters, herdBooks, isLoading, isError, errors, refetch } = useCattleReferenceData();
  const [formData, setFormData] = useState<CattleFormState>(initialFormState);
  const [errorsState, setErrorsState] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<CattleFormState | null>(null);

  useEffect(() => {
    if (isError) {
      const errorMessages = [] as string[];
      if (errors.characters) errorMessages.push('caractères');
      if (errors.herdBooks) errorMessages.push('livres de troupeau');
      toast({
        title: 'Erreur de chargement',
        description: `Impossible de charger les données de référence (${errorMessages.join(', ')}).`,
        variant: 'destructive',
      });
    }
  }, [isError, errors, toast]);

  const defaultHerdBookId = useMemo(() => herdBooks[0]?.id || '', [herdBooks]);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name) nextErrors.name = 'Le nom est obligatoire';
    if (!formData.gender) nextErrors.gender = 'Le sexe est obligatoire';
    if (!formData.birthDate) nextErrors.birthDate = 'La date de naissance est obligatoire';
    setErrorsState(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setPendingData(formData);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmCreate = () => {
    if (!pendingData) return;

    const cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'> = {
      name: pendingData.name,
      nickname: pendingData.nickname || undefined,
      gender: pendingData.gender as 'M' | 'F',
      birthDate: pendingData.birthDate,
      character: pendingData.characterId
        ? { id: pendingData.characterId, name: characters.find((char) => char.id === pendingData.characterId)?.name || 'Docile' }
        : undefined,
      brand: pendingData.brand || undefined,
      distinctiveSign: pendingData.distinctiveSign || undefined,
      photo: undefined,
      motherId: pendingData.sourceType === 'NE_DANS_TROUPEAU' && pendingData.motherId ? pendingData.motherId : undefined,
      fatherId: pendingData.sourceType === 'NE_DANS_TROUPEAU' && pendingData.fatherId ? pendingData.fatherId : undefined,
      source: {
        type: pendingData.sourceType,
        supplier: pendingData.sourceType === 'ACHETE' ? pendingData.purchaseSupplier : undefined,
        purchaseDate: pendingData.sourceType === 'ACHETE' && pendingData.purchaseDate ? pendingData.purchaseDate : undefined,
        purchasePrice: pendingData.sourceType === 'ACHETE' && pendingData.purchasePrice ? parseFloat(pendingData.purchasePrice) : undefined,
        purchaseWeight: pendingData.sourceType === 'ACHETE' && pendingData.purchaseWeight ? parseFloat(pendingData.purchaseWeight) : undefined,
        purchaseHealthStatus: pendingData.sourceType === 'ACHETE' ? pendingData.purchaseHealthStatus : undefined,
        purchaseNotes: pendingData.sourceType === 'ACHETE' ? pendingData.purchaseNotes : undefined,
      },
    };

    createCattleMutation.mutate({
      cattle: cattleData,
      herdBookId: defaultHerdBookId || undefined,
      nCarnet: pendingData.nCarnet || undefined,
    });
    setIsConfirmDialogOpen(false);
    setPendingData(null);
  };

  const handleCancel = () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues.')) {
      navigate('/admin/cattle');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {isError && (
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

      <CattleForm
        mode="create"
        formData={formData}
        setFormData={setFormData}
        characters={characters}
        isPending={createCattleMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        errors={errorsState}
        submitLabel={createCattleMutation.isPending ? 'Création...' : 'Créer'}
      />

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Créer un bovin"
        description={`Êtes-vous sûr de vouloir créer le bovin "${pendingData?.name}" ?`}
        onConfirm={handleConfirmCreate}
        confirmText="Créer"
        cancelText="Annuler"
        loading={createCattleMutation.isPending}
      />
    </div>
  );
};

export default CattleCreatePage;
