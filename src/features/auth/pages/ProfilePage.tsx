import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Edit3, Save, X } from 'lucide-react';
import { getRoleLabel, getRoleColor } from '@/constants/roles';
import { EXTERNAL_URLS } from '@/config/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

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
      </div>
    </div>
  );
};

export default ProfilePage;
