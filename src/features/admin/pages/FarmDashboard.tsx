import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beef, Activity, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const FarmDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord Exploitation</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de votre exploitation</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bovins</CardTitle>
            <Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalCattle || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.males || 0} mâles, {stats?.females || 0} femelles
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.totalTreatments || 0} traitements</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Erreur lors du chargement des statistiques: {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Santé du troupeau</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bovins en bonne santé</span>
                <span className="font-medium">{stats?.healthyCattle || 0} / {stats?.totalCattle || 0}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${stats?.healthPercentage || 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {stats?.healthPercentage?.toFixed(1) || 0}% de santé
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmDashboard;
