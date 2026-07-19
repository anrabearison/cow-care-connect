import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Download, Eye, Loader2, RefreshCw } from 'lucide-react';
import { usePassports } from '../hooks';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { passportService } from '../services/passportService';
import { toast } from 'sonner';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { passportKeys } from '../hooks';
import { useNavigate } from 'react-router-dom';

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Brouillon', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  GENERATED: { label: 'Généré', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  USED: { label: 'Utilisé', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  CANCELLED: { label: 'Annulé', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
};

export function PassportList() {
  const { selectedHerdBookId } = useHerdBookSelection();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { data: paginatedData, isLoading, error } = usePassports(selectedHerdBookId || undefined, page, itemsPerPage);
  const passports = paginatedData?.data || [];
  const meta = paginatedData?.meta;
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleGenerate = async (passportId: string) => {
    setGeneratingId(passportId);
    try {
      toast.loading('Génération du PDF en cours...', { id: 'pdf-generation' });
      await passportService.generatePdf(passportId);
      toast.success('PDF généré avec succès', { id: 'pdf-generation' });
      // Refresh passport list to show updated status
      queryClient.invalidateQueries({ queryKey: passportKeys.all });
    } catch (error) {
      console.error('Error generating passport PDF:', error);
      toast.error('Erreur lors de la génération du PDF', { id: 'pdf-generation' });
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownload = async (passportId: string, passportNumber: string) => {
    setDownloadingId(passportId);
    try {
      const blob = await passportService.downloadPdf(passportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passeport-${passportNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Passeport téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading passport:', error);
      toast.error('Erreur lors du téléchargement du passeport');
    } finally {
      setDownloadingId(null);
    }
  };


  if (!selectedHerdBookId) {
    return null;
  }

  return (
    <Card className="mt-8 shadow-card-soft border-none bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Derniers Passeports Générés
          </CardTitle>
          <CardDescription>
            Historique des passeports pour le livre de troupeau sélectionné
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Erreur lors du chargement des passeports
          </div>
        ) : passports && passports.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Date d'émission</TableHead>
                  <TableHead>Bœufs</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passports.map((passport) => (
                  <TableRow key={passport.id}>
                    <TableCell className="font-medium">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium"
                        onClick={() => navigate(`/admin/passports/${passport.id}`)}
                      >
                        {passport.passportNumber}
                      </Button>
                    </TableCell>
                    <TableCell>{passport.applicantName || 'N/A'}</TableCell>
                    <TableCell>
                      {passport.issueDate 
                        ? format(new Date(passport.issueDate), 'dd MMM yyyy', { locale: fr })
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{passport.totalCattle}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={STATUS_BADGES[passport.status]?.className || ''}
                      >
                        {STATUS_BADGES[passport.status]?.label || passport.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {passport.status === 'DRAFT' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerate(passport.id)}
                            disabled={generatingId === passport.id}
                          >
                            {generatingId === passport.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                            <span className="sr-only">Générer PDF</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/passports/${passport.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir détails</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(passport.id, passport.passportNumber)}
                          disabled={downloadingId === passport.id || passport.status === 'DRAFT'}
                        >
                          {downloadingId === passport.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span className="sr-only">Télécharger</span>
                        </Button>
                        
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {meta && meta.total > itemsPerPage && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Affichage de {(page - 1) * itemsPerPage + 1} à {Math.min(page * itemsPerPage, meta.total)} sur {meta.total}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page >= meta.totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun passeport trouvé pour ce livre de troupeau.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
