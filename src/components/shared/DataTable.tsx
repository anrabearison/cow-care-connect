import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAdd?: () => void;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
  };
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  onEdit,
  onView,
  onDelete,
  onAdd,
  canAdd = true,
  canEdit = true,
  canDelete = true,
  canView = true,
  pagination,
  search,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {search && (
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        {canAdd && onAdd && (
          <Button onClick={onAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      {/* Table with horizontal scroll on mobile */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="whitespace-nowrap">
                  {column.header}
                </TableHead>
              ))}
              {(canEdit || canView || canDelete) && (
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (canEdit || canView || canDelete ? 1 : 0)}
                  className="text-center text-muted-foreground py-8"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm">Chargement...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (canEdit || canView || canDelete ? 1 : 0)}
                  className="text-center text-muted-foreground py-8"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">📭</span>
                    <span className="text-sm">Aucune donnée disponible</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className="whitespace-nowrap">
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "-")}
                    </TableCell>
                  ))}
                  {(canEdit || canView || canDelete) && (
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        {canView && onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(item)}
                            className="h-8 w-8"
                            aria-label="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {canEdit && onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8"
                            aria-label="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(item)}
                            className="text-destructive hover:text-destructive h-8 w-8"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">Page {pagination.page} sur {totalPages} ({pagination.total} éléments)</span>
            <span className="sm:hidden">{pagination.page}/{totalPages} ({pagination.total})</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex-1 sm:flex-none"
              aria-label="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="flex-1 sm:flex-none"
              aria-label="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
