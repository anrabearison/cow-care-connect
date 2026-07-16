import { Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UnifiedSidebar } from "@/components/UnifiedSidebar";
import { PageLoader } from "@/components/PageLoader";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { isSuperAdmin } from "@/constants/roles";

export const AdminLayout = () => {
  const { user } = useAuth();

  const getTitle = () => {
    if (isSuperAdmin(user?.role)) {
      return "Administration - Plateforme";
    }
    // For OWNER_ADMIN, we could use the owner name if available, but for now use a generic title
    // The user object doesn't seem to have ownerName directly, so we keep it generic
    return "Administration - Mon exploitation";
  };

  const showFrontOfficeButton = !isSuperAdmin(user?.role);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <UnifiedSidebar mode="admin" />
          <main className="flex-1 overflow-y-auto w-full">
            <header className="sticky top-0 z-10 h-12 flex items-center border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm shrink-0">
              <SidebarTrigger className="ml-4" />
              <div className="flex-1 px-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {getTitle()}
                </h2>
              </div>
              {showFrontOfficeButton && (
                <div className="px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2"
                  >
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      <span className="hidden sm:inline">Retour à mon élevage</span>
                    </Link>
                  </Button>
                </div>
              )}
            </header>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
