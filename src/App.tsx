import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useOwnerSelection } from "@/contexts/OwnerSelectionContext";
import { setOwnerIdGetter } from "@/utils/apiClient";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { SuperAdminRoute } from "@/components/SuperAdminRoute";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { lazy, Suspense, useEffect } from "react";
import { AppProviders } from "@/AppProviders";
import { APP_ROUTE_PATHS } from "@/config/urls";

const HomePage = lazy(() => import("./pages/HomePage"));
const CattlePage = lazy(() => import("@/features/cattle/pages/CattlePage"));
const CattleDetailsPage = lazy(() => import("@/features/cattle/pages/CattleDetailsPage"));
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));
const PassportReportPage = lazy(() => import("@/features/reports/pages/PassportReportPage"));
const ProfilePage = lazy(() => import("@/features/auth/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const GoogleCallbackPage = lazy(() => import("@/features/auth/pages/GoogleCallbackPage"));
const InvitationPage = lazy(() => import("@/features/auth/pages/InvitationPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const CattleListPage = lazy(() => import("@/features/admin/pages/CattleListPage"));
const UsersListPage = lazy(() => import("@/features/admin/pages/UsersListPage"));
const VeterinariansListPage = lazy(() => import("@/features/admin/pages/VeterinariansListPage"));
const MedicamentsListPage = lazy(() => import("@/features/admin/pages/MedicamentsListPage"));
const EventTypesListPage = lazy(() => import("@/features/admin/pages/EventTypesListPage"));
const EventsListPage = lazy(() => import("@/features/admin/pages/EventsListPage"));
const TreatmentsListPage = lazy(() => import("@/features/admin/pages/TreatmentsListPage"));
const CategoriesListPage = lazy(() => import("@/features/admin/pages/CategoriesListPage"));
const StatusListPage = lazy(() => import("@/features/admin/pages/StatusListPage"));
const CharactersListPage = lazy(() => import("@/features/admin/pages/CharactersListPage"));
const HerdBooksListPage = lazy(() => import("@/features/admin/pages/HerdBooksListPage"));
const HerdBookCattleListPage = lazy(() => import("@/features/admin/pages/HerdBookCattleListPage"));
const OwnersListPage = lazy(() => import("@/features/admin/pages/OwnersListPage"));
const InvitationsListPage = lazy(() => import("@/features/admin/pages/InvitationsListPage"));
const PurchasesListPage = lazy(() => import("@/features/admin/pages/PurchasesListPage"));
const SuppliersListPage = lazy(() => import("@/features/admin/pages/SuppliersListPage"));


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
          <Route path={APP_ROUTE_PATHS.GOOGLE_CALLBACK} element={<GoogleCallbackPage />} />
          <Route path={APP_ROUTE_PATHS.INVITATION} element={<InvitationPage />} />
          
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="cattle" element={<CattleListPage />} />
            <Route path="users" element={<UsersListPage />} />
            <Route path="veterinarians" element={<VeterinariansListPage />} />
            <Route path="medicaments" element={<MedicamentsListPage />} />
            <Route path="event-types" element={<EventTypesListPage />} />
            <Route path="events" element={<EventsListPage />} />
            <Route path="treatments" element={<TreatmentsListPage />} />
            <Route path="categories" element={<CategoriesListPage />} />
            <Route path="status" element={<StatusListPage />} />
            <Route path="characters" element={<CharactersListPage />} />
            <Route path="herd-books" element={<HerdBooksListPage />} />
            <Route path="herd-book-cattle" element={<HerdBookCattleListPage />} />
            <Route path="purchases" element={<PurchasesListPage />} />
            <Route path="suppliers" element={<SuppliersListPage />} />
            <Route
              path="owners"
              element={
                <SuperAdminRoute>
                  <OwnersListPage />
                </SuperAdminRoute>
              }
            />
            <Route
              path="invitations"
              element={
                <SuperAdminRoute>
                  <InvitationsListPage />
                </SuperAdminRoute>
              }
            />
          </Route>
          
          {/* Frontoffice routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="cattle" element={<CattlePage />} />
            <Route path="cattle/:id" element={<CattleDetailsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/passport" element={<PassportReportPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
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
