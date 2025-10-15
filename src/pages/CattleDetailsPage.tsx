import { useParams, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, MapPin, Activity, Stethoscope, User, ChevronDown, Users, FileText } from 'lucide-react';
import { useCattleById, useCattle } from '@/hooks/useCattle';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import cattlePortrait1 from '@/assets/cattle-portrait-1.jpg';
import cattlePortrait2 from '@/assets/cattle-portrait-2.jpg';
import cattlePortrait3 from '@/assets/cattle-portrait-3.jpg';
import { getVeterinarianName, getMedicamentName, getTypeEvenementName, getTypeEvenementIcon } from '@/data/mockData';

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

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Taureau':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Vache':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'Veau':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Zébu':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
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
  const { cattle, loading, error } = useCattleById(id || '');
  const { cattle: allCattle } = useCattle(); // Pour trouver les descendants
  const [showLineage, setShowLineage] = useState(false);

  // Fonction pour trouver les descendants potentiels
  const findDescendants = () => {
    if (!cattle || !allCattle) return [];
    
    // Logique simple: chercher les bovins nés dans le troupeau après la date de naissance du bovin actuel
    // et qui pourraient être ses descendants (nés 9-12 mois après)
    const currentBirthDate = new Date(cattle.dateNaissance);
    const minDescendantDate = new Date(currentBirthDate);
    minDescendantDate.setMonth(minDescendantDate.getMonth() + 9); // Gestation minimum
    
    return allCattle.filter(descendant => {
      if (descendant.id === cattle.id) return false;
      if (descendant.source.type !== 'Né dans le troupeau') return false;
      
      const descendantBirthDate = new Date(descendant.dateNaissance);
      return descendantBirthDate > minDescendantDate;
    });
  };

  const descendants = findDescendants();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <div className="container mx-auto px-6 py-8">
          {/* Header Skeleton */}
          <div className="flex items-center space-x-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div>
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-24 mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <Skeleton className="h-64 w-full" />
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="mb-4 p-4 rounded-lg bg-muted/30">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cattle || error) {
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

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Catégorie</span>
                  <Badge className={getCategoryColor(cattle.categorie)}>
                    {cattle.categorie}
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

                {/* Section collapsible pour les bovins nés dans le troupeau */}
              {cattle.source.type === 'Acheté' && (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">Détails de l'achat</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Acheté le {formatDate(cattle.source.dateAchat!)} chez {cattle.source.fournisseur}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cattle.source.categorieAchat && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Catégorie à l'achat</p>
                          <Badge variant="outline" className={getCategoryColor(cattle.source.categorieAchat)}>
                            {cattle.source.categorieAchat}
                          </Badge>
                        </div>
                      )}
                      {cattle.source.prixAchat && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Prix d'achat</p>
                          <p className="text-sm font-medium">{cattle.source.prixAchat.toLocaleString('fr-FR')} Ar</p>
                        </div>
                      )}
                      {cattle.source.poidsAchat && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Poids à l'achat</p>
                          <p className="text-sm font-medium">{cattle.source.poidsAchat} kg</p>
                        </div>
                      )}
                      {cattle.source.etatSanteAchat && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">État de santé</p>
                          <p className="text-sm font-medium">{cattle.source.etatSanteAchat}</p>
                        </div>
                      )}
                    </div>
                    {cattle.source.remarquesAchat && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Remarques</p>
                        <p className="text-sm text-muted-foreground italic">"{cattle.source.remarquesAchat}"</p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {cattle.source.type === 'Né dans le troupeau' && (
                  <>
                    <Separator />
                    <Collapsible open={showLineage} onOpenChange={setShowLineage}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent/10 rounded-md transition-colors">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Détails lignée & descendants</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showLineage ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="pt-4 space-y-4">
                        {/* Informations sur la lignée */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Informations de naissance</span>
                          </div>
                          <div className="pl-6 space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Né(e) dans notre troupeau le {formatDate(cattle.dateNaissance)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Âge actuel: {calculateAge(cattle.dateNaissance)}
                            </p>
                            {cattle.genre === 'F' && (
                              <p className="text-sm text-primary font-medium">
                                ♀ Capable de reproduction
                              </p>
                            )}
                            {cattle.genre === 'M' && (
                              <p className="text-sm text-primary font-medium">
                                ♂ Reproducteur potentiel
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Liste des descendants potentiels */}
                        {descendants.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Descendants potentiels ({descendants.length})</span>
                            </div>
                            <div className="pl-6 space-y-2">
                              {descendants.map((descendant) => (
                                <div key={descendant.id} className="flex items-center justify-between p-2 bg-muted/20 rounded border border-muted-foreground/10">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-primary">
                                        {descendant.genre === 'M' ? '♂' : '♀'}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{descendant.nom}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {descendant.id} • Né le {formatDate(descendant.dateNaissance)}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {calculateAge(descendant.dateNaissance)}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {descendants.length === 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Aucun descendant identifié</span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                              Aucun bovin né dans le troupeau après la période de gestation potentielle.
                            </p>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
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
                      <div className="text-2xl">{getTypeEvenementIcon(event.type)}</div>
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
                            {getTypeEvenementName(event.type)}
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
                  Suivi médical et traitements
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
                            <h4 className="font-medium">{getMedicamentName(treatment.produit)}</h4>
                            <p className="text-sm text-muted-foreground">
                              Dose: {treatment.dose} • Intervenant: {getVeterinarianName(treatment.veterinaire)}
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