import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { refreshManager } from "@/utils/refreshManager";

export const useRefreshManagerBootstrap = (queryClient: QueryClient) => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    refreshManager.setQueryClient(queryClient);
    refreshManager.setNavigateCallback((path: string) => navigateRef.current(path));
    refreshManager.setClearCacheCallback(async () => {
      await queryClient.clear();
    });

    // No cleanup: AppProviders never unmounts in normal usage
    // Adding cleanup would cause issues in React StrictMode (mount/unmount cycles)
  }, [queryClient]);
};
