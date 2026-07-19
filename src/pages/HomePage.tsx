import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, Activity } from 'lucide-react';
import { getTypeEvenementIcon, getTypeEvenementName } from '@/features/events/utils';
import { useAuth } from '@/features/auth/AuthContext';
import heroImage from '@/assets/hero-cattle.jpg';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentEvents } from '@/hooks/useRecentEvents';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { CARD_HOVER_CLASSES } from '@/constants/ui';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function HomePage() {
  const { user } = useAuth();
  const { data: recentEvents, isLoading } = useRecentEvents();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] min-h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center max-w-4xl px-4 sm:px-6 animate-fadeInUp">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight drop-shadow-md">
              Bienvenue, {user?.name}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 opacity-95 px-2 font-light drop-shadow-sm max-w-2xl mx-auto">
              Gérez votre troupeau avec efficacité et suivez la santé de vos animaux
            </p>
            <Link to="/cattle">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 transition-all duration-300 text-base sm:text-lg px-8 py-6 shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold rounded-full">
                Voir le troupeau
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 -mt-16 relative z-20">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className={`${CARD_HOVER_CLASSES} animate-fadeInUp opacity-0 hover:shadow-xl transition-all duration-300 hover:scale-105 border-none shadow-lg bg-white/95 backdrop-blur-sm`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stats?.totalCattle ?? 0}</p>
                  )}
                  <p className="text-sm text-muted-foreground font-medium">Animaux</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${CARD_HOVER_CLASSES} animate-fadeInUp opacity-0 animation-delay-100 hover:shadow-xl transition-all duration-300 hover:scale-105 border-none shadow-lg bg-white/95 backdrop-blur-sm`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/20 rounded-full group-hover:bg-accent/30 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary animate-pulse animation-delay-100" />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stats?.healthPercentage ?? 0}%</p>
                  )}
                  <p className="text-sm text-muted-foreground font-medium">Santé</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${CARD_HOVER_CLASSES} animate-fadeInUp opacity-0 animation-delay-200 hover:shadow-xl transition-all duration-300 hover:scale-105 border-none shadow-lg bg-white/95 backdrop-blur-sm`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/20 rounded-full group-hover:bg-secondary/30 transition-colors">
                  <Activity className="h-6 w-6 text-primary animate-pulse animation-delay-200" />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stats?.totalEvents ?? 0}</p>
                  )}
                  <p className="text-sm text-muted-foreground font-medium">Événements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${CARD_HOVER_CLASSES} animate-fadeInUp opacity-0 animation-delay-300 hover:shadow-xl transition-all duration-300 hover:scale-105 border-none shadow-lg bg-white/95 backdrop-blur-sm`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-muted/20 rounded-full group-hover:bg-muted/30 transition-colors">
                  <Calendar className="h-6 w-6 text-primary animate-pulse animation-delay-300" />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stats?.totalTreatments ?? 0}</p>
                  )}
                  <p className="text-sm text-muted-foreground font-medium">Traitements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card className="shadow-farm animate-fadeInUp opacity-0 animation-delay-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Événements récents</span>
            </CardTitle>
            <CardDescription>
              Les dernières activités de votre troupeau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={`skeleton-event-${index}`} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
                    <Skeleton className="h-6 w-6 sm:h-8 sm:w-8" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
                        <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
                      </div>
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                    </div>
                    <Skeleton className="h-5 sm:h-6 w-12 sm:w-16" />
                  </div>
                ))
              ) : (
                (recentEvents ?? []).map((event) => (
                  <div key={event.id} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="text-xl sm:text-2xl">{getTypeEvenementIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <h4 className="font-medium text-sm sm:text-base">{event.description}</h4>
                          <Badge variant="secondary" className="text-xs w-fit">
                            {event.cattleName}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-primary/20 text-primary bg-primary/5 text-xs w-fit sm:ml-auto"
                    >
                      {getTypeEvenementName(event.type)}
                    </Badge>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 text-center">
              <Link to="/cattle">
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300">
                  Voir tous les animaux
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}