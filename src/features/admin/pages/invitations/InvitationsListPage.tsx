import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { FormDialog } from '@/components/shared/FormDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/features/auth/AuthContext';
import { ownersService } from '@/features/admin/services/ownersService';
import { invitationsService, InvitationCreateData, InvitationResponse } from '@/features/admin/services/invitationsService';
import { getRoleLabel, USER_ROLES, type UserRole, getRoleConstraints } from '@/constants/roles';
import { useCreateInvitation, useDeleteInvitation, useInvitations } from '../../hooks/invitationsHooks';
import { queryKeys } from '@/lib/queryKeys';

const InvitationsListPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationResponse | null>(null);
  const [invitationFormData, setInvitationFormData] = useState<InvitationCreateData>({
    email: '',
    role: 'OWNER_USER',
    ownerId: '',
  });
  const [createdInvitation, setCreatedInvitation] = useState<InvitationResponse | null>(null);

  const createInvitationMutation = useCreateInvitation();
  const deleteInvitationMutation = useDeleteInvitation();

  // Get role-based constraints
  const roleConstraints = getRoleConstraints(user?.role as UserRole, user?.ownerId);

  // Only fetch owners list for SUPER_ADMIN
  const { data: ownersData } = useQuery({
    queryKey: queryKeys.owners.list({ page: 1, per_page: 50 }),
    queryFn: () => ownersService.getOwnersList({ page: 1, per_page: 50 }),
    enabled: roleConstraints.canSelectOwner,
  });

  const { data: invitationsData, isLoading } = useInvitations({ email: search });

  const handleCreateInvitation = () => {
    if (!invitationFormData.email) {
      toast({
        title: 'Erreur',
        description: "Veuillez saisir un email pour l'invitation",
        variant: 'destructive',
      });
      return;
    }

    // Use role constraints to determine effective values
    const effectiveRole = roleConstraints.forcedRole || invitationFormData.role;
    const effectiveOwnerId = roleConstraints.forcedOwnerId || 
      (invitationFormData.role === USER_ROLES.SUPER_ADMIN ? undefined : invitationFormData.ownerId || undefined);

    if (!roleConstraints.canSelectOwner && !effectiveOwnerId) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un propriétaire pour cette invitation',
        variant: 'destructive',
      });
      return;
    }

    createInvitationMutation.mutate({
      email: invitationFormData.email,
      role: effectiveRole,
      ownerId: effectiveOwnerId,
    }, {
      onSuccess: (invitation) => {
        setCreatedInvitation(invitation);
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleDeleteInvitation = () => {
    if (selectedInvitation) {
      deleteInvitationMutation.mutate(selectedInvitation.id);
      setIsDeleteDialogOpen(false);
      setSelectedInvitation(null);
    }
  };

  const columns: Column<InvitationResponse>[] = [
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Rôle',
      render: (item) => getRoleLabel(item.role),
    },
    {
      key: 'ownerId',
      header: 'Propriétaire',
      render: (item) => {
        if (!item.ownerId) return '-';
        const owner = ownersData?.data?.find((o) => o.id === item.ownerId);
        if (!owner) return item.ownerId;
        return owner.city ? `${owner.name} (${owner.city})` : owner.name;
      },
    },
    {
      key: 'expiresAt',
      header: 'Expire le',
      render: (item) => new Date(item.expiresAt).toLocaleDateString('fr-FR'),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (item) => {
        const expired = new Date(item.expiresAt) < new Date();
        return (
          <Badge variant={expired ? 'destructive' : 'secondary'}>
            {expired ? 'Expirée' : item.usedAt ? 'Utilisée' : 'Active'}
          </Badge>
        );
      },
    },
    {
      key: 'usedAt',
      header: 'Utilisée',
      render: (item) => (item.usedAt ? 'Oui' : 'Non'),
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Invitations</h1>
          <p className="text-muted-foreground mt-2">Gérer les invitations d'accès</p>
        </div>
        <Button onClick={() => {
          setCreatedInvitation(null);
          setInvitationFormData({ email: '', role: 'OWNER_USER', ownerId: '' });
          setIsCreateDialogOpen(true);
        }}>
          Créer une invitation
        </Button>
      </div>

      <DataTable
        data={invitationsData?.data || []}
        columns={columns}
        loading={isLoading}
        onDelete={(item) => {
          setSelectedInvitation(item);
          setIsDeleteDialogOpen(true);
        }}
        canAdd={false}
        search={{ value: search, onChange: setSearch }}
      />

      <FormDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
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
            {!roleConstraints.canSelectOwner ? (
              <div className="p-2 border rounded-md bg-muted">
                Utilisateur Propriétaire
              </div>
            ) : (
              <Select
                value={invitationFormData.role}
                onValueChange={(value) => setInvitationFormData({ ...invitationFormData, role: value as UserRole, ownerId: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roleConstraints.allowedRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          {!roleConstraints.canSelectOwner ? (
            <div>
              <Label>Propriétaire</Label>
              <div className="p-2 border rounded-md bg-muted">
                {roleConstraints.forcedOwnerId}
              </div>
            </div>
          ) : (
            <div>
              <Label>Propriétaire</Label>
              <Select
                value={invitationFormData.ownerId}
                onValueChange={(value) => setInvitationFormData({ ...invitationFormData, ownerId: value })}
                disabled={invitationFormData.role === USER_ROLES.SUPER_ADMIN}
              >
                <SelectTrigger>
                  <SelectValue placeholder={invitationFormData.role === USER_ROLES.SUPER_ADMIN ? 'Non requis pour Super Admin' : 'Sélectionner un propriétaire'} />
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
          )}
        </div>
      </FormDialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer l'invitation"
        description={`Êtes-vous sûr de vouloir supprimer l'invitation pour ${selectedInvitation?.email} ?`}
        onConfirm={handleDeleteInvitation}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={deleteInvitationMutation.isPending}
      />
    </div>
  );
};

export default InvitationsListPage;
