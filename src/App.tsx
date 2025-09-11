import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AppSidebar } from "@/components/AppSidebar";
import HomePage from "./pages/HomePage";
import CattlePage from "./pages/CattlePage";
import CattleDetailsPage from "./pages/CattleDetailsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { AdminApp } from "@/admin/AdminApp";

const queryClient = new QueryClient();

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
                        <Route path="/" element={<HomePage />} />
                        <Route path="/cattle" element={<CattlePage />} />
                        <Route path="/cattle/:id" element={<CattleDetailsPage />} />
                        <Route path="/profile" element={<div className="p-8"><h1>Profil utilisateur - En développement</h1></div>} />
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
