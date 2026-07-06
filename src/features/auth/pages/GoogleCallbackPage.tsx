import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Loader2 } from 'lucide-react';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      if (handledRef.current) return;
      handledRef.current = true;
      const code = searchParams.get('code');
      const state = searchParams.get('state'); // C'est le token d'invitation

      if (!code) {
        setError('Code d\'autorisation manquant');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        const invitationToken = state ?? undefined;
        const success = await loginWithGoogle(code, invitationToken);
        if (success) {
          navigate('/');
        } else {
          setError('Échec de l\'authentification avec Google');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Google callback error:', err);
        setError('Erreur lors de l\'authentification avec Google');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, loginWithGoogle, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="text-red-500">
            <p className="text-lg font-medium mb-2">{error}</p>
            <p className="text-sm text-muted-foreground">Redirection vers la page de connexion...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Authentification avec Google en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
}
