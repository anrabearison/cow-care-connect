import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAuth } from "@/features/auth/AuthContext";
import { usersService, User, CreateUserData } from "@/features/admin/services/usersService";
import { ownersService, Owner } from "@/features/admin/services/ownersService";
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
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'OWNER_USER',
    ownerId: '',
  });

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

  // Fetch owners list for dropdown
  const { data: ownersData } = useQuery({
    queryKey: ["admin-owners"],
    queryFn: () => ownersService.getOwnersList({}),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => usersService.createUser(data),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'OWNER_USER',
        ownerId: '',
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création",
        variant: "destructive",
      });
    },
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

  const handleCreate = () => {
    // Remove ownerId if empty or SUPER_ADMIN
    const dataToSend = {
      ...formData,
      ownerId: formData.role === USER_ROLES.SUPER_ADMIN || !formData.ownerId ? undefined : formData.ownerId,
    };
    createMutation.mutate(dataToSend);
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
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'OWNER_USER',
            ownerId: '',
          });
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
        onSubmit={handleCreate}
        loading={createMutation.isPending}
      >
        <div className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input
              placeholder="Nom de l'utilisateur"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <Label>Rôle</Label>
            <Select
              defaultValue={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as any, ownerId: '' })}
            >
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
          <div>
            <Label>Propriétaire</Label>
            <Select
              defaultValue={formData.ownerId}
              onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
              disabled={formData.role === USER_ROLES.SUPER_ADMIN}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.role === USER_ROLES.SUPER_ADMIN ? "Non requis pour Super Admin" : "Sélectionner un propriétaire"} />
              </SelectTrigger>
              <SelectContent>
                {ownersData?.data?.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      {/* View Dialog */}
      <FormDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title="Détails de l'utilisateur"
        submitText="Fermer"
        cancelText=""
        onSubmit={() => {
          setIsViewDialogOpen(false);
        }}
      >
        <div className="space-y-4">
          <div>
            <Label>Nom</Label>
            <div className="text-sm font-medium">{selectedUser?.name || '-'}</div>
          </div>
          <div>
            <Label>Email</Label>
            <div className="text-sm font-medium">{selectedUser?.email || '-'}</div>
          </div>
          <div>
            <Label>Rôle</Label>
            <div className="text-sm font-medium">{selectedUser?.role ? getRoleLabel(selectedUser.role) : '-'}</div>
          </div>
          <div>
            <Label>Propriétaire</Label>
            <div className="text-sm font-medium">
              {selectedUser?.owner && typeof selectedUser.owner === 'object' ? selectedUser.owner.name : '-'}
            </div>
          </div>
          <div>
            <Label>Actif</Label>
            <div className="text-sm font-medium">{selectedUser?.isActive ? 'Oui' : 'Non'}</div>
          </div>
          <div>
            <Label>Créé le</Label>
            <div className="text-sm font-medium">
              {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('fr-FR') : '-'}
            </div>
          </div>
        </div>
      </FormDialog>

      {/* Edit Dialog */}
      <FormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Modifier l'utilisateur"
        submitText="Enregistrer"
        cancelText="Annuler"
        onSubmit={() => {
          setIsEditDialogOpen(false);
        }}
      >
        <div className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input
              placeholder="Nom de l'utilisateur"
              value={selectedUser?.name || ''}
              disabled
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={selectedUser?.email || ''}
              disabled
            />
          </div>
          <div>
            <Label>Rôle</Label>
            <Select
              defaultValue={selectedUser?.role}
              disabled
            >
              <SelectTrigger>
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={USER_ROLES.OWNER_USER}>Utilisateur</SelectItem>
                <SelectItem value={USER_ROLES.OWNER_ADMIN}>Admin Propriétaire</SelectItem>
                <SelectItem value={USER_ROLES.SUPER_ADMIN}>Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Actif</Label>
            <Switch
              checked={selectedUser?.isActive || false}
              disabled
            />
          </div>
        </div>
      </FormDialog>
    </div>
  );
};

export default UsersListPage;
