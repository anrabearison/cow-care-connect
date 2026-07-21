import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { AuthProvider } from "@/features/auth/AuthContext";
import { HerdBookSelectionProvider } from "@/contexts/HerdBookSelectionContext";
import { QUERY_STALE_TIME_MS, QUERY_CACHE_TIME_MS } from "@/constants/ui";
import { useRefreshManagerBootstrap } from "@/hooks/useRefreshManagerBootstrap";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Permet à une query précise de désactiver ce toast global si son échec
      // est déjà géré/attendu ailleurs (ex: vérification de session au démarrage,
      // requêtes avec leur propre gestion d'erreur dédiée dans le composant).
      if (query.meta?.silent) {
        return;
      }

      const description =
        error instanceof Error && error.message
          ? error.message
          : "Une erreur est survenue lors du chargement des données.";

      toast({
        title: "Erreur de chargement",
        description,
        variant: "destructive",
      });
    },
  }),
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

const AppProvidersInner = ({ children }: AppProvidersProps) => {
  useRefreshManagerBootstrap(queryClient);

  return (
    <AuthProvider>
      <HerdBookSelectionProvider>
        {children}
      </HerdBookSelectionProvider>
    </AuthProvider>
  );
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvidersInner>
        {children}
      </AppProvidersInner>
    </TooltipProvider>
  </QueryClientProvider>
);

