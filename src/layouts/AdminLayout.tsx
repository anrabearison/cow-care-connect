import { Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UnifiedSidebar } from "@/components/UnifiedSidebar";
import { PageLoader } from "@/components/PageLoader";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const AdminLayout = () => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <UnifiedSidebar mode="admin" />
        <main className="flex-1 overflow-y-auto w-full">
          <header className="sticky top-0 z-10 h-12 flex items-center border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm shrink-0">
            <SidebarTrigger className="ml-4" />
            <div className="flex-1 px-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Administration - Gestion du Bétail
              </h2>
            </div>
            <div className="px-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2"
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Front Office</span>
                </Link>
              </Button>
            </div>
          </header>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  </SidebarProvider>
);
