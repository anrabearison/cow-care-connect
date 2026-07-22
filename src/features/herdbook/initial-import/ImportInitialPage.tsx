import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useImportLogic } from './hooks/useImportLogic';
import { ImportForm } from './components/ImportForm';
import { CsvUpload } from './components/CsvUpload';
import { ValidationResults } from './components/ValidationResults';
import { Confirmation } from './components/Confirmation';
import { ImportSuccess } from './components/ImportSuccess';
import { ImportCompletedModal } from './components/ImportCompletedModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';
import { useEffect, useState } from 'react';
import type { InitialImportFormData } from './schemas/initialImport.schema';

/**
 * Page principale pour l'import initial HerdBook
 * Orchestre le workflow multi-étapes avec validation et confirmation
 */
const ImportInitialContent = () => {
  const { hasCompletedInitialImport, availableHerdBooks } = useHerdBookSelection();
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  // Vérifier si l'import initial est déjà complété et afficher la modal
  useEffect(() => {
    if (hasCompletedInitialImport) {
      setShowCompletedModal(true);
    }
  }, [hasCompletedInitialImport]);

  const {
    step,
    csvFile,
    dryRunResult,
    importResult,
    form,
    dryRunMutation,
    confirmMutation,
    handleFileSelect,
    handleDryRun,
    handleConfirm,
    handleBack,
    handleReset,
    canProceed,
    isLoading,
  } = useImportLogic();

  const handleFormSubmit = (data: InitialImportFormData) => {
    if (csvFile) {
      handleDryRun();
    }
  };

  const handleFileRemove = () => {
    handleReset();
  };

  const handleBackToForm = () => {
    handleBack();
  };

  const handleConfirmImport = () => {
    handleConfirm();
  };

  return (
    <div className="min-h-screen bg-gradient-earth p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            aria-label="Retourner à la page précédente"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Import Initial</h1>
            <p className="text-muted-foreground">
              Créez votre premier livre de troupeau et initialisez votre troupeau via CSV
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2" role="progressbar" aria-valuenow={['form', 'upload', 'validation', 'confirm', 'success'].indexOf(step) + 1} aria-valuemin={1} aria-valuemax={5} aria-label="Progression de l'import">
          {['form', 'upload', 'validation', 'confirm', 'success'].map((s, index) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                step === s ? 'bg-primary' : 'bg-muted'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Main Content */}
        {isLoading && (
          <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <span className="ml-2">Traitement en cours...</span>
          </div>
        )}

        {!isLoading && step === 'success' && importResult && (
          <div className="max-w-xl mx-auto">
            <ImportSuccess result={importResult} />
          </div>
        )}

        {!isLoading && step !== 'success' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <ImportForm
              form={form}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />

            {/* Right Column - Dynamic Content */}
            <div className="space-y-6">
              {step === 'form' && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-center">
                    Remplissez le formulaire à gauche, puis sélectionnez un fichier CSV pour continuer.
                  </p>
                </div>
              )}

              {step === 'upload' && (
                <CsvUpload
                  onFileSelect={handleFileSelect}
                  onRemove={handleFileRemove}
                  selectedFile={csvFile}
                  isLoading={isLoading}
                />
              )}

              {step === 'validation' && dryRunResult && (
                <ValidationResults
                  result={dryRunResult}
                  onBack={handleBackToForm}
                  onConfirm={handleConfirmImport}
                  isLoading={isLoading}
                />
              )}

              {step === 'confirm' && dryRunResult && (
                <Confirmation
                  herdBookData={form.getValues()}
                  cattleCount={dryRunResult.validRowsCount}
                  onConfirm={handleConfirmImport}
                  onBack={handleBackToForm}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isLoading}
            aria-label="Réinitialiser le formulaire"
          >
            Réinitialiser
          </Button>
          {step === 'upload' && csvFile && canProceed() && (
            <Button
              onClick={handleDryRun}
              disabled={isLoading}
              aria-label="Valider le fichier CSV"
            >
              Valider le CSV
            </Button>
          )}
        </div>
      </div>

      {/* Modal pour import déjà complété */}
      <ImportCompletedModal
        open={showCompletedModal}
        onClose={() => setShowCompletedModal(false)}
        herdBookName={availableHerdBooks[0]?.reference}
        herdBookId={availableHerdBooks[0]?.id}
        cattleCount={availableHerdBooks[0]?.cattle_count}
      />
    </div>
  );
};

/**
 * Page ImportInitial avec Error Boundary
 * Protège contre les crashes et fournit une UI de récupération
 */
export const ImportInitialPage = () => {
  return (
    <ErrorBoundary>
      <ImportInitialContent />
    </ErrorBoundary>
  );
};

export default ImportInitialPage;
