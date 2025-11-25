import { useParams, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, MapPin, Activity, Stethoscope, User, ChevronDown, Users, FileText, Plus, ExternalLink } from 'lucide-react';
import { useCattleById, useCattle } from '@/features/cattle/hooks';
import { useEventTypes, useVeterinarians, useMedicaments } from '@/features/common/hooks/useReferences';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useState, useMemo } from 'react';
import cattlePortrait1 from '@/assets/cattle-portrait-1.jpg';
import cattlePortrait2 from '@/assets/cattle-portrait-2.jpg';
import cattlePortrait3 from '@/assets/cattle-portrait-3.jpg';
import { categories } from '@/data/categories';
import { AddTreatmentModal } from '@/features/cattle/components/AddTreatmentModal';
import { AddEventModal } from '@/features/cattle/components/AddEventModal';
import { AddBirthModal } from '@/features/cattle/components/AddBirthModal';
import { Treatment, CattleEvent, Cattle } from '@/features/cattle/types';
import { cattleService } from "@/features/cattle";
import { useToast } from '@/hooks/use-toast';

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

const getCategoryColor = (id: number) => {
  const cat = categories.find((c) => c.id === id);
  const name = cat ? cat.name : '';

  switch (name) {
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

  // Fetch reference data
  const { data: eventTypesData } = useEventTypes();
  const { data: veterinariansData } = useVeterinarians();
  const { data: medicamentsData } = useMedicaments();

  const [showLineage, setShowLineage] = useState(false);
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddBirth, setShowAddBirth] = useState(false);
  const [localTreatments, setLocalTreatments] = useState<Treatment[]>([]);
  const [localEvents, setLocalEvents] = useState<CattleEvent[]>([]);
  const { toast } = useToast();

  // Helper functions using fetched data
  const getVeterinarianName = (id: number) => {
    const vet = veterinariansData?.data?.find(v => v.id === id);
    return vet ? vet.nom : `Vétérinaire ${id}`;
  };

  const getMedicamentName = (id: number) => {
    const med = medicamentsData?.data?.find(m => m.id === id);
    return med ? med.nom : `Médicament ${id}`;
  };

  const getTypeEvenementName = (id: number) => {
    const type = eventTypesData?.data?.find(t => t.id === id);
    return type ? type.nom : `Type ${id}`;
  };

  const getTypeEvenementIcon = (id: number) => {
    const type = eventTypesData?.data?.find(t => t.id === id);
    return type?.icone || '📝';
  };

  // Fonction pour trouver les descendants potentiels
  const findDescendants = () => {
    if (!cattle || !allCattle) return [];

    // Priorité à la liaison explicite via motherId
    const directDescendants = allCattle.filter(c => c.source.motherId === cattle.id);
    if (directDescendants.length > 0) return directDescendants;

    // Fallback: Logique basée sur la date pour les anciens enregistrements sans motherId
    const currentBirthDate = new Date(cattle.birthDate);
    const minDescendantDate = new Date(currentBirthDate);
    minDescendantDate.setMonth(minDescendantDate.getMonth() + 9); // Gestation minimum

    return allCattle.filter(descendant => {
      if (descendant.id === cattle.id) return false;
      if (descendant.source.type !== 'Né dans le troupeau') return false;
      // Si le descendant a une mère définie mais ce n'est pas ce bovin, on l'exclut
      if (descendant.source.motherId && descendant.source.motherId !== cattle.id) return false;

      const descendantBirthDate = new Date(descendant.birthDate);
      return descendantBirthDate > minDescendantDate;
    });
  };

  const descendants = findDescendants();

  // Initialize local state when cattle data loads
  if (cattle && localTreatments.length === 0 && cattle.treatments.length > 0) {
    setLocalTreatments(cattle.treatments);
  }
  if (cattle && localEvents.length === 0 && cattle.events.length > 0) {
    setLocalEvents(cattle.events);
  }

  // Handlers for adding treatments and events
  const handleAddTreatment = (treatment: Omit<Treatment, 'id'>) => {
    const newTreatment: Treatment = {
      ...treatment,
      id: Date.now()
    };
    setLocalTreatments([...localTreatments, newTreatment]);
  };

  const handleAddEvent = (event: Omit<CattleEvent, 'id'>) => {
    const newEvent: CattleEvent = {
      ...event,
      id: Date.now()
    };
    setLocalEvents([...localEvents, newEvent]);
  };

  const handleAddBirth = async (calfData: Omit<Cattle, 'id' | 'events' | 'treatments'>) => {
    if (!cattle) return;

    try {
      const response = await cattleService.registerBirth(cattle.id, calfData);

      if (response.success) {
        toast({
          title: "Succès",
          description: `Naissance enregistrée avec succès pour ${calfData.name} !`,
        });
        // Refresh cattle data to show new descendant/event
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || "Erreur lors de l'enregistrement de la naissance",
        });
      }
    } catch (error) {
      console.error("Error registering birth:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
      });
    }
  };

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
  const imageIndex = cattle.id % cattleImages.length;
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
            <h1 className="text-4xl font-bold text-foreground">
              {cattle.name}{cattle.nickname && ` (${cattle.nickname})`}
            </h1>
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
                  alt={`Photo de ${cattle.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-primary">
                    {cattle.gender === 'M' ? 'Mâle' : 'Femelle'}
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
                  <span className="font-medium">{calculateAge(cattle.birthDate)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date de naissance</span>
                  <span className="font-medium">{formatDate(cattle.birthDate)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Caractère</span>
                  <Badge className={getCharacterColor(cattle.character)}>
                    {cattle.character}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Catégorie</span>
                  <Badge className={getCategoryColor(cattle.category)}>
                    {cattle.category}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sexe</span>
                  <span className="font-medium">{cattle.gender === 'M' ? 'Mâle' : 'Femelle'}</span>
                </div>

                {cattle.brand && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Marque</span>
                    <span className="font-medium">{cattle.brand}</span>
                  </div>
                )}

                {cattle.herdBookNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">N° Carnet</span>
                    <span className="font-medium">{cattle.herdBookNumber}</span>
                  </div>
                )}

                {cattle.distinctiveSign && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Signe particulier</span>
                    <span className="font-medium">{cattle.distinctiveSign}</span>
                  </div>
                )}

                <Separator />

                {/* Section pour les bovins achetés */}
                {cattle.source.type === 'Acheté' && (
                  <Collapsible open={showPurchaseDetails} onOpenChange={setShowPurchaseDetails}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Acheté</span>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cattle.source.supplier && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Fournisseur</p>
                            <p className="text-sm font-medium">{cattle.source.supplier}</p>
                          </div>
                        )}
                        {cattle.source.purchaseDate && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Date d'achat</p>
                            <p className="text-sm font-medium">{formatDate(cattle.source.purchaseDate)}</p>
                          </div>
                        )}
                        {cattle.source.purchaseCategory && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Catégorie à l'achat</p>
                            <Badge variant="outline" className={getCategoryColor(cattle.source.purchaseCategory)}>
                              {cattle.source.purchaseCategory}
                            </Badge>
                          </div>
                        )}
                        {cattle.source.purchasePrice && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Prix d'achat</p>
                            <p className="text-sm font-medium">{cattle.source.purchasePrice.toLocaleString('fr-FR')} Ar</p>
                          </div>
                        )}

                      </div>
                      {cattle.source.purchaseNotes && (
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Remarques</p>
                          <p className="text-sm text-muted-foreground italic">"{cattle.source.purchaseNotes}"</p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Section pour les bovins nés dans le troupeau */}
                {cattle.source.type === 'Né dans le troupeau' && (
                  <>
                    <div className="space-y-2">
                      <span className="text-muted-foreground">Source</span>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{cattle.source.type}</span>
                      </div>
                    </div>
                  </>
                )}

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
                          {cattle.source.type === 'Né dans le troupeau'
                            ? `Né(e) dans notre troupeau le ${formatDate(cattle.birthDate)}`
                            : `Né(e) le ${formatDate(cattle.birthDate)}`
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Âge actuel: {calculateAge(cattle.birthDate)}
                        </p>
                        {cattle.source.motherId && (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">Mère:</span>
                            {allCattle?.find(c => c.id === cattle.source.motherId) ? (
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <span className="text-sm text-primary hover:underline font-medium cursor-pointer">
                                    {allCattle.find(c => c.id === cattle.source.motherId)?.name}
                                    {allCattle.find(c => c.id === cattle.source.motherId)?.nickname && ` (${allCattle.find(c => c.id === cattle.source.motherId)?.nickname})`}
                                  </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  {(() => {
                                    const mother = allCattle.find(c => c.id === cattle.source.motherId);
                                    if (!mother) return null;
                                    const motherImageIndex = mother.id % cattleImages.length;
                                    const motherImage = mother.photo || cattleImages[motherImageIndex];

                                    return (
                                      <div className="grid gap-4">
                                        <div className="space-y-2">
                                          <h4 className="font-medium leading-none">
                                            {mother.name}
                                            {mother.nickname && <span className="text-muted-foreground font-normal"> ({mother.nickname})</span>}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">ID: {mother.id}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <div className="h-16 w-16 rounded-md overflow-hidden">
                                            <img src={motherImage} alt={mother.name} className="h-full w-full object-cover" />
                                          </div>
                                          <div className="space-y-1">
                                            <Badge className={getCategoryColor(mother.category)}>{mother.category}</Badge>
                                            <p className="text-xs text-muted-foreground">{calculateAge(mother.birthDate)}</p>
                                          </div>
                                        </div>
                                        <Link
                                          to={`/cattle/${mother.id}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-center w-full p-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                                        >
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          Voir détails
                                        </Link>
                                      </div>
                                    );
                                  })()}
                                </HoverCardContent>
                              </HoverCard>
                            ) : (
                              <span className="text-sm text-muted-foreground">{cattle.source.motherId}</span>
                            )}
                          </div>
                        )}
                        {cattle.gender === 'F' && (
                          <p className="text-sm text-primary font-medium">
                            ♀ Capable de reproduction
                          </p>
                        )}
                        {cattle.gender === 'M' && (
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
                          <span className="text-sm font-medium">Descendants ({descendants.length})</span>
                        </div>
                        <div className="pl-6 space-y-2">
                          {descendants.map((descendant) => (
                            <HoverCard key={descendant.id}>
                              <HoverCardTrigger asChild>
                                <div className="flex items-center justify-between p-2 bg-muted/20 rounded border border-muted-foreground/10 hover:bg-muted/40 transition-colors cursor-pointer">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-primary">
                                        {descendant.gender === 'M' ? '♂' : '♀'}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-primary hover:underline">
                                        {descendant.name}
                                        {descendant.nickname && <span className="text-muted-foreground font-normal"> ({descendant.nickname})</span>}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {descendant.id} • Né le {formatDate(descendant.birthDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {calculateAge(descendant.birthDate)}
                                  </Badge>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                {(() => {
                                  const descendantImageIndex = descendant.id % cattleImages.length;
                                  const descendantImage = descendant.photo || cattleImages[descendantImageIndex];

                                  return (
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium leading-none">
                                          {descendant.name}
                                          {descendant.nickname && <span className="text-muted-foreground font-normal"> ({descendant.nickname})</span>}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">ID: {descendant.id}</p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-md overflow-hidden">
                                          <img src={descendantImage} alt={descendant.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="space-y-1">
                                          <Badge className={getCategoryColor(descendant.category)}>{descendant.category}</Badge>
                                          <p className="text-xs text-muted-foreground">{calculateAge(descendant.birthDate)}</p>
                                        </div>
                                      </div>
                                      <Link
                                        to={`/cattle/${descendant.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-full p-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                                      >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Voir détails
                                      </Link>
                                    </div>
                                  );
                                })()}
                              </HoverCardContent>
                            </HoverCard>
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
              </CardContent>
            </Card>
          </div>

          {/* Right Column - History & Treatments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Timeline */}
            <Card className="shadow-farm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Événements</span>
                    </CardTitle>
                    <CardDescription>
                      Chronologie des événements importants
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {cattle.gender === 'F' && (
                      <Button
                        onClick={() => setShowAddBirth(true)}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Naissance
                      </Button>
                    )}
                    <Button
                      onClick={() => setShowAddEvent(true)}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localEvents
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      <span>Historique des traitements</span>
                    </CardTitle>
                    <CardDescription>
                      Suivi médical et traitements
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowAddTreatment(true)}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localTreatments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((treatment) => (
                      <div key={treatment.id} className="flex space-x-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                        <div className="text-2xl">{getTreatmentIcon(treatment.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{getMedicamentName(treatment.product)}</h4>
                              <p className="text-sm text-muted-foreground">
                                Dose: {treatment.dosage} • Intervenant: {getVeterinarianName(treatment.veterinarian)}
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

      {/* Modals */}
      <AddTreatmentModal
        open={showAddTreatment}
        onOpenChange={setShowAddTreatment}
        onAdd={handleAddTreatment}
        cattleName={`${cattle.name}${cattle.nickname ? ` (${cattle.nickname})` : ''}`}
      />
      <AddEventModal
        open={showAddEvent}
        onOpenChange={setShowAddEvent}
        onAdd={handleAddEvent}
        cattleName={`${cattle.name}${cattle.nickname ? ` (${cattle.nickname})` : ''}`}
      />
      <AddBirthModal
        open={showAddBirth}
        onOpenChange={setShowAddBirth}
        onAdd={handleAddBirth}
        motherName={`${cattle.name}${cattle.nickname ? ` (${cattle.nickname})` : ''}`}
        motherId={cattle.id}
      />
    </div>
  );
}