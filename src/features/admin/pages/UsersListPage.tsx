import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/features/admin/hooks/usersHooks";
import { User } from "@/features/admin/services/usersService";
import { USER_ROLES, type UserRole, getRoleLabel, getRoleColor } from "@/constants/roles";

const UsersListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUsers({ page, q: search });

  const columns: Column<User>[] = [
    { key: "name", header: "Nom" },
    { key: "email", header: "Email" },
    { key: "role", header: "Rôle", render: (item) => <Badge style={{ backgroundColor: getRoleColor(item.role as UserRole) }}>{getRoleLabel(item.role as UserRole)}</Badge> },
    { key: "isActive", header: "État", render: (item) => <Badge variant={item.isActive ? "default" : "outline"}>{item.isActive ? "Actif" : "Inactif"}</Badge> },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground mt-2">Gestion des utilisateurs</p>
        </div>
        <Button onClick={() => navigate("/admin/users/new")}>Créer</Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => navigate(`/admin/users/${item.id}/edit`)}
        onView={(item) => navigate(`/admin/users/${item.id}`)}
        canEdit canView
        pagination={{ page, pageSize: 10, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />
    </div>
  );
};

export default UsersListPage;
