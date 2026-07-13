import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show stable full-screen spinner while loading
  // Never render protected content or redirect during this time
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Only render protected content if user exists after loading
  // Otherwise redirect to login
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};