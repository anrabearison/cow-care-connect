import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAuth } from "@/features/auth/AuthContext";
import { usersService, User, CreateUserData } from "@/features/admin/services/usersService";
import { ownersService, Owner } from "@/features/admin/services/ownersService";
import { invitationsService, InvitationCreateData, InvitationResponse } from "@/features/admin/services/invitationsService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'OWNER_USER',
    ownerId: '',
  });
  const [invitationFormData, setInvitationFormData] = useState<InvitationCreateData>({
    email: '',
    role: 'OWNER_USER',
    ownerId: '',
  });
  const [createdInvitation, setCreatedInvitation] = useState<InvitationResponse | null>(null);

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
    queryKey: ["admin-owners", 1, 50],
    queryFn: () => ownersService.getOwnersList({ page: 1, per_page: 50 }),
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

  const createInvitationMutation = useMutation({
    mutationFn: (data: InvitationCreateData) => invitationsService.createInvitation(data),
    onSuccess: (invitation) => {
      toast({
        title: "Succès",
        description: "Invitation créée avec succès",
      });
      setCreatedInvitation(invitation);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'invitation",
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
    if (formData.role !== USER_ROLES.SUPER_ADMIN && !formData.ownerId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un propriétaire",
        variant: "destructive",
      });
      return;
    }

    // Remove ownerId if empty or SUPER_ADMIN
    const dataToSend = {
      ...formData,
      ownerId: formData.role === USER_ROLES.SUPER_ADMIN || !formData.ownerId ? undefined : formData.ownerId,
    };
    createMutation.mutate(dataToSend);
  };

  const handleCreateInvitation = () => {
    if (!invitationFormData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un email pour l'invitation",
        variant: "destructive",
      });
      return;
    }

    if (invitationFormData.role !== USER_ROLES.SUPER_ADMIN && !invitationFormData.ownerId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un propriétaire pour cette invitation",
        variant: "destructive",
      });
      return;
    }

    createInvitationMutation.mutate({
      email: invitationFormData.email,
      role: invitationFormData.role,
      ownerId: invitationFormData.role === USER_ROLES.SUPER_ADMIN ? undefined : invitationFormData.ownerId || undefined,
    });
  };

  const columns: Column<User>[] = [
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground mt-2">Gestion des utilisateurs</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => {
            setCreatedInvitation(null);
            setInvitationFormData({ email: '', role: 'OWNER_USER', ownerId: '' });
            setIsInvitationDialogOpen(true);
          }}>
            Créer une invitation
          </Button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-medium font-mono">{selectedUser.id}</p>
              </div>
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

      {/* Invitation Dialog */}
      <FormDialog
        open={isInvitationDialogOpen}
        onOpenChange={(open) => {
          setIsInvitationDialogOpen(open);
          if (!open) {
            setCreatedInvitation(null);
          }
        }}
        title="Créer une invitation"
        submitText="Générer"
        cancelText="Annuler"
        onSubmit={handleCreateInvitation}
        loading={createInvitationMutation.isPending}
      >
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={invitationFormData.email}
              onChange={(e) => setInvitationFormData({ ...invitationFormData, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Rôle</Label>
            <Select
              value={invitationFormData.role}
              onValueChange={(value) => setInvitationFormData({ ...invitationFormData, role: value as any, ownerId: '' })}
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
              value={invitationFormData.ownerId}
              onValueChange={(value) => setInvitationFormData({ ...invitationFormData, ownerId: value })}
              disabled={invitationFormData.role === USER_ROLES.SUPER_ADMIN}
            >
              <SelectTrigger>
                <SelectValue placeholder={invitationFormData.role === USER_ROLES.SUPER_ADMIN ? "Non requis pour Super Admin" : "Sélectionner un propriétaire"} />
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

          {createdInvitation && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="font-semibold">Invitation créée</p>
              <p className="text-sm text-muted-foreground mb-2">Copiez le lien ci-dessous et fournissez-le à la personne invitée.</p>
              <div className="rounded-md bg-white p-3 border border-slate-200 font-mono text-sm break-words">
                {`${APP_URLS.INVITATION}?token=${createdInvitation.token}`}
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label>Expire le</Label>
                  <p className="text-sm font-medium">{new Date(createdInvitation.expiresAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{createdInvitation.email}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${APP_URLS.INVITATION}?token=${createdInvitation.token}`);
                      toast({
                        title: "Copié",
                        description: "Le lien d'invitation a été copié dans le presse-papiers.",
                      });
                    } catch (error) {
                      console.error('Copy invitation link error:', error);
                      toast({
                        title: "Erreur",
                        description: "Impossible de copier le lien. Veuillez le copier manuellement.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Copier le lien
                </Button>
              </div>
            </div>
          )}
        </div>
      </FormDialog>

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
              value={formData.role}
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
              value={formData.ownerId}
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
