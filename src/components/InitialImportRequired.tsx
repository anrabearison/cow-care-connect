import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';

interface InitialImportRequiredProps {
  children: React.ReactNode;
}

/**
 * Composant qui protège les routes nécessitant un import initial complété
 * Redirige vers la page d'import initial si l'utilisateur n'a pas encore de HerdBook
 */
export const InitialImportRequired = ({ children }: InitialImportRequiredProps) => {
  const { hasCompletedInitialImport, isLoading } = useHerdBookSelection();
  const navigate = useNavigate();

  useEffect(() => {
    // Si le chargement est terminé et qu'il n'y a pas de HerdBook, rediriger vers l'import initial
    if (!isLoading && !hasCompletedInitialImport) {
      navigate('/herdbook/initial-import', { replace: true });
    }
  }, [hasCompletedInitialImport, isLoading, navigate]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification de l'import initial...</p>
        </div>
      </div>
    );
  }

  // Si l'import initial n'est pas complété, ne rien afficher (la redirection se fera)
  if (!hasCompletedInitialImport) {
    return null;
  }

  // Si l'import initial est complété, afficher les enfants
  return <>{children}</>;
};
