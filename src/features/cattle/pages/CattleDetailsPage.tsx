import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';
import {
  Activity,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  MapPin,
  Plus,
  Stethoscope,
  User,
  Users,
  X
} from 'lucide-react';
import { useCattle, useCattleById } from '@/features/cattle/hooks';
import { useEventTypes, useMedicaments, useVeterinarians } from '@/features/common/hooks/useReferences';
import { getEventTypeLabel, resolveIconEmoji } from '@/features/events/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useEffect, useState } from 'react';
import { calculateAge as commonCalculateAge } from '../utils/helpers';
import cattlePortrait1 from '@/assets/cattle-portrait-1.jpg';
import cattlePortrait2 from '@/assets/cattle-portrait-2.jpg';
import cattlePortrait3 from '@/assets/cattle-portrait-3.jpg';

import { AddTreatmentModal } from '@/features/cattle/components/AddTreatmentModal';
import { AddEventModal } from '@/features/cattle/components/AddEventModal';
import { AddBirthModal } from '@/features/cattle/components/AddBirthModal';
import { Cattle, CattleEvent, Treatment } from '@/features/cattle/types';
import { cattleService } from "@/features/cattle";
import { useToast } from '@/hooks/use-toast';
import { formatDosage } from '@/features/cattle/utils/dosageUtils';

const cattleImages = [cattlePortrait1, cattlePortrait2, cattlePortrait3];

const calculateAge = (birthDate: string) => commonCalculateAge(birthDate);

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

const getCategoryColor = (name: string) => {
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
    case 'ANTIBIOTIQUE':
      return '💊';
    case 'VACCIN':
      return '💉';
    case 'VERMIFUGE':
      return '🧬';
    case 'ANTI_INFLAMMATOIRE':
      return '🩹';
    case 'VITAMINE':
      return '💊';
    default:
      return '💊';
  }
};

export default function CattleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedHerdBookId } = useHerdBookSelection();
  const { cattle, loading, error } = useCattleById(id || '');
  const { cattle: allCattle } = useCattle(selectedHerdBookId || ''); // Pour trouver les descendants

  // Fetch reference data
  const { data: eventTypesData } = useEventTypes();
  const { data: veterinariansData } = useVeterinarians();
  const { data: medicamentsData } = useMedicaments();

  const [showLineage, setShowLineage] = useState(false);
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddBirth, setShowAddBirth] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [localTreatments, setLocalTreatments] = useState<Treatment[]>([]);
  const [localEvents, setLocalEvents] = useState<CattleEvent[]>([]);
  const { toast } = useToast();

  // Helper functions using fetched data
  const getVeterinarianName = (vet: string | any) => {
    if (typeof vet === 'object' && vet?.name) {
      return vet.name;
    }
    const vetData = (veterinariansData?.data as any[])?.find(v => v.id === vet);
    return vetData ? vetData.name : `Vétérinaire ${vet}`;
  };

  const getMedicamentName = (med: string | any) => {
    if (typeof med === 'object' && med?.name) {
      return med.name;
    }
    const medData = (medicamentsData?.data as any[])?.find(m => m.id === med);
    return medData ? medData.name : `Médicament ${med}`;
  };

  const getTypeEvenementName = (id: string) => {
    const type = eventTypesData?.data?.find((t) => t.id === id);
    return type ? getEventTypeLabel(type) : `Type ${id}`;
  };

  const getTypeEvenementIcon = (id: string) => {
    const type = eventTypesData?.data?.find((t: any) => t.id === id);
    return resolveIconEmoji(type?.icone, '📝');
  };

  // Fonction pour trouver les descendants potentiels
  const findDescendants = () => {
    if (!cattle || !allCattle) return [];

    // Priorité à la liaison explicite via motherId
    const directDescendants = allCattle.filter(c => c.motherId === cattle.id);
    if (directDescendants.length > 0) return directDescendants;

    // Fallback: Logique basée sur la date pour les anciens enregistrements sans motherId
    const currentBirthDate = new Date(cattle.birthDate);
    const minDescendantDate = new Date(currentBirthDate);
    minDescendantDate.setMonth(minDescendantDate.getMonth() + 9); // Gestation minimum

    return allCattle.filter(descendant => {
      if (descendant.id === cattle.id) return false;
      if (descendant.source.type !== 'NE_DANS_TROUPEAU') return false;
      // Si le descendant a une mère définie mais ce n'est pas ce bovin, on l'exclut
      if (descendant.motherId && descendant.motherId !== cattle.id) return false;

      const descendantBirthDate = new Date(descendant.birthDate);
      return descendantBirthDate > minDescendantDate;
    });
  };

  const descendants = findDescendants();

  // Handle Escape key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageOpen) {
        setIsImageOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isImageOpen]);

  // Initialize local state when cattle data loads
  if (cattle && localTreatments.length === 0 && cattle.treatments.length > 0) {
    setLocalTreatments(cattle.treatments);
  }
  if (cattle && localEvents.length === 0 && cattle.events.length > 0) {
    setLocalEvents(cattle.events);
  }

  // Handlers for adding treatments and events
  // Handlers for adding treatments and events
  const handleAddTreatment = async (treatment: Omit<Treatment, 'id'>) => {
    if (!cattle) return;
    try {
      const response = await cattleService.createTreatment(cattle.id, treatment);
      if (response.success && response.data) {
        setLocalTreatments([...localTreatments, response.data]);
        toast({
          title: "Succès",
          description: "Traitement ajouté avec succès",
        });
      }
    } catch (error) {
      console.error("Error adding treatment:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'ajout du traitement",
      });
    }
  };

  const handleAddEvent = async (event: Omit<CattleEvent, 'id'>) => {
    if (!cattle) return;
    try {
      const response = await cattleService.createEvent(cattle.id, event);
      if (response.success && response.data) {
        setLocalEvents([...localEvents, response.data]);
        toast({
          title: "Succès",
          description: "Événement ajouté avec succès",
        });
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'événement",
      });
    }
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

  // Use actual cattle photo if available, otherwise use a consistent fallback image based on the cattle ID
  const idHash = cattle.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = idHash % cattleImages.length;
  const cattleImage = cattle.photo || cattleImages[imageIndex];



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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Photo */}
            {/* Photo */}
            <Card className="overflow-hidden shadow-farm border-none">
              <div
                className="relative h-64 sm:h-80 cursor-pointer group"
                onClick={() => setIsImageOpen(true)}
              >
                <img
                  src={cattleImage}
                  alt={`Photo de ${cattle.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white bg-black/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm font-medium flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Agrandir
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-primary shadow-sm backdrop-blur-sm">
                    {cattle.gender === 'M' ? 'Mâle' : 'Femelle'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Lightbox Overlay */}
            {isImageOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm"
                onClick={() => setIsImageOpen(false)}
              >
                <button
                  className="absolute top-4 right-4 text-white hover:text-gray-300 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageOpen(false);
                  }}
                  aria-label="Fermer"
                >
                  <X className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
                <img
                  src={cattleImage}
                  alt={`Photo de ${cattle.name}`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

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
                  {cattle.character ? (
                    <Badge className={getCharacterColor(cattle.character.name)}>
                      {cattle.character.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Catégorie</span>
                  <Badge className={getCategoryColor(cattle.category.name)}>
                    {cattle.category.name}
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

                {cattle.n_carnet && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">N° Carnet</span>
                    <span className="font-medium">{cattle.n_carnet}</span>
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
                {cattle.source.type === 'ACHETE' && (
                  <div className="space-y-2">
                    <span className="text-muted-foreground">Source</span>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Acheté (Détails dans le module Achats)</span>
                    </div>
                  </div>
                )}

                {/* Section pour les bovins nés dans le troupeau */}
                {cattle.source.type === 'NE_DANS_TROUPEAU' && (
                  <>
                    <div className="space-y-2">
                      <span className="text-muted-foreground">Source</span>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">Né dans le troupeau</span>
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
                          {cattle.source.type === 'NE_DANS_TROUPEAU'
                            ? `Né(e) dans notre troupeau le ${formatDate(cattle.birthDate)}`
                            : `Né(e) le ${formatDate(cattle.birthDate)}`
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Âge actuel: {calculateAge(cattle.birthDate)}
                        </p>
                        {cattle.motherId && (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">Mère:</span>
                            {allCattle?.find(c => c.id === cattle.motherId) ? (
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <span className="text-sm text-primary hover:underline font-medium cursor-pointer">
                                    {allCattle.find(c => c.id === cattle.motherId)?.name}
                                    {allCattle.find(c => c.id === cattle.motherId)?.nickname && ` (${allCattle.find(c => c.id === cattle.motherId)?.nickname})`}
                                  </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  {(() => {
                                    const mother = allCattle.find(c => c.id === cattle.motherId);
                                    if (!mother) return null;
                                    const motherIdHash = mother.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                    const motherImageIndex = motherIdHash % cattleImages.length;
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
                                            {mother.category && <Badge className={getCategoryColor(mother.category.name)}>{mother.category.name}</Badge>}
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
                              <span className="text-sm text-muted-foreground">{cattle.motherId}</span>
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
                                        const descendantIdHash = descendant.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                        const descendantImageIndex = descendantIdHash % cattleImages.length;
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
                                          {descendant.category && <Badge className={getCategoryColor(descendant.category.name)}>{descendant.category.name}</Badge>}
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
                                Dose: {formatDosage(treatment.dosage)} • Intervenant: {getVeterinarianName(treatment.veterinarian)}
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