import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PassportGeneratorModal } from '@/features/passport/components/PassportGeneratorModal';
import { PassportList } from '@/features/passport/components/PassportList';
import { CreatePassportDto } from '@/features/passport/types/passport.types';
import { passportService } from '@/features/passport/services/passportService';
import { passportKeys } from '@/features/passport/hooks';

const PassportReportPage = memo(function PassportReportPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);

  const handleCloseModal = useCallback((open: boolean) => setIsModalOpen(open), []);

  const handleGeneratePassport = useCallback(async (data: CreatePassportDto) => {
    setIsGenerating(true);
    try {
      toast.loading('Création du passeport en cours...', { id: 'passport-creation' });
      const passport = await passportService.create(data);
      toast.success('Passeport créé avec succès', { id: 'passport-creation' });
      setIsModalOpen(false);

      toast.loading('Génération du PDF en cours...', { id: 'pdf-generation' });
      await passportService.generatePdf(passport.id);
      toast.success('PDF généré avec succès', { id: 'pdf-generation' });

      toast.loading('Téléchargement du PDF...', { id: 'pdf-download' });
      const blob = await passportService.downloadPdf(passport.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passeport-${passport.passportNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Passeport téléchargé avec succès', { id: 'pdf-download' });
    } catch (error) {
      console.error('Error generating passport:', error);
      toast.error('Erreur lors de la création du passeport', { id: 'passport-creation' });
    } finally {
      setIsGenerating(false);
      queryClient.invalidateQueries({ queryKey: passportKeys.all });
    }
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-muted-foreground hover:text-foreground -ml-2"
            onClick={() => navigate('/reports')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux rapports
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Passeports Bovins
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Document officiel requis pour tout transfert de bétail entre villages
                </p>
              </div>
            </div>
            <Button onClick={handleOpenModal} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau passeport
            </Button>
          </div>
        </div>

        {/* Liste des passeports */}
        <PassportList />

      </div>

      <PassportGeneratorModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        onGenerate={handleGeneratePassport}
        isGenerating={isGenerating}
      />
    </div>
  );
});

export default PassportReportPage;
