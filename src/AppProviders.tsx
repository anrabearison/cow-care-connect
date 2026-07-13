import { ReactNode, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/AuthContext";
import { OwnerSelectionProvider } from "@/contexts/OwnerSelectionContext";
import { HerdBookSelectionProvider } from "@/contexts/HerdBookSelectionContext";
import { QUERY_STALE_TIME_MS, QUERY_CACHE_TIME_MS } from "@/constants/ui";
import { refreshManager } from "@/utils/refreshManager";
import { useNavigate } from "react-router-dom";

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

interface AppProvidersProps {
  children: ReactNode;
}

const RefreshManagerSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Enregistrer le QueryClient dans le RefreshManager
    refreshManager.setQueryClient(queryClient);

    // Enregistrer le callback de navigation
    refreshManager.setNavigateCallback((path: string) => {
      navigate(path);
    });

    // Enregistrer le callback de nettoyage du cache
    refreshManager.setClearCacheCallback(async () => {
      await queryClient.clear();
    });
  }, [navigate]);

  return null;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <RefreshManagerSetup />
        <OwnerSelectionProvider>
          <HerdBookSelectionProvider>
            {children}
          </HerdBookSelectionProvider>
        </OwnerSelectionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

