import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ImportCompletedModalProps {
  open: boolean;
  onClose: () => void;
  cattleCount?: number;
  herdBookName?: string;
  herdBookId?: string;
}

export const ImportCompletedModal = ({ open, onClose, cattleCount, herdBookName, herdBookId }: ImportCompletedModalProps) => {
  const navigate = useNavigate();
  const destination = herdBookId ? `/admin/herd-books/${herdBookId}` : '/admin';

  const handleClose = () => {
    onClose();
    navigate(destination);
  };

  const handleGoToAdmin = () => {
    navigate(destination);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-6 w-6 text-green-500" aria-hidden="true" />
            <DialogTitle className="text-xl">Import initial déjà effectué</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Votre système a déjà été initialisé avec succès.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          {herdBookName && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Livre de troupeau:</span>
              <span className="font-medium">{herdBookName}</span>
            </div>
          )}
          {cattleCount !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Nombre de bovins:</span>
              <span className="font-medium">{cattleCount}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button onClick={handleGoToAdmin} className="w-full">
            {herdBookId ? 'Voir le livre de troupeau' : "Aller à l'administration"}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
