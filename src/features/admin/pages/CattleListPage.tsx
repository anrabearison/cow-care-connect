import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAuth } from "@/features/auth/AuthContext";
import { cattleService } from "@/features/cattle/services";
import { Cattle } from "@/features/cattle/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { isSuperAdmin } from "@/constants/roles";
import { CattlePhotosInput, CattlePhotoInputValue } from "@/features/cattle/components/CattlePhotosInput";

const CattleListPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [photos, setPhotos] = useState<CattlePhotoInputValue[]>([]);

  // Fetch cattle list
  const { data: cattleData, isLoading } = useQuery({
    queryKey: ["admin-cattle", page, search],
    queryFn: () =>
      cattleService.getCattleList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => cattleService.deleteCattle(id),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Bovin supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-cattle"] });
      setIsDeleteDialogOpen(false);
      setSelectedCattle(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (selectedCattle) {
      deleteMutation.mutate(selectedCattle.id);
    }
  };

  const updatePhotosMutation = useMutation({
    mutationFn: ({ id, photos }: { id: string; photos: CattlePhotoInputValue[] }) =>
      cattleService.updateCattle(id, { photos }),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Photos du bovin mises à jour",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-cattle"] });
      queryClient.invalidateQueries({ queryKey: ["cattle"] });
      setIsEditDialogOpen(false);
      setSelectedCattle(null);
      setPhotos([]);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour des photos",
        variant: "destructive",
      });
    },
  });

  const openPhotosDialog = (cattle: Cattle) => {
    setSelectedCattle(cattle);
    const initialPhotos = (cattle.photos && cattle.photos.length > 0
      ? cattle.photos
      : cattle.photo
        ? [{ url: cattle.photo, position: 0, isPrimary: true }]
        : []
    ).map((photo, index) => ({
      id: photo.id,
      url: photo.url,
      publicId: photo.publicId,
      position: photo.position ?? index,
      isPrimary: photo.isPrimary ?? index === 0,
    }));
    setPhotos(initialPhotos);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePhotos = () => {
    if (!selectedCattle) return;
    updatePhotosMutation.mutate({ id: selectedCattle.id, photos });
  };

  const columns: Column<Cattle>[] = [
    {
      key: "name",
      header: "Nom",
    },
    {
      key: "tagNumber",
      header: "Numéro de tag",
    },
    {
      key: "gender",
      header: "Sexe",
      render: (item) => (
        <Badge variant={item.gender === "M" ? "default" : "secondary"}>
          {item.gender === "M" ? "Mâle" : "Femelle"}
        </Badge>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      render: (item) => {
        if (!item.category) return "-";
        if (typeof item.category === 'string') return item.category;
        if (item.category.name) return String(item.category.name);
        return "-";
      },
    },
    {
      key: "birthDate",
      header: "Date de naissance",
      render: (item) =>
        item.birthDate ? new Date(item.birthDate).toLocaleDateString("fr-FR") : "-",
    },
    {
      key: "status",
      header: "Statut",
      render: (item) => {
        const statusValue = typeof item.status === 'string' ? item.status : (item.status?.name || "-");
        const statusStr = String(statusValue);
        return (
          <Badge
            variant={
              statusStr === "ACTIVE"
                ? "default"
                : statusStr === "SOLD"
                ? "secondary"
                : "destructive"
            }
          >
            {statusStr}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Bovins</h1>
          <p className="text-muted-foreground mt-2">Gestion du troupeau</p>
        </div>
      </div>

      <DataTable
        data={cattleData?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => {
          openPhotosDialog(item);
        }}
        onView={(item) => {
          setSelectedCattle(item);
          setIsViewDialogOpen(true);
        }}
        onDelete={(item) => {
          setSelectedCattle(item);
          setIsDeleteDialogOpen(true);
        }}
        canEdit={true}
        canDelete={true}
        canView={true}
        canAdd={false}
        pagination={{
          page,
          pageSize,
          total: cattleData?.total || 0,
          onPageChange: setPage,
        }}
        search={{
          value: search,
          onChange: setSearch,
        }}
      />

      {/* View Dialog */}
      <FormDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title="Détails du bovin"
        submitText="Fermer"
        cancelText=""
        onSubmit={() => setIsViewDialogOpen(false)}
      >
        {selectedCattle && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-medium font-mono">{selectedCattle.id}</p>
              </div>
              <div>
                <Label>Nom</Label>
                <p className="text-sm font-medium">{selectedCattle.name}</p>
              </div>
              <div>
                <Label>Numéro de carnet</Label>
                <p className="text-sm font-medium">{selectedCattle.nCarnet || "-"}</p>
              </div>
              <div>
                <Label>Sexe</Label>
                <p className="text-sm font-medium">
                  {selectedCattle.gender === "M" ? "Mâle" : "Femelle"}
                </p>
              </div>
              <div>
                <Label>Date de naissance</Label>
                <p className="text-sm font-medium">
                  {selectedCattle.birthDate
                    ? new Date(selectedCattle.birthDate).toLocaleDateString("fr-FR")
                    : "-"}
                </p>
              </div>
              <div>
                <Label>Catégorie</Label>
                <p className="text-sm font-medium">
                  {(() => {
                    if (!selectedCattle.category) return "-";
                    if (typeof selectedCattle.category === 'string') return selectedCattle.category;
                    return String(selectedCattle.category.name || "-");
                  })()}
                </p>
              </div>
              <div>
                <Label>Statut</Label>
                <p className="text-sm font-medium">{(() => {
                  if (!selectedCattle.status) return "-";
                  if (typeof selectedCattle.status === 'string') return selectedCattle.status;
                  return String(selectedCattle.status.name || "-");
                })()}</p>
              </div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={`Photos de ${selectedCattle?.name || "bovin"}`}
        submitText="Enregistrer"
        cancelText="Annuler"
        onSubmit={handleUpdatePhotos}
        loading={updatePhotosMutation.isPending}
      >
        <CattlePhotosInput
          value={photos}
          onChange={setPhotos}
          disabled={updatePhotosMutation.isPending}
        />
      </FormDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le bovin"
        description={`Êtes-vous sûr de vouloir supprimer le bovin "${selectedCattle?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CattleListPage;
