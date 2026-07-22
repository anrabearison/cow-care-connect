import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCattleById, useUpdateCattle } from '@/features/cattle/hooks';
import { Cattle } from '@/features/cattle/types';
import { useCattleReferenceData } from '../../hooks/useCattleReferenceData';
import CattleForm, { CattleFormState } from './CattleForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

const CattleEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { cattle, loading, error } = useCattleById(id || '');
  const { characters, isLoading: isReferencesLoading, isError, errors, refetch } = useCattleReferenceData();
  const updateCattleMutation = useUpdateCattle();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<CattleFormState | null>(null);
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
    setPendingData(formData);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (!pendingData || !cattle) return;

    const payload: Partial<Cattle> = {
      name: pendingData.name,
      nickname: pendingData.nickname || undefined,
      gender: pendingData.gender as 'M' | 'F',
      birthDate: pendingData.birthDate,
      character: pendingData.characterId ? { id: pendingData.characterId, name: characters.find((char) => char.id === pendingData.characterId)?.name || 'Docile' } : undefined,
      brand: pendingData.brand || undefined,
      distinctiveSign: pendingData.distinctiveSign || undefined,
      nCarnet: pendingData.nCarnet || undefined,
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

    updateCattleMutation.mutate({ id: cattle.id, data: payload }, {
      onSuccess: () => navigate('/admin/cattle'),
    });
    setIsConfirmDialogOpen(false);
    setPendingData(null);
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

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Modifier le bovin"
        description={`Êtes-vous sûr de vouloir modifier le bovin "${pendingData?.name}" ?`}
        onConfirm={handleConfirmUpdate}
        confirmText="Modifier"
        cancelText="Annuler"
        loading={updateCattleMutation.isPending}
      />
    </div>
  );
};

export default CattleEditPage;
