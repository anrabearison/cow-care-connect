import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ImportConfirmResult } from '../schemas/initialImport.schema';
import type { InitialImportFormData } from '../schemas/initialImport.schema';

interface ConfirmationProps {
  herdBookData: InitialImportFormData;
  cattleCount: number;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const Confirmation = ({ herdBookData, cattleCount, onConfirm, onBack, isLoading = false }: ConfirmationProps) => {
  return (
    <Card role="region" aria-labelledby="confirm-title" aria-live="polite">
      <CardHeader>
        <CardTitle id="confirm-title" className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
          Confirmation de l'import
        </CardTitle>
        <CardDescription>
          Vérifiez les informations avant de confirmer l'import initial.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>
            <strong>Action irréversible:</strong> Cet import créera votre premier HerdBook et initialisera
            votre troupeau. Cette action ne peut être effectuée qu'une seule fois par propriétaire.
          </AlertDescription>
        </Alert>

        <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
          <h3 className="font-semibold text-sm">Résumé de l'import</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Référence:</span>
              <p className="font-medium">{herdBookData.reference}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Année:</span>
              <p className="font-medium">{herdBookData.year}</p>
            </div>
            {herdBookData.description && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Description:</span>
                <p className="font-medium">{herdBookData.description}</p>
              </div>
            )}
            <div className="col-span-2">
              <span className="text-muted-foreground">Bovins à importer:</span>
              <p className="font-medium text-lg">{cattleCount}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            aria-label="Retourner à l'étape précédente"
          >
            Retour
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label="Confirmer et lancer l'import"
          >
            {isLoading ? 'Import en cours...' : 'Confirmer l\'import'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
