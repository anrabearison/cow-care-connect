import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ImportConfirmResult } from '../schemas/initialImport.schema';

interface ImportSuccessProps {
  result: ImportConfirmResult;
}

/**
 * Écran de succès affiché une fois l'import réellement confirmé et terminé.
 * Distinct de l'écran de confirmation pour éviter qu'un bouton "Confirmer l'import"
 * reste actif après que l'import a déjà eu lieu (action irréversible, à usage unique).
 */
export const ImportSuccess = ({ result }: ImportSuccessProps) => {
  return (
    <Card role="region" aria-labelledby="success-title" aria-live="polite">
      <CardHeader>
        <CardTitle id="success-title" className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
          Import terminé
        </CardTitle>
        <CardDescription>
          Votre HerdBook a été créé et votre troupeau initialisé avec succès.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 border rounded-lg p-4 bg-green-50 border-green-200">
          <div>
            <span className="text-muted-foreground text-sm">Bovins importés:</span>
            <p className="font-medium text-2xl">{result.cattleCount}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button asChild aria-label="Consulter le livre de troupeau créé">
            <Link to={`/admin/herd-books/${result.herdBookId}`}>
              Voir le livre de troupeau
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
