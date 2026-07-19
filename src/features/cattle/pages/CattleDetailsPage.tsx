import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageLoader } from '@/components/PageLoader';
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

import { AddTreatmentModal } from '@/features/cattle/components/AddTreatmentModal';
import { AddEventModal } from '@/features/cattle/components/AddEventModal';
import { AddBirthModal } from '@/features/cattle/components/AddBirthModal';
import { CattlePhotoCarousel } from '@/features/cattle/components/CattlePhotoCarousel';
import { getCattlePrimaryImage } from '@/features/cattle/components/cattlePhotoUtils';
import { HealthChatbot } from '@/features/cattle/components/HealthChatbot';
import { ChatbotFloatingButton } from '@/features/cattle/components/ChatbotFloatingButton';
import { Message } from '@/features/cattle/components/ChatMessage';
import { Cattle, CattleEvent, Treatment } from '@/features/cattle/types';
import { cattleService } from "@/features/cattle";
import { useToast } from '@/hooks/use-toast';
import { formatDosage } from '@/features/cattle/utils/dosageUtils';
import { ChatMessage as ApiChatMessage } from '@/features/cattle/services/health.service';

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
  const { cattle: mother } = useCattleById(cattle?.motherId || '');
  const { cattle: descendants } = useCattle(selectedHerdBookId || '', {
    motherId: id || undefined,
    page: 1,
    per_page: 50,
  });

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
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatApiHistory, setChatApiHistory] = useState<ApiChatMessage[]>([]);
  const [chatSeverity, setChatSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('low');
  const [chatConfidence, setChatConfidence] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (cattle?.name) {
      setChatMessages([
        {
          id: 'welcome',
          role: 'model',
          content: `Bonjour ! Je suis l'assistant santé pour ${cattle.name}. Décrivez les symptômes que vous observez et je vous aiderai à identifier les problèmes possibles.`,
          timestamp: new Date(),
        },
      ]);
      setChatApiHistory([]);
      setChatSeverity('low');
      setChatConfidence(null);
    }
  }, [cattle?.id, cattle?.name]);

  // Helper functions using fetched data
  const getVeterinarianName = (vet: string | { name: string }) => {
    if (typeof vet === 'object' && vet?.name) {
      return vet.name;
    }
    const vets = Array.isArray(veterinariansData?.data) ? veterinariansData.data : [];
    const vetData = vets.find(v => v.id === vet);
    return vetData ? vetData.name : 'Vétérinaire inconnu';
  };

  const getMedicamentName = (med: string | { name: string }) => {
    if (typeof med === 'object' && med?.name) {
      return med.name;
    }
    const meds = Array.isArray(medicamentsData?.data) ? medicamentsData.data : [];
    const medData = meds.find(m => m.id === med);
    return medData ? medData.name : 'Médicament inconnu';
  };

  const getTypeEvenementName = (id: string) => {
    const types = Array.isArray(eventTypesData?.data) ? eventTypesData.data : [];
    const type = types.find((t) => t.id === id);
    return type ? getEventTypeLabel(type) : 'Type inconnu';
  };

  const getTypeEvenementIcon = (id: string) => {
    const types = Array.isArray(eventTypesData?.data) ? eventTypesData.data : [];
    const type = types.find((t: { id: string; icone?: string }) => t.id === id);
    return resolveIconEmoji(type?.icone, '📝');
  };

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
        // Refresh cattle data to show new descendant/event via TanStack Query invalidation
        queryClient.invalidateQueries({ queryKey: queryKeys.cattle.details(cattle.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.cattle.all });
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
    return <PageLoader message="Chargement des détails du bovin..." />;
  }

  if (!cattle || error) {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-8">
          <Card className="w-full max-w-md border-destructive/20">
            <CardHeader>
              <CardTitle className="text-xl">Impossible de charger les détails</CardTitle>
              <CardDescription>
                Les informations du bovin n’ont pas pu être récupérées.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {error || 'Veuillez réessayer dans quelques instants.'}
              </p>
              <Button asChild>
                <Link to="/cattle">Retour à la liste</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/cattle">
            <Button variant="outline" size="icon" className="border-primary/20" aria-label="Retour">
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
                <CattlePhotoCarousel
                  cattle={cattle}
                  className="h-full w-full"
                  imageClassName="transition-transform duration-500 group-hover:scale-105"
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
                <CattlePhotoCarousel
                  cattle={cattle}
                  className="max-h-[85vh] w-full max-w-5xl rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                  imageClassName="max-h-[85vh] object-contain bg-black"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Basic Info */}
            <Card className="shadow-farm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Informations générales</span>
                </CardTitle>
                <CardDescription>
                  Informations de base sur l'animal
                </CardDescription>
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
                  <span className="text-muted-foreground">Sexe</span>
                  <span className="font-medium">{cattle.gender === 'M' ? 'Mâle' : 'Femelle'}</span>
                </div>

                {cattle.brand && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Marque</span>
                    <span className="font-medium">{cattle.brand}</span>
                  </div>
                )}

                {cattle.nCarnet && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">N° Carnet</span>
                    <span className="font-medium">{cattle.nCarnet}</span>
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
                            {mother ? (
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <span className="text-sm text-primary hover:underline font-medium cursor-pointer">
                                    {mother.name}
                                    {mother.nickname && ` (${mother.nickname})`}
                                  </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  {(() => {
                                    const motherImage = getCattlePrimaryImage(mother);

                                    return (
                                      <div className="grid gap-4">
                                        <div className="space-y-2">
                                          <h4 className="font-medium leading-none">
                                            {mother.name}
                                            {mother.nickname && <span className="text-muted-foreground font-normal"> ({mother.nickname})</span>}
                                          </h4>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <div className="h-16 w-16 rounded-md overflow-hidden">
                                            <img src={motherImage} alt={mother.name} className="h-full w-full object-cover" />
                                          </div>
                                          <div className="space-y-1">
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
                                        const descendantImage = getCattlePrimaryImage(descendant);

                                  return (
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium leading-none">
                                          {descendant.name}
                                          {descendant.nickname && <span className="text-muted-foreground font-normal"> ({descendant.nickname})</span>}
                                        </h4>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-md overflow-hidden">
                                          <img src={descendantImage} alt={descendant.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="space-y-1">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Événements</span>
                    </CardTitle>
                    <CardDescription>
                      Chronologie des événements importants
                    </CardDescription>
                  </div>
                  <div className="flex flex-row items-center gap-2 sm:justify-end">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      <span>Historique des traitements</span>
                    </CardTitle>
                    <CardDescription>
                      Suivi médical et traitements
                    </CardDescription>
                  </div>
                  <div className="flex flex-row items-center gap-2 sm:justify-end">
                    <Button
                      onClick={() => setShowAddTreatment(true)}
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
                  {localTreatments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((treatment) => (
                      <div key={treatment.id} className="flex space-x-4 p-4 bg-muted/30 rounded-lg">
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

            <HealthChatbot
              cattleId={cattle.id}
              cattle={cattle}
              messages={chatMessages}
              setMessages={setChatMessages}
              apiHistory={chatApiHistory}
              setApiHistory={setChatApiHistory}
              severity={chatSeverity}
              setSeverity={setChatSeverity}
              confidence={chatConfidence}
              setConfidence={setChatConfidence}
            />
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

      {/* Floating Chatbot Button */}
      <ChatbotFloatingButton
        cattleId={cattle.id}
        cattle={cattle}
        messages={chatMessages}
        setMessages={setChatMessages}
        apiHistory={chatApiHistory}
        setApiHistory={setChatApiHistory}
        severity={chatSeverity}
        setSeverity={setChatSeverity}
        confidence={chatConfidence}
        setConfidence={setChatConfidence}
      />
    </div>
  );
}
