import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartColumn, IdCard, ShieldCheck, ClipboardList, ArrowRightLeft, Lock, ChevronRight } from 'lucide-react';

interface ReportEntry {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'available' | 'coming-soon';
  badge: string;
  route: string;
}

const REPORTS: ReportEntry[] = [
  {
    id: 'passport',
    title: 'Passeports Bovins',
    description: 'Documents officiels pour le transfert de bétail entre villages. Génération et téléchargement PDF.',
    icon: IdCard,
    status: 'available',
    badge: 'Disponible',
    route: '/reports/passport',
  },
  {
    id: 'health',
    title: 'Rapport Sanitaire',
    description: 'Historique complet des vaccinations, traitements et visites vétérinaires par animal.',
    icon: ShieldCheck,
    status: 'coming-soon',
    badge: 'Bientôt disponible',
    route: '/reports/health',
  },
  {
    id: 'inventory',
    title: 'Inventaire du Troupeau',
    description: 'Liste complète du troupeau avec statistiques par race, âge et statut.',
    icon: ClipboardList,
    status: 'coming-soon',
    badge: 'Bientôt disponible',
    route: '/reports/inventory',
  },
  {
    id: 'transfers',
    title: 'Historique des Transferts',
    description: 'Journal complet des mouvements et transferts de bétail.',
    icon: ArrowRightLeft,
    status: 'coming-soon',
    badge: 'Bientôt disponible',
    route: '/reports/transfers',
  },
];

export default function ReportsPage() {
  const navigate = useNavigate();

  const handleClick = (report: ReportEntry) => {
    if (report.status === 'available') {
      navigate(report.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <ChartColumn className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground">Rapports</h1>
          </div>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Sélectionnez un type de rapport pour générer et télécharger vos documents officiels
          </p>
        </div>

        {/* Reports grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REPORTS.map((report) => {
            const Icon = report.icon;
            const available = report.status === 'available';
            return (
              <Card
                key={report.id}
                onClick={() => handleClick(report)}
                className={[
                  'shadow-card-soft border-none bg-white/50 backdrop-blur-sm transition-all duration-200',
                  available
                    ? 'cursor-pointer hover:shadow-lg hover:scale-[1.01] hover:border-primary/20'
                    : 'opacity-70 cursor-not-allowed',
                ].join(' ')}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 ${available ? 'bg-primary/10 text-primary' : 'bg-muted/60 text-muted-foreground'}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm leading-relaxed">
                          {report.description}
                        </CardDescription>
                      </div>
                    </div>
                    {available ? (
                      <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-1" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                    available
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {report.badge}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}
