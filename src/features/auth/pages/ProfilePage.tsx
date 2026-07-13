import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Edit3, Save, X, Link2, Unlink, Loader2 } from 'lucide-react';
import { getRoleLabel, getRoleColor } from '@/constants/roles';
import { EXTERNAL_URLS } from '@/config/api';
import { APP_URLS } from '@/config/urls';
import { ProviderInfo } from '@/features/auth/services';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [linkingGoogle, setLinkingGoogle] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoadingProviders(true);
    try {
      const { authService } = await import('@/features/auth/services');
      const providersData = await authService.getUserProviders();
      setProviders(providersData);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleLinkGoogle = async () => {
    setLinkingGoogle(true);
    try {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = APP_URLS.GOOGLE_CALLBACK;
      const scope = 'email profile';

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&state=link`;

      // Note: window.location est utilisé ici car c'est une redirection vers un domaine externe (Google OAuth)
      // React Router ne peut pas naviguer vers des URLs externes
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Error linking Google:', error);
      toast({
        title: "Erreur",
        description: "Impossible de lier le compte Google",
        variant: "destructive",
      });
      setLinkingGoogle(false);
    }
  };

  const handleUnlinkProvider = async (provider: string) => {
    try {
      const { authService } = await import('@/features/auth/services');
      await authService.unlinkProvider(provider);
      await loadProviders();
      toast({
        title: "Provider dissocié",
        description: `Le compte ${provider} a été dissocié avec succès`,
      });
    } catch (error) {
      console.error('Error unlinking provider:', error);
      toast({
        title: "Erreur",
        description: "Impossible de dissocier ce provider",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Aucune information utilisateur disponible
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    // En mode développement, on simule la sauvegarde
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
  };

  // Role utility functions are now imported from constants/roles

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <div className="space-y-4 sm:space-y-6">
        {/* En-tête du profil */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mon Profil</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Gérez vos informations personnelles et préférences
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Vos détails de compte et informations de contact
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="w-full sm:w-auto order-1 sm:order-2"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src={`${EXTERNAL_URLS.UI_AVATARS_API}?name=${encodeURIComponent(user.name)}&background=0d9488&color=fff`} />
                  <AvatarFallback className="text-base sm:text-lg">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                  <Badge className={getRoleLabel(user.role)} variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3 sm:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm sm:text-base">Nom complet</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Votre nom complet"
                      className="text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-sm sm:text-base bg-muted p-2 sm:p-3 rounded-md">{user.name}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Adresse e-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-sm sm:text-base bg-muted p-2 sm:p-3 rounded-md">{user.email}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm sm:text-base">Rôle</Label>
                  <p className="text-sm sm:text-base bg-muted p-2 sm:p-3 rounded-md flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {getRoleLabel(user.role)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte des statistiques utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Statistiques</CardTitle>
              <CardDescription className="text-sm">
                Votre activité sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Connexions</span>
                <Badge variant="secondary" className="text-xs sm:text-sm">24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Dernière connexion</span>
                <span className="text-xs sm:text-sm">Aujourd'hui</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Membre depuis</span>
                <span className="text-xs sm:text-sm">2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carte de sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              Sécurité du compte
            </CardTitle>
            <CardDescription className="text-sm">
              Gérez la sécurité de votre compte et vos préférences de connexion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="font-medium text-sm sm:text-base">Mot de passe</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Dernière modification il y a 30 jours
                </p>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                Changer le mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Carte des providers de connexion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Méthodes de connexion
            </CardTitle>
            <CardDescription className="text-sm">
              Gérez les méthodes de connexion liées à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingProviders ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-3">
                {providers.map((provider) => (
                  <div
                    key={provider.provider}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {provider.provider === 'GOOGLE' && (
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      )}
                      <div>
                        <p className="font-medium text-sm sm:text-base capitalize">
                          {provider.provider === 'GOOGLE' ? 'Google' : provider.provider}
                        </p>
                        {provider.lastLoginAt && (
                          <p className="text-xs text-muted-foreground">
                            Dernière connexion: {new Date(provider.lastLoginAt).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnlinkProvider(provider.provider)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Unlink className="h-4 w-4 mr-2" />
                      Dissocier
                    </Button>
                  </div>
                ))}

                {!providers.find(p => p.provider === 'GOOGLE') && (
                  <Button
                    variant="outline"
                    onClick={handleLinkGoogle}
                    disabled={linkingGoogle}
                    className="w-full"
                  >
                    {linkingGoogle ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Liaison en cours...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Lier mon compte Google
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
