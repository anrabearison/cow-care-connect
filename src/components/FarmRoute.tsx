import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { isFarmRole } from '@/constants/roles';

interface FarmRouteProps {
  children: React.ReactNode;
}

export const FarmRoute: React.FC<FarmRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isFarmRole(user.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
