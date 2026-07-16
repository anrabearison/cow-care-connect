import { useAuth } from "@/features/auth/AuthContext";
import { USER_ROLES } from "@/constants/roles";
import PlatformDashboard from "./PlatformDashboard";
import FarmDashboard from "./FarmDashboard";

const DashboardWrapper = () => {
  const { user } = useAuth();

  // SUPER_ADMIN sees PlatformDashboard, OWNER_ADMIN/OWNER_USER see FarmDashboard
  if (user?.role === USER_ROLES.SUPER_ADMIN) {
    return <PlatformDashboard />;
  }

  return <FarmDashboard />;
};

export default DashboardWrapper;
