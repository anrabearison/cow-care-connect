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
import { PageLoader } from "@/components/PageLoader";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
const CattleCreatePage = lazy(() => import("@/features/admin/pages/CattleCreatePage"));
const CattleEditPage = lazy(() => import("@/features/admin/pages/CattleEditPage"));
const CattleDetailPage = lazy(() => import("@/features/admin/pages/CattleDetailPage"));
const UsersListPage = lazy(() => import("@/features/admin/pages/UsersListPage"));
const UsersCreatePage = lazy(() => import("@/features/admin/pages/UsersCreatePage"));
const UsersEditPage = lazy(() => import("@/features/admin/pages/UsersEditPage"));
const UsersDetailPage = lazy(() => import("@/features/admin/pages/UsersDetailPage"));
const VeterinariansListPage = lazy(() => import("@/features/admin/pages/VeterinariansListPage"));
const VeterinariansCreatePage = lazy(() => import("@/features/admin/pages/VeterinariansCreatePage"));
const VeterinariansEditPage = lazy(() => import("@/features/admin/pages/VeterinariansEditPage"));
const VeterinariansDetailPage = lazy(() => import("@/features/admin/pages/VeterinariansDetailPage"));
const MedicamentsListPage = lazy(() => import("@/features/admin/pages/MedicamentsListPage"));
const MedicamentsCreatePage = lazy(() => import("@/features/admin/pages/MedicamentsCreatePage"));
const MedicamentsEditPage = lazy(() => import("@/features/admin/pages/MedicamentsEditPage"));
const MedicamentsDetailPage = lazy(() => import("@/features/admin/pages/MedicamentsDetailPage"));
const EventTypesListPage = lazy(() => import("@/features/admin/pages/EventTypesListPage"));
const EventsListPage = lazy(() => import("@/features/admin/pages/EventsListPage"));
const EventsCreatePage = lazy(() => import("@/features/admin/pages/EventsCreatePage"));
const EventsEditPage = lazy(() => import("@/features/admin/pages/EventsEditPage"));
const EventsDetailPage = lazy(() => import("@/features/admin/pages/EventsDetailPage"));
const TreatmentsListPage = lazy(() => import("@/features/admin/pages/TreatmentsListPage"));
const TreatmentsCreatePage = lazy(() => import("@/features/admin/pages/TreatmentsCreatePage"));
const TreatmentsEditPage = lazy(() => import("@/features/admin/pages/TreatmentsEditPage"));
const TreatmentsDetailPage = lazy(() => import("@/features/admin/pages/TreatmentsDetailPage"));
const CategoriesListPage = lazy(() => import("@/features/admin/pages/CategoriesListPage"));
const StatusListPage = lazy(() => import("@/features/admin/pages/StatusListPage"));
const CharactersListPage = lazy(() => import("@/features/admin/pages/CharactersListPage"));
const HerdBooksListPage = lazy(() => import("@/features/admin/pages/HerdBooksListPage"));
const HerdBookCreatePage = lazy(() => import("@/features/admin/pages/HerdBookCreatePage"));
const HerdBookEditPage = lazy(() => import("@/features/admin/pages/HerdBookEditPage"));
const HerdBookDetailPage = lazy(() => import("@/features/admin/pages/HerdBookDetailPage"));
const HerdBookCattleListPage = lazy(() => import("@/features/admin/pages/HerdBookCattleListPage"));
const HerdBookCattleCreatePage = lazy(() => import("@/features/admin/pages/HerdBookCattleCreatePage"));
const HerdBookCattleEditPage = lazy(() => import("@/features/admin/pages/HerdBookCattleEditPage"));
const HerdBookCattleDetailPage = lazy(() => import("@/features/admin/pages/HerdBookCattleDetailPage"));
const OwnersListPage = lazy(() => import("@/features/admin/pages/OwnersListPage"));
const OwnerCreatePage = lazy(() => import("@/features/admin/pages/OwnerCreatePage"));
const OwnerEditPage = lazy(() => import("@/features/admin/pages/OwnerEditPage"));
const OwnerDetailPage = lazy(() => import("@/features/admin/pages/OwnerDetailPage"));
const InvitationsListPage = lazy(() => import("@/features/admin/pages/InvitationsListPage"));
const PurchasesListPage = lazy(() => import("@/features/admin/pages/PurchasesListPage"));
const PurchaseCreatePage = lazy(() => import("@/features/admin/pages/PurchaseCreatePage"));
const PurchaseEditPage = lazy(() => import("@/features/admin/pages/PurchaseEditPage"));
const PurchaseDetailPage = lazy(() => import("@/features/admin/pages/PurchaseDetailPage"));
const SuppliersListPage = lazy(() => import("@/features/admin/pages/SuppliersListPage"));
const SuppliersCreatePage = lazy(() => import("@/features/admin/pages/SuppliersCreatePage"));
const SuppliersEditPage = lazy(() => import("@/features/admin/pages/SuppliersEditPage"));
const SuppliersDetailPage = lazy(() => import("@/features/admin/pages/SuppliersDetailPage"));

// Passport pages
const PassportCreatePage = lazy(() => import("@/features/passport/pages/PassportCreatePage"));
const PassportEditPage = lazy(() => import("@/features/passport/pages/PassportEditPage"));
const PassportDetailPage = lazy(() => import("@/features/passport/pages/PassportDetailPage"));


// Internal component that has access to the context
const AppContent = () => {
  const { selectedOwnerId } = useOwnerSelection();

  // Connect the context to the apiClient
  useEffect(() => {
    setOwnerIdGetter(() => selectedOwnerId);
  }, [selectedOwnerId]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
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
          <Route path="cattle/new" element={<CattleCreatePage />} />
          <Route path="cattle/:id" element={<CattleDetailPage />} />
          <Route path="cattle/:id/edit" element={<CattleEditPage />} />
          <Route path="users" element={<UsersListPage />} />
          <Route path="users/new" element={<UsersCreatePage />} />
          <Route path="users/:id" element={<UsersDetailPage />} />
          <Route path="users/:id/edit" element={<UsersEditPage />} />
          <Route path="veterinarians" element={<VeterinariansListPage />} />
          <Route path="veterinarians/new" element={<VeterinariansCreatePage />} />
          <Route path="veterinarians/:id" element={<VeterinariansDetailPage />} />
          <Route path="veterinarians/:id/edit" element={<VeterinariansEditPage />} />
          <Route path="medicaments" element={<MedicamentsListPage />} />
          <Route path="medicaments/new" element={<MedicamentsCreatePage />} />
          <Route path="medicaments/:id" element={<MedicamentsDetailPage />} />
          <Route path="medicaments/:id/edit" element={<MedicamentsEditPage />} />
          <Route path="event-types" element={<EventTypesListPage />} />
          <Route path="events" element={<EventsListPage />} />
          <Route path="events/new" element={<EventsCreatePage />} />
          <Route path="events/:id" element={<EventsDetailPage />} />
          <Route path="events/:id/edit" element={<EventsEditPage />} />
          <Route path="treatments" element={<TreatmentsListPage />} />
          <Route path="treatments/new" element={<TreatmentsCreatePage />} />
          <Route path="treatments/:id" element={<TreatmentsDetailPage />} />
          <Route path="treatments/:id/edit" element={<TreatmentsEditPage />} />
          <Route path="categories" element={<CategoriesListPage />} />
          <Route path="status" element={<StatusListPage />} />
          <Route path="characters" element={<CharactersListPage />} />
          <Route path="herd-books" element={<HerdBooksListPage />} />
          <Route path="herd-books/new" element={<HerdBookCreatePage />} />
          <Route path="herd-books/:id" element={<HerdBookDetailPage />} />
          <Route path="herd-books/:id/edit" element={<HerdBookEditPage />} />
          <Route path="herd-book-cattle" element={<HerdBookCattleListPage />} />
          <Route path="herd-book-cattle/new" element={<HerdBookCattleCreatePage />} />
          <Route path="herd-book-cattle/:id" element={<HerdBookCattleDetailPage />} />
          <Route path="herd-book-cattle/:id/edit" element={<HerdBookCattleEditPage />} />
          <Route path="passports/new" element={<PassportCreatePage />} />
          <Route path="passports/:id" element={<PassportDetailPage />} />
          <Route path="passports/:id/edit" element={<PassportEditPage />} />
          <Route path="purchases" element={<PurchasesListPage />} />
          <Route path="purchases/new" element={<PurchaseCreatePage />} />
          <Route path="purchases/:id" element={<PurchaseDetailPage />} />
          <Route path="purchases/:id/edit" element={<PurchaseEditPage />} />
          <Route path="suppliers" element={<SuppliersListPage />} />
          <Route path="suppliers/new" element={<SuppliersCreatePage />} />
          <Route path="suppliers/:id" element={<SuppliersDetailPage />} />
          <Route path="suppliers/:id/edit" element={<SuppliersEditPage />} />
          <Route
            path="owners"
            element={
              <SuperAdminRoute>
                <OwnersListPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="owners/new"
            element={
              <SuperAdminRoute>
                <OwnerCreatePage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="owners/:id"
            element={
              <SuperAdminRoute>
                <OwnerDetailPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="owners/:id/edit"
            element={
              <SuperAdminRoute>
                <OwnerEditPage />
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
    </ErrorBoundary>
  );
};

const App = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <AppProviders>
      <AppContent />
    </AppProviders>
  </BrowserRouter>
);

export default App;
