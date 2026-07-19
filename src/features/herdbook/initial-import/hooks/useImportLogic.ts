import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { initialImportSchema, type InitialImportFormData, type DryRunResult, type ImportConfirmResult } from '../schemas/initialImport.schema';
import { queryKeys } from '@/lib/queryKeys';
import { herdBookService } from '@/features/herdbook/services';

/**
 * Hook principal pour la logique d'import initial HerdBook
 * Gère le formulaire, l'upload CSV, la validation et la confirmation
 */
export const useImportLogic = () => {
  const [step, setStep] = useState<'form' | 'upload' | 'validation' | 'confirm'>('form');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Formulaire React Hook Form avec validation Zod
  const form = useForm<InitialImportFormData>({
    resolver: zodResolver(initialImportSchema),
    defaultValues: {
      reference: '',
      description: '',
      year: new Date().getFullYear(),
    },
    mode: 'onChange',
  });

  // Mutation pour le dry-run
  const dryRunMutation = useMutation({
    mutationFn: async (data: { herdBookData: InitialImportFormData; file: File }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('reference', data.herdBookData.reference);
      formData.append('year', data.herdBookData.year.toString());
      if (data.herdBookData.description) {
        formData.append('description', data.herdBookData.description);
      }

      return herdBookService.dryRunInitialImport(formData);
    },
    onSuccess: (result: DryRunResult) => {
      setDryRunResult(result);
      if (result.valid) {
        setStep('confirm');
        toast({
          title: 'Validation réussie',
          description: `${result.validRowsCount} lignes valides sur ${result.totalRows}`,
        });
      } else {
        setStep('validation');
        toast({
          variant: 'destructive',
          title: 'Erreurs détectées',
          description: `${result.errors.length} erreur(s) à corriger`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erreur de validation',
        description: error.message,
      });
    },
  });

  // Mutation pour la confirmation
  const confirmMutation = useMutation({
    mutationFn: async (data: { herdBookData: InitialImportFormData; file: File }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('reference', data.herdBookData.reference);
      formData.append('year', data.herdBookData.year.toString());
      if (data.herdBookData.description) {
        formData.append('description', data.herdBookData.description);
      }

      return herdBookService.confirmInitialImport(formData);
    },
    onSuccess: (result: ImportConfirmResult) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.herdBooks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.owners.all });
      toast({
        title: 'Import réussi',
        description: `${result.cattleCount} bovins importés dans le HerdBook`,
      });
      setStep('confirm');
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erreur d\'import',
        description: error.message,
      });
    },
  });

  // Handler pour la sélection de fichier CSV
  const handleFileSelect = useCallback((file: File) => {
    // Validation côté client
    if (!file.name.endsWith('.csv')) {
      toast({
        variant: 'destructive',
        title: 'Fichier invalide',
        description: 'Le fichier doit être au format CSV',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Fichier trop volumineux',
        description: 'Le fichier ne doit pas dépasser 5 Mo',
      });
      return;
    }

    setCsvFile(file);
    setStep('upload');
  }, [toast]);

  // Handler pour le dry-run
  const handleDryRun = useCallback(async () => {
    const herdBookData = form.getValues();
    if (!csvFile) {
      toast({
        variant: 'destructive',
        title: 'Fichier manquant',
        description: 'Veuillez sélectionner un fichier CSV',
      });
      return;
    }

    await dryRunMutation.mutateAsync({ herdBookData, file: csvFile });
  }, [form, csvFile, dryRunMutation, toast]);

  // Handler pour la confirmation
  const handleConfirm = useCallback(async () => {
    const herdBookData = form.getValues();
    if (!csvFile) {
      toast({
        variant: 'destructive',
        title: 'Fichier manquant',
        description: 'Veuillez sélectionner un fichier CSV',
      });
      return;
    }

    await confirmMutation.mutateAsync({ herdBookData, file: csvFile });
  }, [form, csvFile, confirmMutation, toast]);

  // Handler pour revenir à l'étape précédente
  const handleBack = useCallback(() => {
    if (step === 'validation') {
      setStep('upload');
    } else if (step === 'confirm') {
      setStep('validation');
    }
  }, [step]);

  // Handler pour réinitialiser le formulaire
  const handleReset = useCallback(() => {
    form.reset();
    setCsvFile(null);
    setDryRunResult(null);
    setCsvData([]);
    setStep('form');
  }, [form]);

  // Vérifie si on peut passer à l'étape suivante
  const canProceed = useCallback(() => {
    const herdBookData = form.getValues();
    return form.formState.isValid && csvFile !== null;
  }, [form.formState.isValid, csvFile]);

  return {
    // État
    step,
    csvFile,
    dryRunResult,
    csvData,
    
    // Formulaire
    form,
    
    // Mutations
    dryRunMutation,
    confirmMutation,
    
    // Handlers
    handleFileSelect,
    handleDryRun,
    handleConfirm,
    handleBack,
    handleReset,
    
    // Utilitaires
    canProceed,
    isLoading: dryRunMutation.isPending || confirmMutation.isPending,
  };
};
