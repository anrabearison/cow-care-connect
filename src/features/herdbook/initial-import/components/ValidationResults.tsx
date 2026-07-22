import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DryRunResult } from '../schemas/initialImport.schema';

interface ValidationResultsProps {
  result: DryRunResult;
  onBack: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ValidationResults = ({ result, onBack, onConfirm, isLoading = false }: ValidationResultsProps) => {
  const isValid = result.valid;
  const errorCount = result.errors.length;
  const validCount = result.validRowsCount;
  const totalCount = result.totalRows;

  return (
    <Card role="region" aria-labelledby="validation-title" aria-live="polite">
      <CardHeader>
        <CardTitle id="validation-title" className="flex items-center gap-2">
          {isValid ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
              Validation réussie
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
              Erreurs détectées
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isValid
            ? `${validCount} ligne(s) valide(s) sur ${totalCount}`
            : `${errorCount} erreur(s) trouvée(s) sur ${totalCount} lignes`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isValid && result.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>
              Veuillez corriger les erreurs ci-dessous avant de confirmer l'import.
            </AlertDescription>
          </Alert>
        )}

        {result.errors.length > 0 ? (
          <div className="border rounded-lg overflow-hidden" role="region" aria-label="Tableau des erreurs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Ligne</TableHead>
                  <TableHead>Champ</TableHead>
                  <TableHead>Erreur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.errors.map((error, index) => (
                  <TableRow key={`${error.rowNumber}-${error.field}-${index}`}>
                    <TableCell className="font-medium">{error.rowNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{error.field}</TableCell>
                    <TableCell className="text-destructive">{error.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
            <AlertDescription>
              Toutes les données sont valides. Vous pouvez procéder à l'import.
            </AlertDescription>
          </Alert>
        )}

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
          {isValid && (
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label="Confirmer l'import des données"
            >
              {isLoading ? 'Import en cours...' : 'Confirmer l\'import'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
