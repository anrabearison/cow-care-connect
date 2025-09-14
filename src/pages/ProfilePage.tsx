import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Edit3, Save, X } from 'lucide-react';

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'eleveur':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'veterinaire':
        return 'bg-green-500/10 text-green-700 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'eleveur':
        return 'Éleveur';
      case 'veterinaire':
        return 'Vétérinaire';
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* En-tête du profil */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et préférences
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Carte principale du profil */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription>
                    Vos détails de compte et informations de contact
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSave}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d9488&color=fff`} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
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

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Votre nom complet"
                    />
                  ) : (
                    <p className="text-sm bg-muted p-3 rounded-md">{user.name}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="votre@email.com"
                    />
                  ) : (
                    <p className="text-sm bg-muted p-3 rounded-md">{user.email}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Rôle</Label>
                  <p className="text-sm bg-muted p-3 rounded-md flex items-center gap-2">
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
              <CardTitle className="text-lg">Statistiques</CardTitle>
              <CardDescription>
                Votre activité sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Connexions</span>
                <Badge variant="secondary">24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dernière connexion</span>
                <span className="text-sm">Aujourd'hui</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Membre depuis</span>
                <span className="text-sm">2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carte de sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité du compte
            </CardTitle>
            <CardDescription>
              Gérez la sécurité de votre compte et vos préférences de connexion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mot de passe</h4>
                <p className="text-sm text-muted-foreground">
                  Dernière modification il y a 30 jours
                </p>
              </div>
              <Button variant="outline">
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