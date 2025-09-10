import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, Activity } from 'lucide-react';
import { getRecentEvents } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import heroImage from '@/assets/hero-cattle.jpg';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
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

export default function HomePage() {
  const { user } = useAuth();
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement asynchrone
    const timer = setTimeout(() => {
      setRecentEvents(getRecentEvents());
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/30" />
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center max-w-4xl px-6">
            <h1 className="text-5xl font-bold mb-4">
              Bienvenue, {user?.name}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Gérez votre troupeau avec efficacité et suivez la santé de vos animaux
            </p>
            <Link to="/cattle">
              <Button size="lg" className="bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-all duration-300">
                Voir le troupeau
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-card-soft hover:shadow-farm transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Animaux</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-soft hover:shadow-farm transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">95%</p>
                  <p className="text-sm text-muted-foreground">Santé</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-soft hover:shadow-farm transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/20 rounded-full">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Événements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-soft hover:shadow-farm transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-muted/20 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Traitements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card className="shadow-farm">
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
                  <div key={index} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <Skeleton className="h-8 w-8" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
              ) : (
                recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl">{getEventIcon(event.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{event.description}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {event.cattleName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-primary/20 text-primary bg-primary/5"
                    >
                      {event.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/cattle">
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
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