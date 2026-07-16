import { useAuth } from "@/features/auth/AuthContext";
import { isSuperAdmin, isFarmRole } from "@/constants/roles";
import { PageLoader } from "@/components/PageLoader";
import PlatformDashboard from "./PlatformDashboard";
import FarmDashboard from "./FarmDashboard";

const DashboardWrapper = () => {
  const { user, isLoading } = useAuth();

  // Show loader while session is being verified
  if (isLoading) {
    return <PageLoader />;
  }

  // Explicit role checks - no default fallback
  if (user?.role && isSuperAdmin(user.role)) {
    return <PlatformDashboard />;
  }

  if (user?.role && isFarmRole(user.role)) {
    return <FarmDashboard />;
  }

  // Handle unexpected role or null user after loading
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Rôle non reconnu</h2>
        <p className="text-muted-foreground">
          Votre rôle ({user?.role || 'non défini'}) n'est pas autorisé à accéder à cette page.
        </p>
      </div>
    </div>
  );
};

export default DashboardWrapper;
