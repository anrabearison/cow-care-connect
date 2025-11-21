import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/features/auth/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AppSidebar } from "@/components/AppSidebar";
import HomePage from "./pages/HomePage";
import CattlePage from "@/features/cattle/pages/CattlePage";
import CattleDetailsPage from "@/features/cattle/pages/CattleDetailsPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import NotFound from "./pages/NotFound";
import { AdminApp } from "@/admin/AdminApp";
import { QUERY_STALE_TIME_MS, QUERY_CACHE_TIME_MS } from "@/constants/ui";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/*" element={
              <PrivateRoute>
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <main className="flex-1">
                      <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <SidebarTrigger className="ml-4" />
                        <div className="flex-1 px-4">
                          <h2 className="text-sm font-medium text-muted-foreground">
                            Système de Gestion d'Élevage
                          </h2>
                        </div>
                      </header>
                      <Routes>
                        <Route index element={<HomePage />} />
                        <Route path="cattle" element={<CattlePage />} />
                        <Route path="cattle/:id" element={<CattleDetailsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </SidebarProvider>
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
