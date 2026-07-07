import { Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { OwnerSelector } from "@/components/OwnerSelector";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { Outlet } from "react-router-dom";

export const MainLayout = () => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto w-full">
          <header className="sticky top-0 z-10 h-12 flex items-center border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm shrink-0">
            <SidebarTrigger className="ml-4" />
            <div className="flex-1 px-4 flex items-center justify-between min-w-0">
              <h2 className="text-sm font-medium text-muted-foreground truncate">
                Système de Gestion d'Élevage
              </h2>
              <OwnerSelector />
            </div>
          </header>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  </SidebarProvider>
);
