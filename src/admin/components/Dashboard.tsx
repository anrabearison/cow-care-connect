import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Beef, Activity, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Données simulées - à remplacer par de vraies données de votre API
  const stats = {
    totalCattle: 45,
    totalUsers: 8,
    healthyAnimals: 38,
    recentActivity: 12
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bovins</CardTitle>
            <Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCattle}</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +1 depuis la semaine dernière
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Animaux en santé</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthyAnimals}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.healthyAnimals / stats.totalCattle) * 100)}% du cheptel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activité récente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Actions dans les dernières 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alertes de santé</CardTitle>
            <CardDescription>
              Animaux nécessitant une attention particulière
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Bovin #007 - Taureau Zébu</span>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bovin #012 - Vache Holstein</span>
              <Badge variant="secondary">Surveillance</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bovin #023 - Génisse Limousine</span>
              <Badge variant="secondary">Contrôle routine</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Raccourcis vers les actions fréquentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 text-left rounded-md border hover:bg-muted transition-colors">
                <div className="font-medium text-sm">Ajouter un bovin</div>
                <div className="text-xs text-muted-foreground">Enregistrer un nouvel animal</div>
              </button>
              <button className="p-3 text-left rounded-md border hover:bg-muted transition-colors">
                <div className="font-medium text-sm">Rapport de santé</div>
                <div className="text-xs text-muted-foreground">Générer un rapport</div>
              </button>
              <button className="p-3 text-left rounded-md border hover:bg-muted transition-colors">
                <div className="font-medium text-sm">Nouvel utilisateur</div>
                <div className="text-xs text-muted-foreground">Créer un compte</div>
              </button>
              <button className="p-3 text-left rounded-md border hover:bg-muted transition-colors">
                <div className="font-medium text-sm">Exporter données</div>
                <div className="text-xs text-muted-foreground">CSV/Excel</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};