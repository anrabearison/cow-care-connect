import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCreateCattle } from '@/features/cattle/hooks';
import { Cattle } from '@/features/cattle/types';
import { useCattleReferenceData } from '../../hooks/useCattleReferenceData';
import CattleForm, { CattleFormState } from './CattleForm';

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

    const cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'> = {
      name: formData.name,
      nickname: formData.nickname || undefined,
      gender: formData.gender as 'M' | 'F',
      birthDate: formData.birthDate,
      character: formData.characterId
        ? { id: formData.characterId, name: characters.find((char) => char.id === formData.characterId)?.name || 'Docile' }
        : undefined,
      brand: formData.brand || undefined,
      distinctiveSign: formData.distinctiveSign || undefined,
      photo: undefined,
      motherId: formData.sourceType === 'NE_DANS_TROUPEAU' && formData.motherId ? formData.motherId : undefined,
      fatherId: formData.sourceType === 'NE_DANS_TROUPEAU' && formData.fatherId ? formData.fatherId : undefined,
      source: {
        type: formData.sourceType,
        supplier: formData.sourceType === 'ACHETE' ? formData.purchaseSupplier : undefined,
        purchaseDate: formData.sourceType === 'ACHETE' && formData.purchaseDate ? formData.purchaseDate : undefined,
        purchasePrice: formData.sourceType === 'ACHETE' && formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        purchaseWeight: formData.sourceType === 'ACHETE' && formData.purchaseWeight ? parseFloat(formData.purchaseWeight) : undefined,
        purchaseHealthStatus: formData.sourceType === 'ACHETE' ? formData.purchaseHealthStatus : undefined,
        purchaseNotes: formData.sourceType === 'ACHETE' ? formData.purchaseNotes : undefined,
      },
    };

    createCattleMutation.mutate({
      cattle: cattleData,
      herdBookId: defaultHerdBookId || undefined,
      nCarnet: formData.nCarnet || undefined,
    });
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
    </div>
  );
};

export default CattleCreatePage;
