import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { OwnerSelectionProvider, useOwnerSelection } from "@/contexts/OwnerSelectionContext";
import { HerdBookSelectionProvider } from "@/contexts/HerdBookSelectionContext";
import { setOwnerIdGetter } from "@/utils/apiClient";
import { PrivateRoute } from "@/components/PrivateRoute";
import { MainLayout } from "@/components/MainLayout";
import { lazy, Suspense, useEffect } from "react";
import { AppProviders } from "@/AppProviders";

const HomePage = lazy(() => import("./pages/HomePage"));
const CattlePage = lazy(() => import("@/features/cattle/pages/CattlePage"));
const CattleDetailsPage = lazy(() => import("@/features/cattle/pages/CattleDetailsPage"));
const ProfilePage = lazy(() => import("@/features/auth/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminApp = lazy(() => import("@/admin/AdminApp").then(module => ({ default: module.AdminApp })));


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
      <Suspense fallback={null}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Route index element={<HomePage />} />
                  <Route path="cattle" element={<CattlePage />} />
                  <Route path="cattle/:id" element={<CattleDetailsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="*" element={<NotFound />} />
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => (
  <AppProviders>
    <AppContent />
  </AppProviders>
);

export default App;
