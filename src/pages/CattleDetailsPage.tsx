import { useParams, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, Activity, Stethoscope, User } from 'lucide-react';
import { mockCattleData } from '@/data/mockData';
import cattlePortrait1 from '@/assets/cattle-portrait-1.jpg';
import cattlePortrait2 from '@/assets/cattle-portrait-2.jpg';
import cattlePortrait3 from '@/assets/cattle-portrait-3.jpg';

const cattleImages = [cattlePortrait1, cattlePortrait2, cattlePortrait3];

const calculateAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const today = new Date();
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                     (today.getMonth() - birth.getMonth());
  
  if (ageInMonths < 12) {
    return `${ageInMonths} mois`;
  } else {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` et ${months} mois` : ''}`;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getCharacterColor = (character: string) => {
  switch (character) {
    case 'Docile':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Agressif':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Timide':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Energique':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'Naissance':
      return '🐄';
    case 'Changement de pâturage':
      return '🌱';
    case 'Vaccination':
      return '💉';
    case 'Visite vétérinaire':
      return '🩺';
    case 'Pesée':
      return '⚖️';
    default:
      return '📝';
  }
};

const getTreatmentIcon = (treatmentType: string) => {
  switch (treatmentType) {
    case 'Antibiotique':
      return '💊';
    case 'Vaccin':
      return '💉';
    case 'Vermifuge':
      return '🧬';
    case 'Anti-inflammatoire':
      return '🩹';
    default:
      return '💊';
  }
};

export default function CattleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const cattle = mockCattleData.find(c => c.id === id);

  if (!cattle) {
    return <Navigate to="/cattle" replace />;
  }

  // Use a consistent image based on the cattle ID
  const imageIndex = parseInt(cattle.id.slice(1)) % cattleImages.length;
  const cattleImage = cattleImages[imageIndex];

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/cattle">
            <Button variant="outline" size="icon" className="border-primary/20">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">{cattle.nom}</h1>
            <p className="text-muted-foreground">ID: {cattle.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Photo */}
            <Card className="overflow-hidden shadow-farm">
              <div className="relative h-64">
                <img 
                  src={cattleImage}
                  alt={`Photo de ${cattle.nom}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-primary">
                    {cattle.genre === 'M' ? 'Mâle' : 'Femelle'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Basic Info */}
            <Card className="shadow-card-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Informations générales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Âge</span>
                  <span className="font-medium">{calculateAge(cattle.dateNaissance)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date de naissance</span>
                  <span className="font-medium">{formatDate(cattle.dateNaissance)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Caractère</span>
                  <Badge className={getCharacterColor(cattle.caractere)}>
                    {cattle.caractere}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <span className="text-muted-foreground">Source</span>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{cattle.source.type}</span>
                  </div>
                  {cattle.source.fournisseur && (
                    <p className="text-sm text-muted-foreground">
                      Fournisseur: {cattle.source.fournisseur}
                    </p>
                  )}
                  {cattle.source.dateAchat && (
                    <p className="text-sm text-muted-foreground">
                      Date d'achat: {formatDate(cattle.source.dateAchat)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - History & Treatments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Timeline */}
            <Card className="shadow-farm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Historique des événements</span>
                </CardTitle>
                <CardDescription>
                  Chronologie des événements importants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cattle.evenements
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((event) => (
                    <div key={event.id} className="flex space-x-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl">{getEventIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{event.description}</h4>
                            {event.details && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.details}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="border-primary/20 text-primary">
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 mt-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Treatment History */}
            <Card className="shadow-farm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span>Historique des traitements</span>
                </CardTitle>
                <CardDescription>
                  Suivi médical et vétérinaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cattle.traitements
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((treatment) => (
                    <div key={treatment.id} className="flex space-x-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="text-2xl">{getTreatmentIcon(treatment.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{treatment.produit}</h4>
                            <p className="text-sm text-muted-foreground">
                              Dose: {treatment.dose} • Vétérinaire: {treatment.veterinaire}
                            </p>
                            {treatment.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {treatment.notes}
                              </p>
                            )}
                          </div>
                          <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                            {treatment.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 mt-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(treatment.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}