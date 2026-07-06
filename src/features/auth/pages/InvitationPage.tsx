import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Beef, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import { APP_URLS } from '@/config/urls';

interface InvitationData {
  email: string;
  role: string;
  ownerId?: string;
  expiresAt: string;
}

export default function InvitationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateInvitation = async () => {
      if (!token) {
        setError('Token d\'invitation manquant');
        setLoading(false);
        return;
      }

      try {
        const data = await apiClient.get<InvitationData>(`${API_ENDPOINTS.INVITATIONS.BASE}/validate/${token}`, undefined, { skipAuth: true });
        setInvitation(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Invitation validation error:', err);
        const message = err instanceof Error ? err.message : err?.response?.data?.message || 'Invitation invalide ou expirée';
        setError(message);
        setLoading(false);
      }
    };

    validateInvitation();
  }, [token]);

  const handleGoogleLogin = () => {
    if (!token) return;
    
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = APP_URLS.GOOGLE_CALLBACK;
    const scope = 'email profile';
    const state = token;
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&state=${state}`;
    
    window.location.href = googleAuthUrl;
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Administrateur';
      case 'OWNER_ADMIN':
        return 'Administrateur Propriétaire';
      case 'OWNER_USER':
        return 'Utilisateur Propriétaire';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-earth">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validation de l'invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-earth p-4">
        <Card className="w-full max-w-md shadow-farm border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Invitation invalide</CardTitle>
            <CardDescription>
              {error || 'Cette invitation n\'est pas valide ou a expiré.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-earth p-4">
      <Card className="w-full max-w-md shadow-farm border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
              <Beef className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Invitation à rejoindre</CardTitle>
          <CardDescription>
            Vous avez été invité à rejoindre l'application de gestion d'élevage
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <p className="font-medium">Invitation valide</p>
              <p className="text-sm">Cette invitation expire le {new Date(invitation.expiresAt).toLocaleDateString('fr-FR')}</p>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{invitation.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Rôle</span>
              <span className="font-medium">{getRoleLabel(invitation.role)}</span>
            </div>
            {invitation.ownerId && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Propriétaire</span>
                <span className="font-medium">Oui</span>
              </div>
            )}
          </div>

          {isExpired ? (
            <Alert className="bg-red-50 border-red-200">
              <Clock className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                Cette invitation a expiré. Veuillez contacter l'administrateur.
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-gradient-primary hover:opacity-90 transition-all"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              Continuer avec Google
            </Button>
          )}

          <p className="text-xs text-center text-muted-foreground">
            En continuant, vous acceptez de créer un compte avec l'email {invitation.email}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
