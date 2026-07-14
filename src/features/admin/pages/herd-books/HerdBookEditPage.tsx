import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import HerdBookForm, { HerdBookFormValues } from "../../components/HerdBookForm";
import { useHerdBook, useUpdateHerdBook } from "../../hooks/herdBooksHooks";

const HerdBookEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();

  const { data: herdBook, isLoading, error } = useHerdBook(id!);

  const initialData = useMemo<HerdBookFormValues | null>(() => {
    if (!herdBook) return null;
    return {
      reference: herdBook.reference || "",
      year: herdBook.year || new Date().getFullYear(),
      description: herdBook.description || "",
      ownerId: herdBook.ownerId || "",
    };
  }, [herdBook]);

  const updateMutation = useUpdateHerdBook({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Livre de troupeau mis à jour avec succès" });
      navigate('/admin/herd-books');
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
      uiToast({ title: "Erreur", description: msg, variant: "destructive" });
    },
  });

  const handleSubmit = (data: HerdBookFormValues) => {
    updateMutation.mutate({
      id: id!,
      data: {
        reference: data.reference,
        year: data.year,
        description: data.description || undefined,
        ownerId: data.ownerId || undefined,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !herdBook || !initialData) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/herd-books')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Erreur</h1>
        </div>
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive">
          Impossible de charger les données du livre de troupeau.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/herd-books')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Modifier le livre de troupeau</h1>
          <p className="text-muted-foreground mt-2">{herdBook.reference} – {herdBook.year}</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <HerdBookForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/herd-books')}
          isPending={updateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default HerdBookEditPage;
