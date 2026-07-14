import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCattleById, useUpdateCattle } from '@/features/cattle/hooks';
import { Cattle } from '@/features/cattle/types';
import { useCattleReferenceData } from '../../hooks/useCattleReferenceData';
import CattleForm, { CattleFormState } from './CattleForm';

const CattleEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { cattle, loading, error } = useCattleById(id || '');
  const { characters, isLoading: isReferencesLoading, isError, errors, refetch } = useCattleReferenceData();
  const updateCattleMutation = useUpdateCattle();
  const [formData, setFormData] = useState<CattleFormState>({
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
  });

  useEffect(() => {
    if (cattle) {
      setFormData({
        name: cattle.name || '',
        nickname: cattle.nickname || '',
        gender: cattle.gender || '',
        birthDate: cattle.birthDate || '',
        characterId: cattle.character?.id || '',
        brand: cattle.brand || '',
        distinctiveSign: cattle.distinctiveSign || '',
        nCarnet: cattle.nCarnet || '',
        sourceType: cattle.source?.type || 'ACHETE',
        motherId: cattle.motherId || '',
        fatherId: cattle.fatherId || '',
        purchaseSupplier: cattle.source?.supplier || '',
        purchaseDate: cattle.source?.purchaseDate || '',
        purchasePrice: cattle.source?.purchasePrice?.toString() || '',
        purchaseWeight: cattle.source?.purchaseWeight?.toString() || '',
        purchaseHealthStatus: cattle.source?.purchaseHealthStatus || '',
        purchaseNotes: cattle.source?.purchaseNotes || '',
      });
    }
  }, [cattle]);

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger les données de référence.',
        variant: 'destructive',
      });
    }
  }, [isError, errors, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cattle) return;

    const payload: Partial<Cattle> = {
      name: formData.name,
      nickname: formData.nickname || undefined,
      gender: formData.gender as 'M' | 'F',
      birthDate: formData.birthDate,
      character: formData.characterId ? { id: formData.characterId, name: characters.find((char) => char.id === formData.characterId)?.name || 'Docile' } : undefined,
      brand: formData.brand || undefined,
      distinctiveSign: formData.distinctiveSign || undefined,
      nCarnet: formData.nCarnet || undefined,
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

    updateCattleMutation.mutate({ id: cattle.id, data: payload }, {
      onSuccess: () => navigate('/admin/cattle'),
    });
  };

  const handleCancel = () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues.')) {
      navigate('/admin/cattle');
    }
  };

  if (loading || isReferencesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !cattle) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
          <p className="text-muted-foreground mt-2">Bovin introuvable</p>
        </div>
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
        mode="edit"
        formData={formData}
        setFormData={setFormData}
        characters={characters}
        isPending={updateCattleMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={updateCattleMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
      />
    </div>
  );
};

export default CattleEditPage;
