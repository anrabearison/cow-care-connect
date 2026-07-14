import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { eventsService, Event } from "@/features/admin/services/eventsService";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";

const EventsListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: data, isLoading } = useQuery({
    queryKey: queryKeys.events.list({ page, q: search }),
    queryFn: () =>
      eventsService.getEventsList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  const columns: Column<Event>[] = [
    { key: "cattle", header: "Bovin", render: (item) => {
      if (!item.cattle) return "-";
      if (typeof item.cattle === 'string') return item.cattle;
      if (item.cattle.name) return String(item.cattle.name);
      return "-";
    }},
    { key: "eventType", header: "Type", render: (item) => {
      if (!item.eventType) return "-";
      if (typeof item.eventType === 'string') return item.eventType;
      if (item.eventType.name) return String(item.eventType.name);
      return "-";
    }},
    { key: "date", header: "Date", render: (item) => new Date(item.date).toLocaleDateString("fr-FR") },
    { key: "description", header: "Description", render: (item) => item.description?.slice(0, 50) + (item.description?.length > 50 ? "..." : "") || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Événements</h1>
          <p className="text-muted-foreground mt-2">Historique des événements</p>
        </div>
        <Button onClick={() => navigate("/admin/events/new")}>Créer</Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={(item) => navigate(`/admin/events/${item.id}/edit`)}
        onView={(item) => navigate(`/admin/events/${item.id}`)}
        canEdit canView
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />
    </div>
  );
};

export default EventsListPage;
