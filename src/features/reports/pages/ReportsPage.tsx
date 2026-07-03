import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Badge, Calendar, Download, Lock } from 'lucide-react';
import { PassportGeneratorModal } from '@/features/passport/components/PassportGeneratorModal';
import { CreatePassportDto } from '@/features/passport/types/passport.types';
import { toast } from 'sonner';

const REPORT_TYPES = [
  {
    id: 'passport',
    title: 'Passeport Bovin',
    description: 'Document officiel pour le transfert de bétail entre villages',
    icon: FileText,
    status: 'available',
    badge: 'Indispensable',
  },
  {
    id: 'health',
    title: 'Rapport Sanitaire',
    description: 'Historique complet des vaccinations et traitements',
    icon: Badge,
    status: 'coming-soon',
    badge: 'Bientôt disponible',
  },
  {
    id: 'inventory',
    title: 'Inventaire Troupeau',
    description: 'Liste complète du troupeau avec statistiques',
    icon: Calendar,
    status: 'coming-soon',
    badge: 'Bientôt disponible',
  },
  {
    id: 'transfer',
    title: 'Historique Transferts',
    description: 'Journal des transferts de bétail',
    icon: Download,
    status: 'coming-soon',
    badge: 'Bientôt disponible',
  },
];

export default function ReportsPage() {
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePassport = async (data: CreatePassportDto) => {
    setIsGenerating(true);
    try {
      // TODO: Call passport service to create passport
      // const passport = await passportService.create(data);
      toast.success('Passeport créé avec succès');
      setIsPassportModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la création du passeport');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReportClick = (reportId: string) => {
    if (reportId === 'passport') {
      setIsPassportModalOpen(true);
    } else {
      toast.info('Ce type de rapport sera bientôt disponible');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground">Rapports</h1>
          </div>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Générez et téléchargez vos documents officiels
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORT_TYPES.map((report) => (
            <Card
              key={report.id}
              className={`shadow-card-soft border-none bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer ${
                report.status === 'available' ? 'hover:border-primary/30' : ''
              }`}
              onClick={() => handleReportClick(report.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      report.status === 'available'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      <report.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{report.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    report.status === 'available'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {report.badge}
                  </span>
                  {report.status === 'available' ? (
                    <Download className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Banner */}
        <Card className="mt-8 shadow-card-soft border-none bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  À propos des rapports
                </h3>
                <p className="text-sm text-muted-foreground">
                  Les rapports sont générés au format PDF et peuvent être téléchargés pour une impression ou une archivage.
                  Le passeport bovin est un document officiel requis pour tout transfert de bétail entre villages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PassportGeneratorModal
        open={isPassportModalOpen}
        onOpenChange={setIsPassportModalOpen}
        onGenerate={handleGeneratePassport}
        isGenerating={isGenerating}
      />
    </div>
  );
}
