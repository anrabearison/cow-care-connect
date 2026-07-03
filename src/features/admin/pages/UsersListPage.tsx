import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAuth } from "@/features/auth/AuthContext";
import { usersService, User } from "@/features/admin/services/usersService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { getRoleLabel, getRoleColor, USER_ROLES } from "@/constants/roles";

const UsersListPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch users list
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () =>
      usersService.getUsersList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
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
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  const columns: Column<User>[] = [
    {
      key: "id",
      header: "ID",
      render: (item) => (
        <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: "name",
      header: "Nom",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "role",
      header: "Rôle",
      render: (item) => (
        <Badge className={getRoleColor(item.role)}>
          {getRoleLabel(item.role)}
        </Badge>
      ),
    },
    {
      key: "owner",
      header: "Propriétaire",
      render: (item) => {
        if (!item.owner) return "-";
        if (typeof item.owner === 'string') return item.owner;
        if (item.owner.name) return String(item.owner.name);
        return "-";
      },
    },
    {
      key: "isActive",
      header: "Actif",
      render: (item) => (
        <Badge variant={item.isActive ? "default" : "secondary"}>
          {item.isActive ? "Oui" : "Non"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Créé le",
      render: (item) => new Date(item.createdAt).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground mt-2">Gestion des utilisateurs</p>
        </div>
      </div>

      <DataTable
        data={usersData?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => {
          setSelectedUser(item);
          setIsEditDialogOpen(true);
        }}
        onView={(item) => {
          setSelectedUser(item);
          setIsViewDialogOpen(true);
        }}
        onDelete={(item) => {
          setSelectedUser(item);
          setIsDeleteDialogOpen(true);
        }}
        onAdd={() => {
          setSelectedUser(null);
          setIsCreateDialogOpen(true);
        }}
        canEdit={true}
        canDelete={true}
        canView={true}
        canAdd={true}
        pagination={{
          page,
          pageSize,
          total: usersData?.total || 0,
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
        title="Détails de l'utilisateur"
        submitText="Fermer"
        cancelText=""
        onSubmit={() => setIsViewDialogOpen(false)}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom</Label>
                <p className="text-sm font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <Label>Rôle</Label>
                <p className="text-sm font-medium">{getRoleLabel(selectedUser.role)}</p>
              </div>
              <div>
                <Label>Propriétaire</Label>
                <p className="text-sm font-medium">{selectedUser.owner?.name || "-"}</p>
              </div>
              <div>
                <Label>Actif</Label>
                <p className="text-sm font-medium">{selectedUser.isActive ? "Oui" : "Non"}</p>
              </div>
              <div>
                <Label>Créé le</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedUser.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        )}
      </FormDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer l'utilisateur"
        description={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${selectedUser?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteMutation.isPending}
      />

      {/* Create Dialog */}
      <FormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Créer un utilisateur"
        submitText="Créer"
        cancelText="Annuler"
        onSubmit={() => {
          // TODO: Implement create logic
          setIsCreateDialogOpen(false);
        }}
      >
        <div className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input placeholder="Nom de l'utilisateur" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="email@example.com" />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input type="password" placeholder="Mot de passe" />
          </div>
          <div>
            <Label>Rôle</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={USER_ROLES.OWNER_USER}>Utilisateur</SelectItem>
                <SelectItem value={USER_ROLES.OWNER_ADMIN}>Admin Propriétaire</SelectItem>
                <SelectItem value={USER_ROLES.SUPER_ADMIN}>Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>
    </div>
  );
};

export default UsersListPage;
