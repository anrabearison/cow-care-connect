import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { SuperAdminRoute } from "@/components/SuperAdminRoute";
import { FarmRoute } from "@/components/FarmRoute";
import { OwnerAdminRoute } from "@/components/OwnerAdminRoute";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { lazy, Suspense } from "react";
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
const DashboardWrapper = lazy(() => import("@/features/admin/pages/DashboardWrapper"));
const CattleListPage = lazy(() => import("@/features/admin/pages/cattle/CattleListPage"));
const CattleCreatePage = lazy(() => import("@/features/admin/pages/cattle/CattleCreatePage"));
const CattleEditPage = lazy(() => import("@/features/admin/pages/cattle/CattleEditPage"));
const CattleDetailPage = lazy(() => import("@/features/admin/pages/cattle/CattleDetailPage"));
const UsersListPage = lazy(() => import("@/features/admin/pages/users/UsersListPage"));
const UsersCreatePage = lazy(() => import("@/features/admin/pages/users/UsersCreatePage"));
const UsersEditPage = lazy(() => import("@/features/admin/pages/users/UsersEditPage"));
const UsersDetailPage = lazy(() => import("@/features/admin/pages/users/UsersDetailPage"));
const VeterinariansListPage = lazy(() => import("@/features/admin/pages/veterinarians/VeterinariansListPage"));
const VeterinariansCreatePage = lazy(() => import("@/features/admin/pages/veterinarians/VeterinariansCreatePage"));
const VeterinariansEditPage = lazy(() => import("@/features/admin/pages/veterinarians/VeterinariansEditPage"));
const VeterinariansDetailPage = lazy(() => import("@/features/admin/pages/veterinarians/VeterinariansDetailPage"));
const MedicamentsListPage = lazy(() => import("@/features/admin/pages/medicaments/MedicamentsListPage"));
const MedicamentsCreatePage = lazy(() => import("@/features/admin/pages/medicaments/MedicamentsCreatePage"));
const MedicamentsEditPage = lazy(() => import("@/features/admin/pages/medicaments/MedicamentsEditPage"));
const MedicamentsDetailPage = lazy(() => import("@/features/admin/pages/medicaments/MedicamentsDetailPage"));
const EventTypesListPage = lazy(() => import("@/features/admin/pages/event-types/EventTypesListPage"));
const EventTypesCreatePage = lazy(() => import("@/features/admin/pages/event-types/EventTypesCreatePage"));
const EventTypesEditPage = lazy(() => import("@/features/admin/pages/event-types/EventTypesEditPage"));
const EventTypesDetailPage = lazy(() => import("@/features/admin/pages/event-types/EventTypesDetailPage"));
const EventsListPage = lazy(() => import("@/features/admin/pages/events/EventsListPage"));
const EventsCreatePage = lazy(() => import("@/features/admin/pages/events/EventsCreatePage"));
const EventsEditPage = lazy(() => import("@/features/admin/pages/events/EventsEditPage"));
const EventsDetailPage = lazy(() => import("@/features/admin/pages/events/EventsDetailPage"));
const TreatmentsListPage = lazy(() => import("@/features/admin/pages/treatments/TreatmentsListPage"));
const TreatmentsCreatePage = lazy(() => import("@/features/admin/pages/treatments/TreatmentsCreatePage"));
const TreatmentsEditPage = lazy(() => import("@/features/admin/pages/treatments/TreatmentsEditPage"));
const TreatmentsDetailPage = lazy(() => import("@/features/admin/pages/treatments/TreatmentsDetailPage"));
const CategoriesListPage = lazy(() => import("@/features/admin/pages/categories/CategoriesListPage"));
const CategoriesCreatePage = lazy(() => import("@/features/admin/pages/categories/CategoriesCreatePage"));
const CategoriesEditPage = lazy(() => import("@/features/admin/pages/categories/CategoriesEditPage"));
const CategoriesDetailPage = lazy(() => import("@/features/admin/pages/categories/CategoriesDetailPage"));
const StatusListPage = lazy(() => import("@/features/admin/pages/status/StatusListPage"));
const StatusCreatePage = lazy(() => import("@/features/admin/pages/status/StatusCreatePage"));
const StatusEditPage = lazy(() => import("@/features/admin/pages/status/StatusEditPage"));
const StatusDetailPage = lazy(() => import("@/features/admin/pages/status/StatusDetailPage"));
const CharactersListPage = lazy(() => import("@/features/admin/pages/characters/CharactersListPage"));
const CharactersCreatePage = lazy(() => import("@/features/admin/pages/characters/CharactersCreatePage"));
const CharactersEditPage = lazy(() => import("@/features/admin/pages/characters/CharactersEditPage"));
const CharactersDetailPage = lazy(() => import("@/features/admin/pages/characters/CharactersDetailPage"));
const HerdBooksListPage = lazy(() => import("@/features/admin/pages/herd-books/HerdBooksListPage"));
const HerdBookCreatePage = lazy(() => import("@/features/admin/pages/herd-books/HerdBookCreatePage"));
const HerdBookEditPage = lazy(() => import("@/features/admin/pages/herd-books/HerdBookEditPage"));
const HerdBookDetailPage = lazy(() => import("@/features/admin/pages/herd-books/HerdBookDetailPage"));
const HerdBookCattleListPage = lazy(() => import("@/features/admin/pages/herd-book-cattle/HerdBookCattleListPage"));
const HerdBookCattleCreatePage = lazy(() => import("@/features/admin/pages/herd-book-cattle/HerdBookCattleCreatePage"));
const HerdBookCattleEditPage = lazy(() => import("@/features/admin/pages/herd-book-cattle/HerdBookCattleEditPage"));
const HerdBookCattleDetailPage = lazy(() => import("@/features/admin/pages/herd-book-cattle/HerdBookCattleDetailPage"));
const OwnersListPage = lazy(() => import("@/features/admin/pages/owners/OwnersListPage"));
const OwnerCreatePage = lazy(() => import("@/features/admin/pages/owners/OwnerCreatePage"));
const OwnerEditPage = lazy(() => import("@/features/admin/pages/owners/OwnerEditPage"));
const OwnerDetailPage = lazy(() => import("@/features/admin/pages/owners/OwnerDetailPage"));
const InvitationsListPage = lazy(() => import("@/features/admin/pages/invitations/InvitationsListPage"));
const PurchasesListPage = lazy(() => import("@/features/admin/pages/purchases/PurchasesListPage"));
const PurchaseCreatePage = lazy(() => import("@/features/admin/pages/purchases/PurchaseCreatePage"));
const PurchaseEditPage = lazy(() => import("@/features/admin/pages/purchases/PurchaseEditPage"));
const PurchaseDetailPage = lazy(() => import("@/features/admin/pages/purchases/PurchaseDetailPage"));
const SuppliersListPage = lazy(() => import("@/features/admin/pages/suppliers/SuppliersListPage"));
const SuppliersCreatePage = lazy(() => import("@/features/admin/pages/suppliers/SuppliersCreatePage"));
const SuppliersEditPage = lazy(() => import("@/features/admin/pages/suppliers/SuppliersEditPage"));
const SuppliersDetailPage = lazy(() => import("@/features/admin/pages/suppliers/SuppliersDetailPage"));

// Passport pages
const PassportCreatePage = lazy(() => import("@/features/passport/pages/PassportCreatePage"));
const PassportEditPage = lazy(() => import("@/features/passport/pages/PassportEditPage"));
const PassportDetailPage = lazy(() => import("@/features/passport/pages/PassportDetailPage"));


// Internal component that has access to the context
const AppContent = () => {
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
          <Route index element={<DashboardWrapper />} />
          <Route
            path="cattle"
            element={
              <OwnerAdminRoute>
                <CattleListPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="cattle/new"
            element={
              <OwnerAdminRoute>
                <CattleCreatePage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="cattle/:id"
            element={
              <OwnerAdminRoute>
                <CattleDetailPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="cattle/:id/edit"
            element={
              <OwnerAdminRoute>
                <CattleEditPage />
              </OwnerAdminRoute>
            }
          />
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
          <Route path="event-types/new" element={<EventTypesCreatePage />} />
          <Route path="event-types/:id" element={<EventTypesDetailPage />} />
          <Route path="event-types/:id/edit" element={<EventTypesEditPage />} />
          <Route
            path="events"
            element={
              <OwnerAdminRoute>
                <EventsListPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="events/new"
            element={
              <OwnerAdminRoute>
                <EventsCreatePage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="events/:id"
            element={
              <OwnerAdminRoute>
                <EventsDetailPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="events/:id/edit"
            element={
              <OwnerAdminRoute>
                <EventsEditPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="treatments"
            element={
              <OwnerAdminRoute>
                <TreatmentsListPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="treatments/new"
            element={
              <OwnerAdminRoute>
                <TreatmentsCreatePage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="treatments/:id"
            element={
              <OwnerAdminRoute>
                <TreatmentsDetailPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="treatments/:id/edit"
            element={
              <OwnerAdminRoute>
                <TreatmentsEditPage />
              </OwnerAdminRoute>
            }
          />
          <Route path="categories" element={<CategoriesListPage />} />
          <Route path="categories/new" element={<CategoriesCreatePage />} />
          <Route path="categories/:id" element={<CategoriesDetailPage />} />
          <Route path="categories/:id/edit" element={<CategoriesEditPage />} />
          <Route path="status" element={<StatusListPage />} />
          <Route path="status/new" element={<StatusCreatePage />} />
          <Route path="status/:id" element={<StatusDetailPage />} />
          <Route path="status/:id/edit" element={<StatusEditPage />} />
          <Route path="characters" element={<CharactersListPage />} />
          <Route path="characters/new" element={<CharactersCreatePage />} />
          <Route path="characters/:id" element={<CharactersDetailPage />} />
          <Route path="characters/:id/edit" element={<CharactersEditPage />} />
          <Route
            path="herd-books"
            element={
              <OwnerAdminRoute>
                <HerdBooksListPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="herd-books/new"
            element={
              <OwnerAdminRoute>
                <HerdBookCreatePage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="herd-books/:id"
            element={
              <OwnerAdminRoute>
                <HerdBookDetailPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="herd-books/:id/edit"
            element={
              <OwnerAdminRoute>
                <HerdBookEditPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="herd-book-cattle"
            element={
              <OwnerAdminRoute>
                <HerdBookCattleListPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="herd-book-cattle/new"
            element={
              <OwnerAdminRoute>
                <HerdBookCattleCreatePage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="herd-book-cattle/:id"
            element={
              <OwnerAdminRoute>
                <HerdBookCattleDetailPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="herd-book-cattle/:id/edit"
            element={
              <OwnerAdminRoute>
                <HerdBookCattleEditPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="passports/new"
            element={
              <OwnerAdminRoute>
                <PassportCreatePage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="passports/:id"
            element={
              <OwnerAdminRoute>
                <PassportDetailPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="passports/:id/edit"
            element={
              <OwnerAdminRoute>
                <PassportEditPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="purchases"
            element={
              <OwnerAdminRoute>
                <PurchasesListPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="purchases/new"
            element={
              <OwnerAdminRoute>
                <PurchaseCreatePage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="purchases/:id"
            element={
              <OwnerAdminRoute>
                <PurchaseDetailPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="purchases/:id/edit"
            element={
              <OwnerAdminRoute>
                <PurchaseEditPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="suppliers"
            element={
              <OwnerAdminRoute>
                <SuppliersListPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="suppliers/new"
            element={
              <OwnerAdminRoute>
                <SuppliersCreatePage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="suppliers/:id"
            element={
              <OwnerAdminRoute>
                <SuppliersDetailPage />
              </OwnerAdminRoute>
            }
          />
          <Route
            path="suppliers/:id/edit"
            element={
              <OwnerAdminRoute>
                <SuppliersEditPage />
              </OwnerAdminRoute>
            }
          />
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
              <AdminRoute>
                <InvitationsListPage />
              </AdminRoute>
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
          <Route
            path="cattle"
            element={
              <FarmRoute>
                <CattlePage />
              </FarmRoute>
            }
          />
          <Route
            path="cattle/:id"
            element={
              <FarmRoute>
                <CattleDetailsPage />
              </FarmRoute>
            }
          />
          <Route
            path="reports"
            element={
              <FarmRoute>
                <ReportsPage />
              </FarmRoute>
            }
          />
          <Route
            path="reports/passport"
            element={
              <FarmRoute>
                <PassportReportPage />
              </FarmRoute>
            }
          />
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
