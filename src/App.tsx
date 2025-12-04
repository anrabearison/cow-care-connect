import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/features/auth/AuthContext";
import { OwnerSelectionProvider, useOwnerSelection } from "@/contexts/OwnerSelectionContext";
import { setOwnerIdGetter } from "@/utils/apiClient";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { OwnerSelector } from "@/components/OwnerSelector";
import { lazy, Suspense, useEffect } from "react";
import { QUERY_STALE_TIME_MS, QUERY_CACHE_TIME_MS } from "@/constants/ui";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const CattlePage = lazy(() => import("@/features/cattle/pages/CattlePage"));
const CattleDetailsPage = lazy(() => import("@/features/cattle/pages/CattleDetailsPage"));
const ProfilePage = lazy(() => import("@/features/auth/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminApp = lazy(() => import("@/admin/AdminApp").then(module => ({ default: module.AdminApp })));


// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="space-y-4 w-full max-w-md p-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

// Créer QueryClient en dehors du composant pour éviter la recréation à chaque render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      gcTime: QUERY_CACHE_TIME_MS,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Internal component that has access to the context
const AppContent = () => {
  const { selectedOwnerId } = useOwnerSelection();

  // Connect the context to the apiClient
  useEffect(() => {
    setOwnerIdGetter(() => selectedOwnerId);
  }, [selectedOwnerId]);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={
            <PrivateRoute>
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
                          <Route index element={<HomePage />} />
                          <Route path="cattle" element={<CattlePage />} />
                          <Route path="cattle/:id" element={<CattleDetailsPage />} />
                          <Route path="profile" element={<ProfilePage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </main>
                  </div>
                  <Footer />
                </div>
              </SidebarProvider>
            </PrivateRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <OwnerSelectionProvider>
          <AppContent />
        </OwnerSelectionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
