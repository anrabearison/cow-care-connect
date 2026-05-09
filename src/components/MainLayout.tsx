import { ReactNode, Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { OwnerSelector } from "@/components/OwnerSelector";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Routes, Route } from "react-router-dom";

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="space-y-4 w-full max-w-md p-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 h-12 flex items-center border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <SidebarTrigger className="ml-4" />
            <div className="flex-1 px-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                Système de Gestion d'Élevage
              </h2>
              <OwnerSelector />
            </div>
          </header>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* The nested routes are provided via children from App.tsx */}
              {children}
            </Routes>
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  </SidebarProvider>
);

